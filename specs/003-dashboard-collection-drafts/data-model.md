# Data Model: Dashboard Collection and Draft History

## Entities

### Newsletter (Existing)
Represents a curation session (Draft or Sent).
- `id`: Integer (PK)
- `issue_date`: Date
- `status`: String ('draft', 'sent')
- `created_at`: DateTime
- `sent_at`: DateTime

### TrendItem (Existing)
- `id`: Integer (PK)
- `original_url`: String (Unique)
- ... (other existing fields)

### NewsletterItem (Existing Relationship)
- `newsletter_id`: FK -> Newsletters
- `trend_item_id`: FK -> TrendItems
- `display_order`: Integer

## Relationships
- One **Newsletter** has many **TrendItems** through **NewsletterItem**.
- To check for duplicates: Query `newsletter_items` joined with `newsletters` where `newsletters.status = 'sent'`.

## Changes Required
- No schema changes needed for basic history, as `newsletters` already acts as history.
- Ensure `trend_items.original_url` has a UNIQUE constraint (already in schema.sql).
