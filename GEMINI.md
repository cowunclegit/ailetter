# AILetter Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-13

## Active Technologies
- Node.js (Backend), React.js (Frontend) + `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled` (002-polish-ui-material)
- SQLite (Existing) (002-polish-ui-material)
- Node.js (Backend), React.js (Frontend) + Express, Axios, MUI, rss-parser, googleapis (004-dashboard-week-curation)
- SQLite3 (004-dashboard-week-curation)
- Node.js (Backend), React.js (Frontend) + `@dnd-kit/core` (Drag & Drop), `uuid` (Security), Express, Axios, MUI, SendGrid (006-newsletter-draft-send)
- Node.js (Backend), React.js (Frontend) + `metascraper`, `metascraper-image` (Scraping), `axios`, `googleapis` (Existing), `MUI` (Frontend) (008-content-links-thumbnails)
- SQLite3 (Updated `trend_items` schema) (008-content-links-thumbnails)
- Node.js (Backend), React.js (Frontend) + `@mui/material` (Frontend UI), `axios` (API Client), `express` (Backend API) (009-dashboard-reset-list)
- SQLite3 (Existing) (009-dashboard-reset-list)
- Node.js (Backend), React.js (Frontend) + Express, SQLite3 (Backend); MUI, Axios (Frontend) (012-source-categories)
- Node.js (Backend), React.js (Frontend) + Express, SQLite3 (Backend); MUI, Axios, Intersection Observer API (Frontend) (014-daily-curation)
- Node.js (Backend), React.js (Frontend) + Express, SQLite3, axios, rss-parser, googleapis (Existing) (015-content-tagging-sources)
- Node.js (Backend), React.js (Frontend) + Express, SQLite3 (Existing), rss-parser, googleapis, axios, MUI (Existing) (015-content-tagging-sources)
- Node.js (Backend), React.js (Frontend) + Express, SQLite3, axios, uuid, EJS (for email templates) (016-newsletter-confirm-send)
- Node.js (v18+), React (v19+) + `@dnd-kit/core`, `@mui/material`, `react-quill`, `axios`, `express`, `sqlite3` (017-draft-editor-enhancements)
- SQLite3 (newsletters table updated with subject, introduction_html, conclusion_html) (017-draft-editor-enhancements)
- Node.js v18+, React v19 + Express, EJS (templating), @mui/material (UI components), Axios, uuid (018-multi-email-templates)
- SQLite3 (Updating `newsletters` table) (018-multi-email-templates)
- Node.js, Reac + Express, Axios, @mui/material, React Router (019-newsletter-history-details)
- Node.js v18+, React v19 + Express, Axios, @mui/material, SQLite3 (020-ai-subject-options)
- SQLite3 (New table: `ai_subject_presets`) (020-ai-subject-options)
- Node.js v18+ + `ws` (WebSocket), `express` (Main Backend API), `fs-extra` (Image storage) (021-collect-proxy-service)
- SQLite3 (Main Backend DB), Local File System (Thumbnails) (021-collect-proxy-service)
- Node.js v18+, React.js (Frontend) + `express`, `sqlite3`, `axios`, `uuid` (024-infra-setup-http-polling)
- Node.js (v18+) + `sqlite3`, `express` (025-dashboard-chronological-sort)
- SQLite3 (`trend_items` table) (025-dashboard-chronological-sort)
- Node.js v18+ + `axios`, `https-proxy-agent` (or similar), `express`, `ws` (026-add-proxy-support)
- N/A (Configuration-based) (026-add-proxy-support)

- Node.js (Backend), React.js (Frontend) + `rss-parser` (RSS), `googleapis` (YouTube), `@sendgrid/mail` (Email), `node-cron` (Scheduling) (001-ai-trend-newsletter)

## Project Structure

```text
src/
tests/
```

## Commands

# Add commands for Node.js (Backend), React.js (Frontend)

## Code Style

Node.js (Backend), React.js (Frontend): Follow standard conventions

## Recent Changes
- 026-add-proxy-support: Added Node.js v18+ + `axios`, `https-proxy-agent` (or similar), `express`, `ws`
- 025-dashboard-chronological-sort: Added Node.js (v18+) + `sqlite3`, `express`
- 024-infra-setup-http-polling: Added Node.js v18+, React.js (Frontend) + `express`, `sqlite3`, `axios`, `uuid`



<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
