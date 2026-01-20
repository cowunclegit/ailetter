const { collectFromRSS } = require('../src/collector');
const Parser = require('rss-parser');

jest.mock('rss-parser');

describe('Collector Logic', () => {
  test('should parse RSS items and translate to trend_item schema', async () => {
    const mockFeed = {
      items: [
        {
          title: 'Test Title',
          link: 'https://example.com/test',
          contentSnippet: 'Test content',
          pubDate: '2026-01-20T12:00:00Z'
        }
      ]
    };

    Parser.prototype.parseURL.mockResolvedValue(mockFeed);

    const result = await collectFromRSS('https://example.com/rss');

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      title: 'Test Title',
      source_url: 'https://example.com/test',
      content: 'Test content'
    });
  });
});
