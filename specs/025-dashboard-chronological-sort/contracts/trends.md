# API Contract: Trend Retrieval

## Get Trends
Retrieves a paginated list of trend items sorted by publication date descending.

- **Endpoint**: `GET /api/trends`
- **Query Parameters**:
  - `limit` (optional): Number of items to return (default: 100).
  - `offset` (optional): Number of items to skip (default: 0).
  - `ai_selected_only` (optional): Filter for AI-selected items.
  - `startDate` (optional): ISO8601 start date filter.
  - `endDate` (optional): ISO8601 end date filter.
  - `categoryIds` (optional): Array of category IDs to filter.

- **Success Response**:
  - **Code**: 200 OK
  - **Body**: Array of Trend Item objects.
  - **Sort Order**: Items MUST be sorted by `published_at DESC`, then `id DESC`.

- **Example**:
  ```json
  [
    {
      "id": 150,
      "title": "Latest News",
      "published_at": "2026-01-21T14:30:00Z",
      "..." : "..."
    },
    {
      "id": 149,
      "title": "Older News",
      "published_at": "2026-01-21T14:00:00Z",
      "..." : "..."
    }
  ]
  ```
