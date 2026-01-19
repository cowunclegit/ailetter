const OpenAI = require('openai');
const TrendItemModel = require('../models/trendItemModel');
const config = require('../config/env');

class AiService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey,
    });
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
      const completion = await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
        response_format: { type: "json_object" },
      });

      const response = JSON.parse(completion.choices[0].message.content);
      return response.selected_ids || [];
    } catch (error) {
      console.error('AI Selection Error:', error);
      // Fallback: return top 20 by date (assuming input was sorted or just taking first 20)
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
      const completion = await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: resolvedPrompt }],
        model: 'gpt-3.5-turbo',
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.error('AI Subject Recommendation Error:', error);
      throw error;
    }
  }
}

module.exports = AiService;
