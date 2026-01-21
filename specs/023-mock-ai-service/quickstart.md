# Quickstart: Mock AI Service

## Overview
This feature replaces the `openai` dependency with a mock implementation to allow development and testing without an API key.

## Setup
1. The `openai` library will be removed from `backend/package.json`.
2. The `AiService` is automatically configured to use the `MockAiProvider`.

## Usage
No changes are required in the frontend or other services. The `AiService` maintains its existing API:

```javascript
const AiService = require('./services/aiService');
const aiService = new AiService();

// Curation
const selectedIds = await aiService.processTrends(items);

// Subject Generation
const subject = await aiService.generateSubject(template, items);
```

## Testing
Run existing AI-related tests:
```bash
cd backend
npm test tests/unit/aiService.test.js
npm test tests/unit/aiService_templates.test.js
```
The tests should pass using the mock provider without requiring `OPENAI_API_KEY`.
