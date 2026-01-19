const NewsletterService = require('../../src/services/newsletterService');
const NewsletterModel = require('../../src/models/newsletterModel');

jest.mock('../../src/models/newsletterModel');

describe('NewsletterService', () => {
  let service;

  beforeEach(() => {
    service = new NewsletterService();
    jest.clearAllMocks();
  });

  describe('clearDraftItems', () => {
    it('should clear items from the active draft', async () => {
      // Mock getActiveDraft to return a draft
      const mockDraft = { id: 123, status: 'draft' };
      NewsletterModel.getActiveDraft.mockResolvedValue(mockDraft);
      NewsletterModel.clearItems.mockResolvedValue(true);

      const result = await service.clearDraftItems();

      expect(NewsletterModel.getActiveDraft).toHaveBeenCalled();
      expect(NewsletterModel.clearItems).toHaveBeenCalledWith(123);
      expect(result).toEqual({ success: true, message: 'Draft cleared' });
    });

    it('should throw error if no active draft exists', async () => {
      NewsletterModel.getActiveDraft.mockResolvedValue(null);

      await expect(service.clearDraftItems())
        .rejects
        .toThrow('No active draft found');

      expect(NewsletterModel.getActiveDraft).toHaveBeenCalled();
      expect(NewsletterModel.clearItems).not.toHaveBeenCalled();
    });
  });
});
