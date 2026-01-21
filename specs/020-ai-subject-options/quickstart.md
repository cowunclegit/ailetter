# Quickstart: AI Subject Recommendation Options

## Setup
1. **Migration**: Run the database migration to create the `ai_subject_presets` table.
   ```bash
   node backend/src/db/migrate_020_ai_presets.js
   ```
2. **LLM API**: Ensure `CUSTOM_LLM_ENDPOINT` is set in `.env`.

## Verification
1. **Manage Presets**:
   - Go to the new Settings page.
   - Create a preset "For Developers" with prompt: `Generate a subject for developers based on: ${contentList}`.
2. **Generate Subject**:
   - Go to a newsletter draft with items.
   - Select "For Developers" from the dropdown.
   - Click "AI Recommend".
   - Verify the subject updates correctly.

## Effective Prompt Examples

### For Technical Audiences
`You are a senior software engineer. Based on the following articles, suggest a concise, technical newsletter subject line that highlights specific technologies mentioned. Focus on "What's new" and "How-to" value: ${contentList}`

### For Executive/Business Audiences
`You are a business strategist. Analyze these AI trends and suggest a subject line that emphasizes ROI, market impact, and strategic decision-making. Keep it professional and high-level: ${contentList}`

### For General Interest/Click-worthy
`You are a professional copywriter. Create a catchy, engaging, and slightly curiosity-driven subject line for a general interest AI newsletter based on these items. Avoid clickbait but ensure high open rates: ${contentList}`

