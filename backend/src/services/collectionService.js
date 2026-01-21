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
const { activeCollections } = require('./collectionState');

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
    if (activeCollections.get(lockKey)) {
      console.log(`Collection for ${lockKey} already in progress. Skipping.`);
      return null;
    }

    activeCollections.set(lockKey, true);
    try {
      const db = require('../db');
      const sources = await SourceModel.getAll();
      
      // Map sources to what proxy expects
      const proxySources = sources.map(s => ({
        id: s.id,
        url: s.url,
        type: s.type,
        category_ids: s.category_ids
      }));

      // Create a task in the database for the proxy to pick up via polling
      const taskId = require('uuid').v4();
      await new Promise((resolve, reject) => {
        db.run('INSERT INTO proxy_tasks (id, status, sources) VALUES (?, ?, ?)',
          [taskId, 'pending', JSON.stringify(proxySources)],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });

      console.log(`Created proxy task ${taskId} with ${proxySources.length} sources.`);
      return []; // Return empty array as it's async now via polling
    } finally {
      activeCollections.delete(lockKey);
    }
  }

  async fetchRss(url, startDate = null, endDate = null) {
    const feed = await this.parser.parseURL(url);
    const items = feed.items || [];
    const validItems = [];

    for (const item of items) {
      const pubDate = new Date(item.pubDate || item.isoDate);
      
      // Filter by date
      if (startDate && pubDate < new Date(startDate)) continue;
      if (endDate && pubDate > new Date(endDate)) continue;

      let thumbnail = null;
      // Try to find thumbnail in enclosure or media:content
      if (item.enclosure && item.enclosure.url && item.enclosure.type && item.enclosure.type.startsWith('image/')) {
        thumbnail = item.enclosure.url;
      } else if (item['media:content'] && item['media:content'].url) { // Basic RSS media extension support
        thumbnail = item['media:content'].url;
      } else {
        // Fallback to scraping
        thumbnail = await this.extractThumbnail(item.link);
      }

      validItems.push({
        title: item.title,
        original_url: item.link,
        published_at: pubDate.toISOString(),
        summary: item.contentSnippet || item.content,
        thumbnail_url: thumbnail
      });
    }
    return validItems;
  }

  async fetchYoutube(channelId, startDate = null, endDate = null) {
    try {
      const response = await this.youtube.search.list({
        part: 'snippet',
        channelId: channelId,
        maxResults: 50,
        order: 'date',
        publishedAfter: startDate,
        publishedBefore: endDate,
        type: 'video'
      });

      return response.data.items.map(item => ({
        title: he.decode(item.snippet.title),
        original_url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        published_at: item.snippet.publishedAt,
        summary: he.decode(item.snippet.description),
        thumbnail_url: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url
      }));
    } catch (error) {
      console.error(`YouTube fetch error for ${channelId}:`, error.message);
      return [];
    }
  }
}

module.exports = CollectionService;