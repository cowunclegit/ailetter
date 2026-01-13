const { generateNewsletterHtml } = require('../../src/utils/emailTemplate');

describe('Email Template', () => {
  it('should render items and token into HTML', () => {
    const items = [
      { title: 'Item 1', original_url: 'http://a.com' },
      { title: 'Item 2', original_url: 'http://b.com' },
    ];
    const token = 'test-token';
    const html = generateNewsletterHtml(items, token);
    expect(html).toContain('<h1>AI Weekly Trends</h1>');
    expect(html).toContain('Item 1');
    expect(html).toContain('http://b.com');
    expect(html).toContain('?token=test-token');
  });
});