# Quickstart: Newsletter Draft and Secure Sending

## Overview
This feature adds a dedicated screen for organizing newsletter content and a secure confirmation workflow for final delivery.

## Backend Implementation
1. **DB Migration**: Add `display_order` to `newsletter_items` and `confirmation_uuid`, `status` to `newsletters`.
2. **Reorder Logic**: Implement `PUT /api/newsletters/{id}/reorder` to update `display_order`.
3. **Secure Links**: Implement `uuid` generation in the `send-test` service.
4. **Idempotency**: Use transactions to ensure status is checked and updated atomically during confirmation.

## Frontend Implementation
1. **New Page**: Create `NewsletterDraft.jsx`.
2. **Drag & Drop**: Use `@dnd-kit/core` to implement the sortable list.
3. **Navigation**: Update the "Create Draft" button on the Dashboard to navigate to this new page after successful creation.

## Testing Scenarios
- **Reordering**: Drag item A to position 2, refresh, and verify order persists.
- **Security**: Attempt to call `/api/newsletters/confirm/{fake-uuid}` and expect a 404.
- **Idempotency**: Click the confirmation link in the test email twice and verify only one set of emails is sent.
