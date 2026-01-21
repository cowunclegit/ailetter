# Data Model: Newsletter Approval and Sending Workflow

## Entities

### Newsletter (Updated)
Existing entity updated with approval tracking fields.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER (PK) | Unique identifier. |
| issue_date | DATE | Date of issue. |
| status | TEXT | `draft`, `sending`, `sent`. |
| confirmation_uuid | TEXT (Unique) | UUID used for admin approval. |
| created_at | DATETIME | Timestamp of creation. |
| sent_at | DATETIME | Timestamp of final distribution. |

### Subscriber (Existing)
Used for the final mailing list distribution.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER (PK) | Unique identifier. |
| email | TEXT | Recipient email. |
| status | TEXT | `active`, `unsubscribed`. |

## State Transitions

1. **Draft**: Initial state. Content can be edited.
2. **Sending**: Triggered when the Admin clicks the "Confirm" link in the test email.
3. **Sent**: Final state after the distribution loop completes successfully.

## Logic Rules

- A `confirmation_uuid` is generated only when "Send Test Mail" is triggered.
- A `confirmation_uuid` expires 24 hours after generation.
- Once a newsletter is `sent`, the `confirmation_uuid` is invalidated.
