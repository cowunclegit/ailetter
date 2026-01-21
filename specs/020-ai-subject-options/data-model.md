# Data Model: AI Subject Recommendation Options

## Entities

### AI Subject Preset
Defines a reusable prompt template for subject generation.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary Key |
| name | TEXT | Unique name (e.g., "SW Developers") |
| prompt_template | TEXT | String containing `${contentList}` |
| is_default | BOOLEAN | 1 if system-provided, 0 if user-created |
| created_at | DATETIME | Timestamp |

## Validation Rules
- `name` MUST be unique and not empty.
- `prompt_template` SHOULD contain `${contentList}` for effective generation, but it's not strictly required by the database.
- `is_default` presets cannot be deleted by the user via the standard UI (optional protection).
