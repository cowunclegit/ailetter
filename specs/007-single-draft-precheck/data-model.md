# Data Model: Single Draft Constraint and Dashboard Pre-check

## Virtual Entities (Logic Only)

### ActiveDraftState
- `id`: Integer (The current draft's ID)
- `itemIds`: Array of Integers (Items currently in the draft)

## Business Rules

### Single Draft Logic
- Only one record in the `newsletters` table can have `status = 'draft'` at any given time.
- Any operation to create a new draft MUST first remove the existing draft record and its associated `newsletter_items`.

### Synchronization
- Toggling a checkbox on the dashboard for an item that is NOT in the active draft → `INSERT` into `newsletter_items`.
- Toggling a checkbox on the dashboard for an item that IS in the active draft → `DELETE` from `newsletter_items`.
- If no active draft exists, toggling should still work but might need to create an empty draft container first (or we rely on the `Create Draft` button to initialize). 
- *Clarification Re-check*: Since the user said "sync immediately if a draft exists", if NO draft exists, the local selection remains local until "Create Draft" is clicked.
