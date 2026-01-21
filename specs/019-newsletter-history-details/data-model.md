# Data Model: Newsletter History Details

## Entities

### Newsletter (Detailed View)
Represents the full state of a newsletter issue.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary Key |
| issue_date | DATE | Publication date |
| status | TEXT | 'draft', 'sending', 'sent' |
| subject | TEXT | Email subject line |
| introduction_html | TEXT | Rich text preamble |
| conclusion_html | TEXT | Rich text closing |
| template_id | TEXT | Selected layout ID |
| confirmation_uuid | TEXT | Unique ID for approval |
| created_at | DATETIME | Record timestamp |
| sent_at | DATETIME | Actual send timestamp |
| items | ARRAY | List of NewsletterItems (see below) |

### NewsletterItem (Linked)
| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Trend Item ID |
| title | TEXT | Article Title |
| summary | TEXT | Article Summary |
| original_url | TEXT | Link to source |
| source_name | TEXT | Name of the source |
| published_at | DATE | Original publication date |
| display_order | INTEGER | Position in list |
