const AiService = require('../../src/services/aiService');
const MockAiProvider = require('../../src/services/providers/mockAiProvider');

jest.mock('../../src/services/providers/mockAiProvider');

describe('AiService', () => {
  let service;
  let mockProviderInstance;

  beforeEach(() => {
    mockProviderInstance = {
      getJsonCompletion: jest.fn(),
      getCompletion: jest.fn(),
    };
    MockAiProvider.mockImplementation(() => mockProviderInstance);
    service = new AiService();
  });

  it('should return all item IDs when count is less than or equal to 20 without calling provider', async () => {
    const mockItems = [
      { id: 1, title: 'AI Trend 1', summary: 'Summary 1' },
      { id: 2, title: 'Boring News', summary: 'Summary 2' },
    ];
    
    const selectedIds = await service.selectTopTrends(mockItems);
    expect(selectedIds).toEqual([1, 2]);
    expect(mockProviderInstance.getJsonCompletion).not.toHaveBeenCalled();
  });

  it('should call provider for more than 20 items', async () => {
    const mockItems = Array.from({ length: 25 }, (v, i) => ({ id: i + 1, title: `Test ${i + 1}` }));
    mockProviderInstance.getJsonCompletion.mockResolvedValue({ selected_ids: [1, 2, 3] });
    
    const selectedIds = await service.selectTopTrends(mockItems);
    expect(mockProviderInstance.getJsonCompletion).toHaveBeenCalled();
    expect(selectedIds).toEqual([1, 2, 3]);
  });

  it('should handle provider errors and return a fallback', async () => {
    mockProviderInstance.getJsonCompletion.mockRejectedValue(new Error('Provider Error'));
    const mockItems = Array.from({ length: 25 }, (v, i) => ({ id: i + 1, title: `Test ${i + 1}` }));
    
    const selectedIds = await service.selectTopTrends(mockItems);
    expect(selectedIds).toHaveLength(20);
  });

  it('should generate subject using provider', async () => {
    const mockItems = [{ title: 'Item 1' }];
    mockProviderInstance.getCompletion.mockResolvedValue('Mock Subject');
    
    const subject = await service.generateSubject('Template ${contentList}', mockItems);
    expect(subject).toBe('Mock Subject');
    expect(mockProviderInstance.getCompletion).toHaveBeenCalled();
  });
});