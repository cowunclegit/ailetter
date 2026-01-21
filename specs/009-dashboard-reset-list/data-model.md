# Data Model: Dashboard Content List Reset

## Affected Entities

### Newsletter (Draft)
- **Relation**: `newsletter_items` (Join table between Newsletter and TrendItem)
- **Change**: All rows in `newsletter_items` corresponding to the active draft `newsletter_id` will be deleted.
- **State**: The Newsletter status remains `draft`.

### TrendItem
- **Change**: No change to the entity itself.
- **Association**: `TrendItem`s are disassociated from the Newsletter.

## Validation Rules
- **Active Draft**: The operation must only target a newsletter with `status = 'draft'`. If no active draft exists or it is `sent`, return 404 or 400.
