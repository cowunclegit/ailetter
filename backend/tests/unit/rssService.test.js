const Parser = require('rss-parser');
const axios = require('axios');
const CollectionService = require('../../src/services/collectionService');

jest.mock('rss-parser');
jest.mock('axios');
jest.mock('metascraper', () => {
  return jest.fn().mockImplementation(() => {
    return jest.fn().mockResolvedValue({ image: 'http://test.com/og.jpg' });
  });
});

describe('CollectionService (RSS)', () => {
  let service;
  let mockParser;

  beforeEach(() => {
    process.env.YOUTUBE_API_KEY = 'test-key';
    mockParser = new Parser();
    service = new CollectionService();
    service.parser = mockParser;
    axios.get.mockResolvedValue({ data: '<html></html>' });
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

    service.youtube.search.list = jest.fn().mockResolvedValue(mockYoutubeResponse);

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

    service.youtube.search.list = jest.fn().mockResolvedValue(mockYoutubeResponse);

    const items = await service.fetchYoutube('channelId');
    expect(items[0].thumbnail_url).toBeUndefined();
  });

  it('should handle scraping errors gracefully', async () => {
    mockParser.parseURL.mockRejectedValue(new Error('Parse error'));
    await expect(service.fetchRss('http://badfeed.com')).rejects.toThrow('Parse error');
  });
});