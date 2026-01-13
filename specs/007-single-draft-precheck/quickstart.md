# Quickstart: Single Draft Constraint and Dashboard Pre-check

## Overview
This feature ensures a single-draft workflow and bridges the gap between the Dashboard and the Draft organization screen.

## Implementation Steps

### 1. Backend Overwrite Logic
Update `NewsletterModel.createDraft`:
- Wrap in a transaction.
- `DELETE FROM newsletter_items WHERE newsletter_id IN (SELECT id FROM newsletters WHERE status = 'draft')`.
- `DELETE FROM newsletters WHERE status = 'draft'`.
- Proceed with normal creation.

### 2. Detection Endpoint
Implement `GET /api/newsletters/active-draft`:
- Query for the record with `status = 'draft'`.
- Return the ID and its items.

### 3. Sync Endpoint
Implement `POST /api/newsletters/active-draft/toggle-item`:
- Check if item exists in `newsletter_items` for the current draft.
- If exists: DELETE.
- If not: INSERT.

### 4. Frontend Integration
Update `Dashboard.jsx`:
- On `useEffect` (mount), call the detection endpoint.
- Hydrate `selectedTrends` state with the returned item IDs.
- In `handleToggleTrend`, if an active draft ID exists, call the sync endpoint immediately.
- Update "Create Draft" button label to "Refresh/Overwrite Draft" (logic-wise).
