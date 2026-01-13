# Research: Content Links and Visual Thumbnails

## 1. RSS Thumbnail Extraction (OpenGraph Scraping)
- **Decision**: Use `metascraper` with `metascraper-image` and `axios`.
- **Rationale**: `metascraper` is highly optimized for extracting metadata from HTML. It handles the priority logic (OG tags, Twitter tags, etc.) automatically, which aligns with FR-007. Using `axios` to fetch the HTML during the collection job ensures we have the data before display.
- **Alternatives considered**: Manual regex (too brittle), `cheerio` (flexible but requires manual logic for all tag types).

## 2. YouTube Thumbnail Retrieval
- **Decision**: Use `snippet.thumbnails.high.url` from the YouTube Data API search response.
- **Rationale**: The existing `fetchYoutube` logic already calls the search API. Extending it to capture the high-resolution thumbnail is a low-effort, high-impact change that satisfies FR-005.
- **Alternatives considered**: Default or medium resolution. High provides the best visual quality for the newsletter.

## 3. Database Schema Update
- **Decision**: Add `thumbnail_url TEXT` to the `trend_items` table.
- **Rationale**: Storing the URL directly avoids repeating the scraping process on every page load, meeting SC-005 performance targets.
- **Alternatives considered**: BLOB storage (rejected to keep the DB lightweight and use CDN/External hosting).

## 4. UI Rendering (MUI CardMedia)
- **Decision**: Update `TrendCard.jsx` to use MUI `CardMedia` for thumbnails.
- **Rationale**: Provides consistent aspect ratios and built-in error handling for broken images.
- **Alternatives considered**: Standard `<img>` tag.
