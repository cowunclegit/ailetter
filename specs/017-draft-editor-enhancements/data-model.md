# Data Model: Draft Editor Enhancements

## Entities

### Newsletter (Updated)
Represents a curated newsletter issue in draft or sent state.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary Key |
| issue_date | DATE | The date of the issue |
| status | TEXT | 'draft', 'sending', 'sent' |
| subject | TEXT | The email subject line |
| introduction_html | TEXT | HTML content for the newsletter introduction |
| conclusion_html | TEXT | HTML content for the newsletter conclusion |
| confirmation_uuid | TEXT | UUID for email confirmation link |
| created_at | DATETIME | Record creation timestamp |
| sent_at | DATETIME | Timestamp when the newsletter was sent |

### NewsletterItem (Existing)
Link table between Newsletters and TrendItems with ordering.

| Field | Type | Description |
|-------|------|-------------|
| newsletter_id | INTEGER | Foreign Key to Newsletters |
| trend_item_id | INTEGER | Foreign Key to TrendItems |
| display_order | INTEGER | Position in the reorderable list |

## Relationships
- **Newsletter (1) <-> NewsletterItem (N)**: A newsletter contains multiple items.
- **NewsletterItem (N) <-> TrendItem (1)**: Each item in a newsletter refers to a specific trend article.

## Validation Rules
- `subject` should not exceed 255 characters (industry standard for email subjects).
- `introduction_html` and `conclusion_html` can be empty but should be sanitized before rendering.
- Deleting a `NewsletterItem` should not delete the underlying `TrendItem`.
