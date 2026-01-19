# Quickstart: Content Tagging and Source Deduplication

## Setup
1. Run migrations to create `source_categories` and `trend_item_tags` junction tables.
2. Ensure you have categories created via the `/api/categories` endpoint (existing).

## Usage
### 1. Assign Categories to Source
- Register a source with multiple category IDs.
- If multiple sources have the same URL, the system will only fetch the URL once.

### 2. Collection
- Trigger a collection job.
- Each `trend_item` created will be tagged with all categories associated with its source URL.

### 3. Dashboard Filtering
- Open the dashboard.
- Use the category filter to select one or more categories.
- The trend list will update to show items matching any of the selected categories.