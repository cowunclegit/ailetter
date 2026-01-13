# Data Model: AI Trend Weekly Newsletter

**Feature**: AI Trend Weekly Newsletter
**Date**: 2026-01-13
**Database**: SQLite3

## Entities

### Source
Represents a configured input channel for trend data (e.g., a blog RSS feed or YouTube channel).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | Integer | Yes | Primary Key (Auto-increment) |
| name | String | Yes | Display name of the source (e.g., "TechCrunch AI") |
| type | String | Yes | Enum: 'rss', 'youtube' |
| url | String | Yes | The RSS feed URL or YouTube Channel ID |
| reliability_score | Float | No | 0.0-1.0 score (optional for future weighting) |
| created_at | DateTime | Yes | Timestamp of creation |

### TrendItem
Represents a single piece of content collected from a Source.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | Integer | Yes | Primary Key |
| source_id | Integer | Yes | Foreign Key -> Source.id |
| title | String | Yes | Title of the article/video |
| original_url | String | Yes | Link to the original content (Unique constraint likely needed) |
| published_at | DateTime | Yes | When the item was published at the source |
| summary | Text | No | Short summary (extracted or generated) |
| ai_selected | Boolean | Yes | Default: False. True if selected by LLM as a top candidate. |
| created_at | DateTime | Yes | When it was collected |

### Newsletter
Represents a weekly issue of the newsletter.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | Integer | Yes | Primary Key |
| issue_date | Date | Yes | The date this issue corresponds to |
| status | String | Yes | Enum: 'draft', 'sent' |
| created_at | DateTime | Yes | Timestamp |
| sent_at | DateTime | No | Timestamp when sent |

### NewsletterItem
Join table linking Newsletters to TrendItems (Many-to-Many).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| newsletter_id | Integer | Yes | Foreign Key -> Newsletter.id |
| trend_item_id | Integer | Yes | Foreign Key -> TrendItem.id |
| order | Integer | Yes | Display order in the email |

### Subscriber
Represents a recipient of the newsletter.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | Integer | Yes | Primary Key |
| email | String | Yes | Unique email address |
| status | String | Yes | Enum: 'active', 'unsubscribed' |
| subscribed_at | DateTime | Yes | Timestamp of signup |
| unsubscribed_at | DateTime | No | Timestamp of unsubscription |
| token | String | Yes | Unique token for unsubscription links |

## Relationships

- `Source` 1:N `TrendItem`
- `Newsletter` N:M `TrendItem` (via `NewsletterItem`)
- `Subscriber` receives many `Newsletter` (Logically, via email send logs not necessarily modeled here for MVP)
