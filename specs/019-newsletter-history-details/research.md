# Research: Newsletter History Details and Actions

## Data Fetching
- **Decision**: Use existing `GET /api/newsletters/:id` endpoint.
- **Rationale**: The endpoint already returns all necessary fields (subject, intro, outro, items, status) needed for the detail view.
- **Verification**: `NewsletterModel.getById` confirmed to return full entity with joined items.

## Frontend Navigation
- **Decision**: Implement a new route `/newsletters/:id` in `App.jsx`.
- **Rationale**: Standard RESTful pattern for detail views. Enables deep linking and browser history management.
- **Component**: Create `NewsletterDetails.jsx` in `frontend/src/pages/`.

## Action Handling (Drafts)
- **Decision**: Conditionally render a "Go to Draft Editor" button if `status === 'draft'`.
- **Rationale**: Direct path to standard editor (`/newsletters/:id/draft`) satisfies `FR-004`.
- **Logic**: Simple status check in the detail view component.

## UI Components
- **Decision**: Use `@mui/material` components consistent with existing dashboard and history views.
- **Layout**: 
    - Header with Subject and Status Chip.
    - Meta info section (Created At, Sent At).
    - HTML Content sections (Intro/Outro) using a safe rendering mechanism.
    - Article list using a variation of the existing `DraggableItem` (non-draggable read-only mode).
