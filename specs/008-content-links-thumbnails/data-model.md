# Data Model: Content Links and Visual Thumbnails

## Updated Entities

### TrendItem
Represents a curated news item with visual enrichment.
- `id`: Integer (Primary Key)
- `source_id`: Integer (Foreign Key)
- `title`: String
- `original_url`: String (Clickable target)
- `published_at`: DateTime
- `summary`: Text
- `thumbnail_url`: String (URL to preview image, Nullable)
- `ai_selected`: Boolean
- `status`: String (Enum: available, draft, sent)

## Validation Rules
- **original_url**: Must be a valid HTTP/HTTPS URL.
- **thumbnail_url**: Must be a valid URL string if present.

## State Transitions
No new state transitions. The `thumbnail_url` is populated at the time of creation in `TrendItemModel.create`.
