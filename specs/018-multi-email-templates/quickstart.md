# Quickstart: Multiple Email Templates

## Setup
1. **Database Migration**: Add `template_id` to the `newsletters` table.
   ```bash
   node backend/src/db/migrate_018_template_id.js
   ```
2. **Template Assets**: Ensure EJS files exist in `backend/src/utils/templates/`.
3. **Frontend Assets**: Add template thumbnails to `frontend/src/assets/templates/`.

## Verification
1. **List Templates**: Call `GET /api/templates` and verify 11 entries.
   - Available slugs: `classic-list`, `modern-grid`, `bold-hero`, `minimalist`, `dark-mode`, `tech-code`, `magazine`, `accent-blue`, `accent-green`, `accent-purple`, `compact`.
2. **Select Template**:
   - Create or open a draft.
   - Click a template card in the Grid UI.
   - Verify the preview updates immediately.
3. **Persistence**:
   - Refresh the page.
   - Verify the selected template is still active.
4. **Email Rendering**:
   - Send a test email.
   - Verify the received email layout matches the selected template.
   - **Requirement**: Verify all templates include thumbnails, titles, and content summaries.
