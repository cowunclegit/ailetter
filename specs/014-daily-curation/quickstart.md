# Quickstart: Daily Curation

## Overview
This feature groups trend items by date on the dashboard and enables infinite scroll.

## Prerequisites
- Backend running on `http://localhost:3000`
- Frontend running on `http://localhost:5173`

## Usage Guide

### Viewing Daily Trends
1. Navigate to the **Dashboard**.
2. Observe that items are now separated by Date headers (e.g., "Today", "Yesterday", "Jan 15, 2026").
3. Scroll down. As you reach the bottom, older items should automatically load and append to the list with correct date headers.
4. Verify that date headers "stick" to the top as you scroll through a long day's list.

## Testing

### Manual Testing
1. **Scrolling**: Scroll quickly to ensure data loads without error.
2. **Date Boundaries**: Verify that items from different days are clearly separated.
3. **Empty State**: (If applicable) Ensure empty days don't show blank headers (logic should prevent this).

### Automated Testing
- Run `npm test` in `backend/` to verify the paginated API response.
- Run `npm test` in `frontend/` to verify the grouping utility functions.
