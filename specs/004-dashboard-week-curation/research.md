# Research: Dashboard Week-Based Curation and Collection

## 1. ISO Week Calculation and Formatting
- **Decision**: Use `date-fns` (if available) or a robust utility in `frontend/src/utils/dateUtils.js` to calculate Monday-start weeks.
- **Rationale**: Standardizing on ISO-8601 (Monday start) ensures consistency between the UI labels and the backend filters.
- **Alternatives considered**: Manual `Date` arithmetic. Rejected because `date-fns` handles edge cases (leap years, year boundaries) more reliably. *Note: Need to verify if `date-fns` is already in `frontend/package.json`.*

## 2. Per-Week Collection Locking
- **Decision**: Change the `isCollecting` boolean in `backend/src/services/collectionService.js` to a `Map` or an object `activeCollections` where keys are week identifiers (e.g., "2026-W02").
- **Rationale**: Requirement FR-007 explicitly mandates allowing concurrent collection for different weeks. A global boolean lock would violate this.
- **Alternatives considered**: Redis-based locking. Rejected as SQLite/in-memory is sufficient for the current scale and follows the "justify complexity" rule.

## 3. Date-Filtered Collection (Selective Fetching)
- **Decision**: Update `collectionService.fetchRss` and `fetchYoutube` to accept optional `startDate` and `endDate` parameters.
- **Rationale**: To support FR-004 and FR-005, the service must be able to filter items at the source or immediately after fetching, rather than relying on a fixed "last 7 days" window.
- **Alternatives considered**: Fetching everything and filtering in the model. Rejected because it's inefficient and makes "Collect Now" for past weeks unreliable if sources only return limited recent items.

## 4. UI Week Selector Range
- **Decision**: The UI will generate 12 options starting from the current week. Each option will follow the "Week N (MM.DD ~ MM.DD)" format.
- **Rationale**: Addresses the clarification regarding the 12-week limit and specific display format.
