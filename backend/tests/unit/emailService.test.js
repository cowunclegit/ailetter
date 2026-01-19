const EmailService = require('../../src/services/emailService');
const NewsletterModel = require('../../src/models/newsletterModel');
const { generateNewsletterHtml } = require('../../src/utils/emailTemplate');

jest.mock('../../src/models/newsletterModel');
jest.mock('../../src/utils/emailTemplate');

describe('EmailService', () => {
  let service;

  beforeEach(() => {
    service = new EmailService();
    jest.clearAllMocks();
  });

  it('sendTestNewsletter generates a UUID and sends an email', async () => {
    const mockNewsletter = {
      id: 1,
      issue_date: '2026-01-19',
      items: [{ id: 101, title: 'Trend 1' }]
    };

    NewsletterModel.getById.mockResolvedValue(mockNewsletter);
    NewsletterModel.updateConfirmationUuid.mockResolvedValue(true);
    generateNewsletterHtml.mockReturnValue('<html>Test</html>');

    const result = await service.sendTestNewsletter(1);

    expect(NewsletterModel.updateConfirmationUuid).toHaveBeenCalledWith(1, expect.any(String));
    expect(generateNewsletterHtml).toHaveBeenCalledWith(mockNewsletter.items, null, expect.any(String));
    expect(result.recipient).toBe('admin@example.com');
    expect(result.uuid).toBeDefined();
  });
});
