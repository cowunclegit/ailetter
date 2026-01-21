const Parser = require('rss-parser');
const { google } = require('googleapis');
const axios = require('axios');
const he = require('he');
const metascraper = require('metascraper')([
  require('metascraper-image')()
]);

class Collector {
  constructor() {
    this.parser = new Parser({
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      }
    });
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

  async fetchAndBase64(imageUrl) {
    if (!imageUrl) return null;
    try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const contentType = response.headers['content-type'];
      const base64 = Buffer.from(response.data, 'binary').toString('base64');
      return `data:${contentType};base64,${base64}`;
    } catch (error) {
      console.error(`Error fetching image for base64: ${imageUrl}`, error.message);
      return null;
    }
  }

  async collectFromRSS(url) {
    const feed = await this.parser.parseURL(url);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return feed.items
      .filter(item => {
        const pubDate = new Date(item.pubDate);
        return pubDate >= oneMonthAgo;
      })
      .map(item => ({
        title: item.title,
        source_url: item.link,
        content: he.decode(item.contentSnippet || ''),
        published_at: new Date(item.pubDate).toISOString(),
        thumbnail_url: null // Will be filled later
      }));
  }

  // Simplified YouTube for now
  async collectFromYoutube(channelId) {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const response = await this.youtube.search.list({
      channelId: channelId,
      part: 'snippet',
      order: 'date',
      maxResults: 10,
      type: 'video',
      publishedAfter: oneMonthAgo.toISOString()
    });

    return response.data.items.map(item => ({
      title: he.decode(item.snippet.title),
      source_url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      content: he.decode(item.snippet.description),
      published_at: item.snippet.publishedAt,
      thumbnail_url: item.snippet.thumbnails.high.url
    }));
  }
}

const collector = new Collector();

module.exports = {
  collectFromRSS: (url) => collector.collectFromRSS(url),
  collectFromYoutube: (id) => collector.collectFromYoutube(id),
  extractThumbnail: (url) => collector.extractThumbnail(url),
  fetchAndBase64: (url) => collector.fetchAndBase64(url)
};
