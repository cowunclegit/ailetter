# Data Model: Simplify Trend List

## Virtual Entities (Logic Only)

### TrendItemStatus
- `AVAILABLE`: Default state.
- `IN_DRAFT`: Item is associated with at least one newsletter in `draft` status.
- `SENT`: Item is associated with at least one newsletter in `sent` status (Highest priority).

## Entity Relationships

- **TrendItem** (1) <-> (N) **NewsletterItem** (N) <-> (1) **Newsletter**
- A `TrendItem` can be in multiple `Newsletters`.
- **Status Precedence**: If an item is in both a `sent` and a `draft` newsletter, its status for the Dashboard display MUST be `SENT`.

## Database Query Optimization
- Index on `trend_items.published_at` (MANDATORY for 28-day performance).
- Joined query for `getAll` trends:
  ```sql
  SELECT t.*, 
         MAX(CASE WHEN n.status = 'sent' THEN 2 WHEN n.status = 'draft' THEN 1 ELSE 0 END) as status_level
  FROM trend_items t
  LEFT JOIN newsletter_items ni ON t.id = ni.trend_item_id
  LEFT JOIN newsletters n ON ni.newsletter_id = n.id
  WHERE t.published_at >= ?
  GROUP BY t.id
  ```
