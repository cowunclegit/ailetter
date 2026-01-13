# Research: Newsletter Draft and Secure Sending

## 1. Drag and Drop Implementation
- **Decision**: Use `@dnd-kit/core` and `@dnd-kit/sortable`.
- **Rationale**: `dnd-kit` is lightweight, modular, and optimized for React 18+. It provides excellent accessibility support and a better developer experience compared to the now-deprecated `react-beautiful-dnd`.
- **Alternatives considered**: `react-beautiful-dnd` (maintained forks available but less modern), `react-dnd` (too low-level for simple sortable lists).

## 2. Secure Confirmation Links
- **Decision**: Use `uuid` v4 for generating unique confirmation tokens stored in the `newsletters` table.
- **Rationale**: UUID v4 provides 122 bits of entropy, making it practically impossible to guess. Storing it in the DB allows for easy validation and expiration logic.
- **Alternatives considered**: JWT tokens (rejected to avoid complexity of stateless invalidation for this use case).

## 3. Idempotent Distribution API
- **Decision**: Implement a database-level status check (`status === 'draft'`) within a transaction when triggering the full distribution.
- **Rationale**: Prevents race conditions where clicking the link twice might trigger multiple email campaigns.
- **Alternatives considered**: Frontend-only blocking (rejected as insecure).

## 4. Test Email Configuration
- **Decision**: Recipient address will be defined via an environment variable `ADMIN_EMAIL`.
- **Rationale**: Ensures the curator doesn't have to manually type the address each time, reducing errors, and keeps the address configurable without code changes.
