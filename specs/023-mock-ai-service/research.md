# Research: Mock AI Service Integration

## Decision
Implement a generic `AiProvider` interface and a `MockAiProvider` that replaces the direct `openai` dependency in `AiService`.

## Rationale
The system currently relies directly on the `openai` library within `AiService`. By abstracting this into a provider pattern, we can easily swap the mock implementation for a custom API in the future without modifying the business logic in `AiService`. This also allows the system to run without external API keys.

## Analysis of Current AI Usage
- **`selectTopTrends(items)`**: Uses GPT-3.5-turbo to select 20 items from a list. Expects JSON output with `selected_ids`.
- **`generateSubject(promptTemplate, items)`**: Uses GPT-3.5-turbo to generate a subject line. Expects a plain text string.

## Mock Implementation Strategy
- **`selectTopTrends`**: Return the first 20 items' IDs from the input list.
- **`generateSubject`**: Return a deterministic subject line like `"[Mock AI] Trending AI Topics: " + (first item's title)`.
- **Generic Interface**: Define a contract that any AI provider must implement:
  - `chatCompletion(prompt, options)` -> returns string or JSON object.

## Alternatives Considered
1. **Directly mocking `openai` library in `AiService`**: This would still leave the `openai` dependency in `package.json` and keep the code coupled to OpenAI's SDK structure.
2. **Conditional Logic in `AiService`**: Using `if (config.useMock) ...`. This leads to messy code as more providers or custom APIs are added.

## Conclusion
The provider pattern is the most robust approach. It fulfills the requirement of removing the `openai` dependency and simplifies future implementation of a custom API.
