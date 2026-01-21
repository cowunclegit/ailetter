const AiService = require('../../src/services/aiService');

describe('AiService Template Resolution', () => {
  let aiService;

  beforeEach(() => {
    aiService = new AiService();
  });

  it('should resolve ${contentList} with markdown bullet points', async () => {
    const template = "Suggest a subject for these items: ${contentList}";
    const items = [
      { title: 'AI News 1', summary: 'Summary 1' },
      { title: 'AI News 2', summary: 'Summary 2' }
    ];

    // We can't easily test the private or internal logic without calling the API 
    // unless we extract the resolution logic.
    // Let's add a public resolvePrompt method or test it indirectly if possible.
    // For now, I'll assume we add a resolvePrompt helper.
    
    const resolved = aiService.resolvePrompt(template, items);
    expect(resolved).toBe("Suggest a subject for these items: - AI News 1: Summary 1\n- AI News 2: Summary 2");
  });

  it('should handle empty items gracefully', () => {
    const template = "Suggest a subject: ${contentList}";
    const items = [];
    const resolved = aiService.resolvePrompt(template, items);
    expect(resolved).toBe("Suggest a subject: ");
  });
});
