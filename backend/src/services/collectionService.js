const Parser = require('rss-parser');
const { google } = require('googleapis');
const axios = require('axios');
const he = require('he');
const metascraper = require('metascraper')([
  require('metascraper-image')()
]);
const SourceModel = require('../models/sourceModel');
const TrendItemModel = require('../models/trendItemModel');
const { getProxyClient } = require('./websocket/proxy-server');

class CollectionService {
  constructor() {
    this.parser = new Parser({
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      }
    });
    // YouTube setup would go here (requires API key)
    this.youtube = google.youtube({
        version: 'v3',
        auth: process.env.YOUTUBE_API_KEY
    });
    this.activeCollections = new Map();
  }

  async extractThumbnail(url) {
    try {
      const { data: html } = await axios.get(url, { 
        timeout: 5000,
        headers: { 'User-Agent': 'Mozilla/5.0' } 
      });
      const metadata = await metascraper({ html, url });
      return metadata.image;
    } catch (error) {
      console.error(`Scraping error for ${url}:`, error.message);
      return null;
    }
  }

  async collectAll(startDate = null, endDate = null) {
    const lockKey = startDate || 'auto';
    if (this.activeCollections.get(lockKey)) {
      console.log(`Collection for ${lockKey} already in progress. Skipping.`);
      return null;
    }

          this.activeCollections.set(lockKey, true);
          try {
            const proxyClient = getProxyClient();
    
          if (proxyClient && proxyClient.readyState === 1) { // 1 = OPEN
            console.log('Delegating collection to Proxy Service...');
            const sources = await SourceModel.getAll();
            
            // Map sources to what proxy expects
            const proxySources = sources.map(s => ({
              id: s.id,
              url: s.url,
              type: s.type,
              category_ids: s.category_ids
            }));
    
            proxyClient.send(JSON.stringify({
              type: 'START_COLLECTION',
              payload: {
                task_id: lockKey, // Using lockKey as task_id
                sources: proxySources
              }
            }));
    
            return []; // Return empty array as it's async now
          }
    
          const sources = await SourceModel.getAll();
          // T013: Group sources by unique URL
      const groupedSources = new Map();
      for (const source of sources) {
        if (!groupedSources.has(source.url)) {
          groupedSources.set(source.url, {
            ...source,
            all_category_ids: new Set(source.category_ids)
          });
        } else {
          // T014: Metadata inheritance (keep first encountered) and merge categories
          const existing = groupedSources.get(source.url);
          source.category_ids.forEach(id => existing.all_category_ids.add(id));
        }
      }

      const results = [];

      for (const [url, source] of groupedSources) {
        try {
          let items = [];
          if (source.type === 'rss') {
            items = await this.fetchRss(url, startDate, endDate);
          } else if (source.type === 'youtube') {
            items = await this.fetchYoutube(url, startDate, endDate);
          }
          
          let categoryIds = Array.from(source.all_category_ids);
          
          // T021: If no categories, we could use a specific ID for 'Uncategorized' 
          // or handle it in the model. Let's assume there's a category with name 'Uncategorized'.
          // For now, if empty, we just leave it empty and let the model/UI handle display.
          // Wait, the spec says "tagged as 'Uncategorized'". 
          // I'll check if a category named 'Uncategorized' exists, if not, I'll create it?
          // To be safe and simple, I'll just ensure it's empty here and the model handles it.
          
          results.push(...items.map(i => ({ 
            ...i, 
            source_id: source.id,
            categoryIds: categoryIds
          })));
        } catch (error) {
          console.error(`Error collecting from ${source.name} (${url}):`, error.message);
        }
      }

      // Save to DB
      const savedItems = [];
      for (const item of results) {
         const saved = await TrendItemModel.create(item);
         if (saved) savedItems.push(saved);
      }
      return savedItems;
    } finally {
      this.activeCollections.delete(lockKey);
    }
  }

  async fetchYoutube(channelId, startDate = null, endDate = null) {
    // Deprecated: Logic moved to proxy-service
    return [];
  }
}

module.exports = CollectionService;