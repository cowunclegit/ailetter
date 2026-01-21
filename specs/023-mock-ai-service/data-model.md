# Data Model: Mock AI Service Integration

## Entities

### AI Provider Config
This is not a database entity but a configuration structure.

- **providerType**: String (`'mock'`, `'openai'`, or `'custom'`)
- **options**: Object containing provider-specific settings.

## Service Abstraction

### AiProvider (Interface/Contract)
Methods:
- `getCompletion(prompt, options)`: Returns a string response.
- `getJsonCompletion(prompt, options)`: Returns a parsed JSON object.

### MockAiProvider (Implementation)
Implements `AiProvider`.
- Returns deterministic responses based on input.

### AiService (Orchestrator)
- Holds an instance of `AiProvider`.
- `processTrends(items)`: Delegates to `AiProvider.getJsonCompletion`.
- `generateSubject(template, items)`: Delegates to `AiProvider.getCompletion`.
