# Research: Newsletter Approval and Sending Workflow

## Research Tasks

### R01: Snapshot Behavior Implementation
**Decision**: Preserve current `newsletter_items` relationship but transition `newsletters.status` to `sending` upon confirmation.
**Rationale**: The spec requires modifications after the test send to be ignored. However, in the current system, a "Draft" is modified in-place. To truly snapshot, we either need a separate "FinalizedNewsletterItems" table or we must prevent edits to a newsletter once a test mail is sent.
**Final Choice**: Prevent edits to the draft once `status` is advanced from `draft` to `pending_confirmation`. This ensures the items linked to the UUID remain unchanged.

### R02: UUID Generation and Expiration in SQLite
**Decision**: Use `uuid` npm package for generation and a `created_at` timestamp in the `newsletters` table for expiration checks.
**Rationale**: SQLite doesn't have native UUID types or TTL. Using a standard library and manual time comparison in the API layer is robust and idiomatic for Node.js projects.

### R03: Email Templating with EJS
**Decision**: Use EJS to generate the newsletter HTML.
**Rationale**: EJS is lightweight, well-integrated with Express, and allows dynamic injection of trend items into a clean HTML template.

---

## Technical Decisions Summary

| Topic | Chosen Solution | Key Rationale |
|-------|-----------------|---------------|
| Snapshotting | Status Gate | Simplest way to ensure data integrity without duplicating items. |
| UUIDs | `uuid` + manual TTL | Standard approach for Node/Express + SQLite. |
| Templating | EJS | Flexibility and ease of use for HTML emails. |
