const AiProvider = require('./aiProvider');

class MockAiProvider extends AiProvider {
  async getCompletion(prompt, options = {}) {
    // Basic pattern matching to simulate context awareness
    if (prompt.includes('subject line') || prompt.includes('Subject:')) {
      const match = prompt.match(/- ([^:]+):/);
      const firstTitle = match ? match[1] : 'Latest Trends';
      return `[Mock AI] Trending AI Topics: ${firstTitle}`;
    }
    return `This is a mock AI response for: ${prompt}`;
  }

  async getJsonCompletion(prompt, options = {}) {
    // Simulate trend selection: extract IDs from prompt and return top 20
    try {
      if (prompt.includes('Items:')) {
        const jsonPart = prompt.split('Items:')[1];
        const items = JSON.parse(jsonPart.trim());
        const selected_ids = items.slice(0, 20).map(item => item.id);
        return { selected_ids };
      }
    } catch (e) {
      // Fallback
    }
    return { selected_ids: [] };
  }
}

module.exports = MockAiProvider;
