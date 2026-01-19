# Quickstart: Source Categories

## Overview
This feature adds the ability to organize Sources into Categories (e.g., "AI", "UX"). It includes a new management page for categories and updates the Source creation/edit flow.

## Prerequisites
- Backend running on `http://localhost:3000` (or configured port)
- Frontend running on `http://localhost:5173` (or configured port)
- Database migrated to include `source_categories` table

## Usage Guide

### Managing Categories
1. Navigate to the new **Categories** page in the sidebar/menu.
2. **Add**: Enter a name in the input field and click "Add".
3. **Edit**: Click the edit icon next to a category to rename it.
4. **Delete**: Click the trash icon to remove a category. *Note: Linked sources will become uncategorized.*

### Assigning Categories
1. Navigate to the **Sources** page (Dashboard).
2. Click "Add Source" or edit an existing source.
3. Select a category from the new **Category** dropdown.
4. Save the source.

### Filtering
1. On the **Sources** page, use the filter dropdown at the top to show only sources from a specific category.

## Testing
- Run backend tests: `npm test` in `backend/`
- Run frontend tests: `npm test` in `frontend/`
