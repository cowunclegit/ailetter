# Research & Technology Decisions

**Feature**: AI Trend Weekly Newsletter
**Date**: 2026-01-13

## Decisions

### 1. RSS Parser
- **Decision**: `rss-parser`
- **Rationale**: It is the most popular, actively maintained, and robust library for parsing RSS, Atom, and JSON feeds in Node.js. It supports promises and handles various feed eccentricities out of the box.
- **Alternatives Considered**: `feedparser` (older, stream-based, more complex API), building a custom XML parser (reinventing the wheel).

### 2. YouTube Integration
- **Decision**: `googleapis` (Official Node.js Client)
- **Rationale**: Provides fully typed (TypeScript-friendly) and maintained access to YouTube Data API v3. Essential for reliable searching and retrieving video metadata.
- **Alternatives Considered**: `ytdl-core` (meant for downloading, not metadata/search), raw HTTP requests (tedious auth handling).

### 3. LLM Service
- **Decision**: OpenAI API (`openai` npm package)
- **Rationale**: Industry standard for text summarization and ranking tasks. The `gpt-4o` or `gpt-3.5-turbo` models offer the best balance of cost and performance for analyzing trend relevance.
- **Alternatives Considered**: Anthropic Claude (comparable, but OpenAI often has better tooling/docs availability), Local LLMs (Llama 3 via Ollama - too resource-intensive for this MVP deployment).

### 4. Email Service
- **Decision**: SendGrid (`@sendgrid/mail`)
- **Rationale**: specific, reliable transactional email service with an easy-to-use Node.js SDK. Generous free tier for testing/MVP.
- **Alternatives Considered**: AWS SES (cheaper at scale but harder to set up initially), Nodemailer with SMTP (more configuration, deliverability issues).

### 5. Database
- **Decision**: SQLite3
- **Rationale**: Lightweight, serverless, and perfectly sufficient for the anticipated scale (single curator, modest subscriber list). Zero configuration overhead compared to Postgres.
- **Alternatives Considered**: PostgreSQL (overkill for MVP), MongoDB.

## Integration Patterns

- **Collection Job**: A scheduled Cron job (using `node-cron`) will fetch from RSS/YouTube, then immediately send batch to OpenAI for ranking.
- **Newsletter Formatting**: Use a template engine like `handlebars` or simple template strings to inject content into the "Clean Minimalist HTML" layout.
