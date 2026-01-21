const TrendItemModel = require('../models/trendItemModel');
const MockAiProvider = require('./providers/mockAiProvider');

class AiService {
  constructor(provider = null) {
    // Default to MockAiProvider, but allow injection for testing or future providers
    this.provider = provider || new MockAiProvider();
  }

  async processTrends(items) {
      if (!items || items.length === 0) return [];

      const selectedIds = await this.selectTopTrends(items);
      
      for (const id of selectedIds) {
          await TrendItemModel.updateAiSelection(id, true);
      }
      return selectedIds;
  }

  async selectTopTrends(items) {
    if (items.length <= 20) {
        return items.map(i => i.id);
    }

    const prompt = `
      You are an expert AI trend curator. Analyze the following list of AI-related articles/videos and select the top 20 most significant, high-quality, and reliable items for a weekly newsletter.
      
      Input Format: JSON array of objects { id, title, summary }
      Output Format: JSON object with a single key "selected_ids" containing an array of the IDs of the selected items.

      Items:
      ${JSON.stringify(items.map(i => ({ id: i.id, title: i.title, summary: i.summary ? i.summary.substring(0, 200) : '' })))}`;

    try {
      const response = await this.provider.getJsonCompletion(prompt, {
        response_format: { type: "json_object" }
      });

      return response.selected_ids || [];
    } catch (error) {
      console.error('AI Selection Error:', error);
      // Fallback: return top 20 items
      return items.slice(0, 20).map(i => i.id);
    }
  }

  resolvePrompt(template, items) {
    const contentList = items.map(item => `- ${item.title}: ${item.summary || ''}`).join('\n');
    return template.replace('${contentList}', contentList);
  }

  async generateSubject(promptTemplate, items) {
    const resolvedPrompt = this.resolvePrompt(promptTemplate, items);

    try {
      const content = await this.provider.getCompletion(resolvedPrompt);
      return content.trim();
    } catch (error) {
      console.error('AI Subject Recommendation Error:', error);
      throw error;
    }
  }
}

module.exports = AiService;