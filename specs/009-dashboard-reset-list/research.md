# Research: Dashboard Content List Reset

## 1. Backend Implementation Strategy
- **Decision**: Implement `POST /api/newsletters/active-draft/clear`.
- **Rationale**: Keeps the API RESTful. The "active draft" concept is already established in `newsletters.js`. The action is specific to the *content* of the draft, not the newsletter entity itself, but clearing relations is a modification of the newsletter's state.
- **Alternatives considered**: `DELETE /api/newsletters/active-draft/items`. Rejected because we are not deleting *specific* items but resetting the *entire* collection state. `POST /clear` is more RPC-style but fits the "action" semantic well for a reset.

## 2. Frontend State Management
- **Decision**: Lift filter state or expose a reset handler in `Dashboard.jsx`.
- **Rationale**: The `Dashboard` component likely owns the filter state (`startDate`, `endDate`, `search`). The reset action needs to modify these directly.
- **Implementation**: The `handleReset` function will:
    1. Call API to clear backend draft.
    2. Await success.
    3. `setSearchTerm('')`.
    4. `setDateRange(initialRange)`.
    5. `refetch()` or locally clear the selected items set.

## 3. UX - Confirmation Dialog
- **Decision**: Use `MUI <Dialog>` locally within `Dashboard.jsx` or a sub-component.
- **Rationale**: Simple, consistent with Spec FR-002. No need for a global modal manager for this single use case.
