const { generateNewsletterHtml } = require('../../src/utils/emailTemplate');

describe('Email Template', () => {
  it('should render items and token into HTML', () => {
    const items = [
      { title: 'Item 1', original_url: 'http://a.com' },
      { title: 'Item 2', original_url: 'http://b.com' },
    ];
    const newsletter = {
      items,
      subject: 'Test Subject',
      template_id: 'default'
    };
    const token = 'test-token';
    const html = generateNewsletterHtml(newsletter, token);
    expect(html).toContain('Test Subject');
    expect(html).toContain('Item 1');
    expect(html).toContain('http://b.com');
    expect(html).toContain('?token=test-token');
  });
});