# Research: Simplify Trend List and Mark Sent Items

## 1. Efficient Status Querying (SQLite)
- **Decision**: Use a `LEFT JOIN` or a correlated subquery in `trendItemModel.getAll` to fetch the status of the most relevant newsletter for each item.
- **Rationale**: We need to know if an item is in *any* 'sent' newsletter (priority) or *any* 'draft' newsletter. A `LEFT JOIN` on `newsletter_items` and `newsletters` allows us to check these statuses in a single query.
- **Alternatives considered**: Fetching trends first and then doing separate queries for status. Rejected as it would lead to N+1 query problems and significantly hurt the 800ms performance goal.

## 2. Weekly Subheaders Organization
- **Decision**: Group the trends in the frontend after fetching.
- **Rationale**: The backend will return a flat list sorted by `published_at` DESC. The frontend can easily iterate and insert subheaders whenever the ISO week changes.
- **Alternatives considered**: Having the backend return a grouped JSON object. Rejected to keep the API generic and simpler.

## 3. Performance for 28-day Load
- **Decision**: Ensure indexing on `published_at` in the `trend_items` table.
- **Rationale**: Loading 28 days of data (potentially 200-500 items) is well within the capabilities of SQLite and React if indexed correctly. The 800ms target is achievable with a single efficient SQL query.
- **Alternatives considered**: Virtualized list (e.g., `react-window`). Only to be implemented if the list exceeds 1000 items, which is unlikely for a 4-week window in this application.

## 4. Visual Cleanup (AI Selected)
- **Decision**: Completely remove the `ai_selected` logic from the frontend `TrendCard` and `Dashboard` filters.
- **Rationale**: Per user request to "simplify" and "clean up visual noise." Hiding it entirely from the UI is the most direct way to achieve this.

## 5. Re-selection Warning UI
- **Decision**: Use a custom MUI `Dialog` component in `Dashboard.jsx`.
- **Rationale**: Maintains visual consistency with the existing Material Design UI and provides a better user experience than a browser-native `window.confirm`.
