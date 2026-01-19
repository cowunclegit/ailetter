# Data Model: Multiple Email Templates

## Entities

### Newsletter Template
A static registry or database entity defining available email layouts.

| Field | Type | Description |
|-------|------|-------------|
| id | STRING | Unique slug (e.g., 'classic-list', 'modern-grid') |
| name | STRING | Human-readable name |
| thumbnail_url | STRING | Visual preview path |
| layout_file | STRING | Path to the EJS template file |

### Newsletter (Updated)
Represents a curated newsletter issue.

| Field | Type | Description |
|-------|------|-------------|
| template_id | STRING | Foreign Key/Slug to Newsletter Template (Default: 'classic-list') |

## Validation Rules
- `template_id` must match an existing template ID in the registry.
- If an invalid `template_id` is provided, fall back to 'classic-list'.
