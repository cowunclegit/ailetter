# Quickstart: Content Links and Visual Thumbnails

## Overview
This feature adds visual thumbnails and clickable links to the dashboard and newsletters.

## Backend Implementation
1. **DB Migration**: Add `thumbnail_url` column to `trend_items`.
2. **Installation**: `npm install metascraper metascraper-image axios`.
3. **RSS Scraping**: Update `CollectionService.fetchRss` to use `metascraper` on the `original_url`.
4. **YouTube API**: Update `CollectionService.fetchYoutube` to save `snippet.thumbnails.high.url`.

## Frontend Implementation
1. **Card Update**: Update `TrendCard.jsx` to show an image using MUI `CardMedia`.
2. **Hyperlinks**: Wrap the title in an `<a>` or MUI `Link` component.
3. **YouTube Indicator**: Add a YouTube icon next to the source name for video content.

## Testing Scenarios
- **RSS Thumbnail**: Collect an RSS item from TechCrunch and verify a thumbnail appears in the DB.
- **YouTube Link**: Click a YouTube title and verify it opens the video in a new tab.
- **Fallback**: Verify a generic placeholder shows if an RSS article has no OG image.
