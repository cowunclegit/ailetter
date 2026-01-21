# Research: Draft Editor Enhancements

## Rich Text Editor Selection
- **Decision**: Use `react-quill` for the Introduction and Conclusion editors.
- **Rationale**: It is a mature, well-documented React wrapper for Quill.js that outputs clean HTML, which is perfect for email templates. It is easy to style and integrate with Material UI.
- **Alternatives considered**: 
    - `Draft.js`: Too complex and lower-level than needed.
    - `Slate.js`: High learning curve, possibly overkill for simple intro/outro text.
    - Standard `textarea`: Doesn't provide the rich text experience requested.

## Drag & Drop Item Deletion
- **Decision**: Add an `IconButton` with `Delete` icon to the right side of the `DraggableItem` component.
- **Rationale**: Provides a clear, one-click way to remove items while preserving the drag handle for reordering.
- **Implementation**: The delete action will trigger a call to the existing `toggleItem` model method (or a new `removeItem` method) and update the local state.

## AI Subject Suggestions
- **Decision**: Implement a POST endpoint `/api/newsletters/:id/ai-recommend-subject`.
- **Rationale**: Decouples the frontend from the LLM logic. For the initial phase, the backend will simply append `(AI 추천 제목)` to the provided or current subject.
- **Future-proofing**: The endpoint is designed to eventually call a custom REST API for actual LLM processing.

## Data Persistence
- **Decision**: Add `subject`, `introduction_html`, and `conclusion_html` columns to the `newsletters` table.
- **Rationale**: Direct storage in the newsletter record is the most efficient way to maintain draft state and ensure the data is available during email generation.
- **Migration**: A new migration file `migrate_017_newsletter_fields.js` will be created.

## API Contracts
- **GET /api/newsletters/:id**: Returns updated newsletter object with new fields.
- **PUT /api/newsletters/:id**: Updates subject, intro, and outro content.
- **POST /api/newsletters/:id/ai-recommend-subject**: Returns a suggested subject line.
- **DELETE /api/newsletters/:id/items/:trendItemId**: Removes an item from the draft.
