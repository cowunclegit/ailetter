const AiService = require('../../src/services/aiService');
const OpenAI = require('openai');

jest.mock('openai');

describe('AiService', () => {
  let service;
  let mockOpenAI;

  beforeEach(() => {
    mockOpenAI = {
      chat: {
        completions: {
          create: jest.fn(),
        },
      },
    };
    OpenAI.mockImplementation(() => mockOpenAI);
    service = new AiService();
  });

  it('should return all item IDs when count is less than or equal to 20', async () => {
    const mockItems = [
      { id: 1, title: 'AI Trend 1', summary: 'Summary 1' },
      { id: 2, title: 'Boring News', summary: 'Summary 2' },
    ];
    
    const selectedIds = await service.selectTopTrends(mockItems);
    expect(selectedIds).toEqual([1, 2]);
    expect(mockOpenAI.chat.completions.create).not.toHaveBeenCalled();
  });

  it('should handle API errors and return a fallback', async () => {
    mockOpenAI.chat.completions.create.mockRejectedValue(new Error('API Error'));
    const mockItems = Array.from({ length: 25 }, (v, i) => ({ id: i + 1, title: `Test ${i + 1}` }));
    const selectedIds = await service.selectTopTrends(mockItems);
    expect(selectedIds).toHaveLength(20); // Fallback logic
  });
});
