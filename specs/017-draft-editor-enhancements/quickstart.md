# Quickstart: Draft Editor Enhancements

## Setup
1. **Migrations**: Run the new migration to update the `newsletters` table.
   ```bash
   node backend/src/db/migrate_017_newsletter_fields.js
   ```
2. **Frontend Dependencies**: Install `react-quill-new`.
   ```bash
   cd frontend && npm install react-quill-new --legacy-peer-deps
   ```

## Development
1. Start the backend: `cd backend && npm run dev`
2. Start the frontend: `cd frontend && npm run dev`
3. Navigate to `/newsletters/draft/:id` to see the updated editor.

## Verification
1. **Edit Subject**: Change the subject and verify it persists after refresh.
2. **AI Recommend**: Click the AI button and verify "(AI 추천 제목)" is appended.
3. **Rich Text**: Enter formatted text in Intro/Outro and verify formatting is preserved.
4. **Delete Item**: Click the delete icon on an article and verify it disappears from the list and preview.
5. **Reorder**: Drag items to new positions and verify the order is saved.
