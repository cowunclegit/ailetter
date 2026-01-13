# Data Model: Newsletter Draft and Secure Sending

## Entity Updates

### Newsletter
Represents the newsletter container.
- `id`: Integer (Primary Key)
- `issue_date`: Date
- `status`: String (Enum: `draft`, `sending`, `sent`)
- `confirmation_uuid`: UUID (Nullable, generated when test mail is sent)
- `created_at`: DateTime
- `sent_at`: DateTime (Nullable)

### NewsletterItem
Join table between Newsletters and TrendItems.
- `newsletter_id`: Integer (Foreign Key)
- `trend_item_id`: Integer (Foreign Key)
- `display_order`: Integer (Starting from 0, used for sorting)

## State Transitions

1. **Creation**: Status set to `draft`.
2. **Test Mail Sent**: `confirmation_uuid` is generated and saved. Status remains `draft`.
3. **Confirmation Link Clicked**: 
   - Check if `status === 'draft'`.
   - Update `status` to `sending`.
   - Process email queue.
   - Update `status` to `sent` and set `sent_at`.
