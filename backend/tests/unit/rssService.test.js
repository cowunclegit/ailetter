const Parser = require('rss-parser');
const axios = require('axios');
const CollectionService = require('../../src/services/collectionService');

jest.mock('rss-parser');
jest.mock('axios');

jest.mock('metascraper', () => {
  const m = jest.fn().mockResolvedValue({ image: 'http://test.com/og.jpg' });
  const fn = jest.fn().mockImplementation(() => m);
  fn.mockScraper = m; // Attach it so we can access it
  return fn;
});

const metascraper = require('metascraper');

describe('CollectionService (RSS)', () => {
  let service;
  let mockParser;

  beforeEach(() => {
    process.env.YOUTUBE_API_KEY = 'test-key';
    mockParser = new Parser();
    service = new CollectionService();
    service.parser = mockParser;
    axios.get.mockResolvedValue({ data: '<html></html>' });
    // Initialize YouTube mock
    service.youtube.search.list = jest.fn();
  });

  afterEach(() => {
    delete process.env.YOUTUBE_API_KEY;
  });

  it('should parse RSS feed items and extract thumbnails', async () => {
    const mockFeed = {
      items: [
        { title: 'Test Item', link: 'http://test.com', pubDate: new Date().toISOString() },
      ],
    };

    mockParser.parseURL.mockResolvedValue(mockFeed);

    const items = await service.fetchRss('http://feed.com');
    expect(items).toHaveLength(1);
    expect(items[0].thumbnail_url).toBe('http://test.com/og.jpg');
  });

  it('should extract YouTube thumbnails correctly', async () => {
    // Mock YouTube API response
    const mockYoutubeResponse = {
      data: {
        items: [
          {
            id: { videoId: '123' },
            snippet: {
              title: 'Video Title',
              publishedAt: new Date().toISOString(),
              description: 'Desc',
              thumbnails: {
                high: { url: 'http://yt.com/high.jpg' }
              }
            }
          }
        ]
      }
    };

    service.youtube.search.list.mockResolvedValue(mockYoutubeResponse);

    const items = await service.fetchYoutube('channelId');
    expect(items[0].thumbnail_url).toBe('http://yt.com/high.jpg');
  });

  it('should handle missing thumbnails gracefully', async () => {
    const mockYoutubeResponse = {
      data: {
        items: [
          {
            id: { videoId: '123' },
            snippet: {
              title: 'Video Title',
              publishedAt: new Date().toISOString(),
              description: 'Desc',
              thumbnails: {}
            }
          }
        ]
      }
    };

    service.youtube.search.list.mockResolvedValue(mockYoutubeResponse);

    const items = await service.fetchYoutube('channelId');
    expect(items[0].thumbnail_url).toBeUndefined();
  });

    it('should handle scraping errors gracefully', async () => {
      metascraper.mockScraper.mockRejectedValueOnce(new Error('Scraping failed'));
      
      const thumb = await service.extractThumbnail('http://error.com');
      expect(thumb).toBeNull();
    });

    it('should decode HTML entities in YouTube titles', async () => {
      process.env.YOUTUBE_API_KEY = 'valid_key';
      service.youtube.search.list.mockResolvedValueOnce({
        data: {
          items: [{
            id: { videoId: 'abc' },
            snippet: {
              title: 'Meta&#39;s New AI',
              description: 'Description with &amp; entity',
              publishedAt: new Date().toISOString(),
              thumbnails: { high: { url: 'http://thumb.jpg' } }
            }
          }]
        }
      });

      const items = await service.fetchYoutube('channelId', '2000-01-01', '2100-01-01');
      expect(items[0].title).toBe("Meta's New AI");
      expect(items[0].summary).toBe("Description with & entity");
    });
  });