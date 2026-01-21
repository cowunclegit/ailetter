# Data Model: Subscriber Management

## New Tables

### `subscribers`

Stores newsletter subscribers.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Internal ID |
| `uuid` | TEXT | NOT NULL UNIQUE | Public-safe unique identifier |
| `email` | TEXT | NOT NULL UNIQUE | Subscriber email |
| `name` | TEXT | NULLABLE | Subscriber name |
| `is_subscribed` | BOOLEAN | DEFAULT 1 | Subscription status (1=Active, 0=Unsubscribed) |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

### `subscriber_categories`

Join table for Many-to-Many relationship between Subscribers and AI Subject Presets.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `subscriber_id` | INTEGER | NOT NULL, FOREIGN KEY -> subscribers(id) | Reference to subscriber |
| `preset_id` | INTEGER | NOT NULL, FOREIGN KEY -> ai_subject_presets(id) | Reference to preset |
| PRIMARY KEY | (subscriber_id, preset_id) | | |

## Existing Tables Referenced

- `ai_subject_presets` (`id`, `name`)

## Relationships

- **Subscriber** (1) <-> (N) **SubscriberCategory** (N) <-> (1) **AI Subject Preset**
