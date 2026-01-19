# Quickstart: Dashboard Content List Reset

## Overview
This feature adds a "Reset" button to the dashboard that clears all selected items from the current draft and resets search/date filters.

## Manual Verification Steps

1. **Setup**: Ensure the backend is running and you have an active draft with some items selected.
2. **Navigate**: Open the Dashboard (`/`).
3. **Select**: Click the checkboxes on a few Trend Cards to add them to the draft.
4. **Filter**: Type something in the search bar or change the date range so some items are hidden.
5. **Reset**:
   - Click the "Reset Selection" button in the toolbar.
   - Verify the confirmation dialog appears (MUI style).
   - Click "Confirm".
6. **Verify**:
   - All checkboxes should become unchecked immediately.
   - The search bar should be cleared.
   - The date range should reset to default (e.g., current week).
   - Reload the page to ensure the draft is empty on the backend (checkboxes remain unchecked).

## Troubleshooting
- **Button Disabled?**: Ensure you actually have items selected. The button is disabled if the draft is empty.
- **Error?**: Check the browser console and network tab for `POST /active-draft/clear` failures.
