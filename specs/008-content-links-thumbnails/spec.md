# Feature Specification: Content Links and Visual Thumbnails

**Feature Branch**: `008-content-links-thumbnails`  
**Created**: 2026-01-13  
**Status**: Draft  
**Input**: User description: "모든 컨텐츠 제목에 실제 컨텐츠 링크를 제공하고 Youtube의 경우에 유튜브 표시를 해주고 가능하면 Thumnail을 표시해줘, RSS 컨텐츠의 경우에도 가능하면 Thumnail을 가져오면 좋을거 같아(실제 링크를 접속해서 가져와도 좋아)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Direct Content Access (Priority: P1)

As a curator or reader, I want to click on a news title to immediately view the original article or video so that I can verify the details or consume the full content.

**Why this priority**: Essential for the core utility of a news curation tool.

**Independent Test**: Can be fully tested by clicking any title on the dashboard or in a sent newsletter and verifying it opens the correct source URL in a new tab.

**Acceptance Scenarios**:

1. **Given** a trend item is displayed on the Dashboard, **When** I click the title, **Then** it opens the `original_url` in a new browser tab.
2. **Given** a reader receives a newsletter email, **When** they click a title, **Then** they are directed to the original content.

---

### User Story 2 - Source Type Identification (Priority: P2)

As a curator, I want to quickly distinguish between video (YouTube) and text (RSS) content so that I can balance the media types in my newsletter.

**Why this priority**: Improves curation efficiency and layout planning.

**Independent Test**: Can be tested by looking at the trend list and verifying that all YouTube items have a visible "YouTube" badge or icon.

**Acceptance Scenarios**:

1. **Given** a YouTube trend item is displayed, **When** viewed on the Dashboard, **Then** it shows a YouTube-specific icon or label.
2. **Given** an RSS trend item is displayed, **When** viewed on the Dashboard, **Then** it does not show the YouTube indicator.

---

### User Story 3 - Visual Enrichment with Thumbnails (Priority: P2)

As a curator, I want to see a preview image (thumbnail) for each news item so that the dashboard and newsletter are more visually engaging and easier to scan.

**Why this priority**: Significantly enhances the user experience and visual appeal of the final product.

**Independent Test**: Can be tested by verifying that YouTube items show their video thumbnails and RSS items show images extracted from their original links.

**Acceptance Scenarios**:

1. **Given** a YouTube item is collected, **When** it is displayed, **Then** the system shows the high-quality thumbnail from the YouTube API.
2. **Given** an RSS item is collected, **When** it is displayed, **Then** the system shows an image extracted from the article's metadata (e.g., OpenGraph tags).

---

### Edge Cases

- **No image found**: If no thumbnail is available for an RSS item, the system should show a generic placeholder image or a clean text-only layout.
- **Invalid URLs**: The system should handle cases where the thumbnail URL is broken without crashing the UI.
- **YouTube API Quotas**: The system should gracefully handle failures if YouTube thumbnail retrieval fails due to API limits.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: All trend item titles in the Dashboard MUST be rendered as hyperlinks to their `original_url`.
- **FR-002**: Trend item titles in the Newsletter (EJS template) MUST be rendered as hyperlinks.
- **FR-003**: System MUST display a YouTube icon or label specifically for items collected via the YouTube API.
- **FR-004**: System MUST store a `thumbnail_url` for each trend item in the database.
- **FR-005**: For YouTube content, the system MUST use the thumbnail URL provided by the YouTube Data API.
- **FR-006**: For RSS content, the system MUST attempt to extract a thumbnail URL during the background collection process by visiting the original link.
- **FR-007**: The extraction logic for RSS SHOULD prioritize `og:image` or `twitter:image` metadata tags.

### Key Entities

- **TrendItem (Updated)**: Added `thumbnail_url` (string) attribute.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of trend items have clickable titles leading to the correct source.
- **SC-002**: 100% of YouTube items are visually identified with a specific indicator.
- **SC-003**: 100% of YouTube items display a valid thumbnail image.
- **SC-004**: >80% of RSS items from major tech blogs (e.g., TechCrunch, OpenAI) display a thumbnail image.
- **SC-005**: Dashboard load time increases by no more than 200ms despite loading multiple thumbnail images.