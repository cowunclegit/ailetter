# Quickstart: Simplified Dashboard Integration

## Overview
This feature removes the week-based filter and the AI badge, replacing them with a unified 4-week chronological list that explicitly marks items as "Sent" or "In Draft".

## Backend Implementation
1. **Model Update**: Update `TrendItemModel.getAll` to perform a join with `newsletter_items` and `newsletters`.
2. **Controller Update**: Update `GET /api/trends` to default to a 28-day window if `startDate` is missing.

## Frontend Implementation
1. **Component Removal**: Delete `WeeklyFilter.jsx`.
2. **Dashboard Update**: 
   - Remove `filterValue` state and dropdown.
   - Implement weekly subheaders by checking `dateUtils.getISOWeek(item.published_at)` during rendering.
3. **Card Update**:
   - Add Chip/Badge for "발송완료" (status === 'sent') and "작성 중" (status === 'draft').
   - Remove any code rendering AI Selected indicators.

## Selection Logic
- When a user selects an item with `status === 'sent'`, trigger a `window.confirm` or MUI Dialog warning: "This item was previously sent. Include it anyway?"
