# Research: AI Subject Recommendation Options

## Decision: Preset Persistence
- **Decision**: Store AI Subject Presets in a new SQLite table `ai_subject_presets`.
- **Rationale**: Presets need to be durable across sessions and editable by the user. A dedicated table provides structured storage and standard CRUD capabilities.
- **Alternatives considered**: 
    - JSON file: Harder to manage concurrent edits and relations.
    - LocalStorage: Not shared across devices/browsers.

## Decision: `${contentList}` Processing
- **Decision**: The backend will handle the placeholder replacement before calling the LLM.
- **Rationale**: Keeps the client thin and ensures sensitive or large data (summaries) are handled efficiently on the server side. 
- **Format**: Draft items will be converted to a Markdown list: `- Title: Summary`.

## Decision: LLM REST API Integration
- **Decision**: Use an environment-configurable REST endpoint for the LLM.
- **Rationale**: Allows switching between different LLM providers (OpenAI, Anthropic, or custom internal APIs) without changing code.
- **Implementation**: `AiService` will be updated to accept a prompt template and dynamic data.

## Best Practices
- **Prompt Safety**: Sanitize user-provided prompts to prevent injection attacks (though this is a single-user curator context, standard hygiene applies).
- **Graceful Failure**: If the LLM call fails, return a clear error to the UI and allow the user to retry or edit manually.
