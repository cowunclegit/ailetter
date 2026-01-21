const MockAiProvider = require('../../src/services/providers/mockAiProvider');

describe('MockAiProvider', () => {
  let provider;

  beforeEach(() => {
    provider = new MockAiProvider();
  });

  describe('getCompletion', () => {
    it('should return a deterministic subject line if the prompt looks like a subject request', async () => {
      const prompt = 'Generate a subject line for these items: - Item 1: Summary 1';
      const response = await provider.getCompletion(prompt);
      expect(response).toContain('[Mock AI] Trending AI Topics:');
      expect(response).toContain('Item 1');
    });

    it('should return a generic response for other prompts', async () => {
      const prompt = 'Hello';
      const response = await provider.getCompletion(prompt);
      expect(response).toBe('This is a mock AI response for: Hello');
    });
  });

  describe('getJsonCompletion', () => {
    it('should return the first 20 IDs if the prompt looks like a trend selection request', async () => {
      const items = Array.from({ length: 30 }, (_, i) => ({ id: i + 1, title: `Item ${i + 1}` }));
      const prompt = `Analyze the following list... Items: ${JSON.stringify(items)}`;
      
      const response = await provider.getJsonCompletion(prompt);
      expect(response).toHaveProperty('selected_ids');
      expect(response.selected_ids).toHaveLength(20);
      expect(response.selected_ids[0]).toBe(1);
      expect(response.selected_ids[19]).toBe(20);
    });

    it('should return all IDs if there are fewer than 20 items', async () => {
      const items = [{ id: 1, title: 'Item 1' }, { id: 2, title: 'Item 2' }];
      const prompt = `Analyze the following list... Items: ${JSON.stringify(items)}`;
      
      const response = await provider.getJsonCompletion(prompt);
      expect(response.selected_ids).toHaveLength(2);
      expect(response.selected_ids).toEqual([1, 2]);
    });
  });
});
