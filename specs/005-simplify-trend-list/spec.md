# Feature Specification: Simplify Trend List and Mark Sent Items

**Feature Branch**: `005-simplify-trend-list`  
**Created**: 2026-01-13  
**Status**: Draft  
**Input**: User description: "Filter by Week를 없애고 최근 4주 내용을 그냥 표시해주는것으로 간단하게 가자, Newsletter로 선택해서 메일 발송된것은 따로 Card에 발송완료로 표시를 해주고 AI Selected 표시는 일단 없애줘"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Simplified Trend Browsing (Priority: P1)

The curator wants to see all relevant news from the last month immediately upon opening the dashboard without having to interact with complex week-based filters.

**Why this priority**: Core value is simplification of the curation workflow and reducing cognitive load.

**Independent Test**: Can be tested by navigating to the dashboard and verifying that trends from the last 28 days are displayed automatically without any manual filtering.

**Acceptance Scenarios**:

1. **Given** the curator is logged in, **When** they navigate to the Dashboard, **Then** they see a single list of trend items published within the last 4 weeks.
2. **Given** the curator is on the Dashboard, **When** they look for the "Filter by Week" dropdown, **Then** it is no longer visible.

---

### User Story 2 - Sent Item Identification (Priority: P2)

The curator needs to know which news items have already been sent to subscribers so they can avoid selecting duplicate content for new newsletters.

**Why this priority**: Prevents redundant content and improves the quality of the newsletter.

**Independent Test**: Can be tested by creating a newsletter draft with specific items, sending it, and then verifying those items appear with a "Sent" status on the dashboard.

**Acceptance Scenarios**:

1. **Given** a trend item was previously included in a sent newsletter, **When** it appears on the Dashboard, **Then** it is clearly marked as "Sent" (발송완료).
2. **Given** a trend item has never been sent or is only in a draft newsletter, **When** it appears on the Dashboard, **Then** it does not have the "Sent" label.

---

### User Story 3 - Visual Cleanup (Priority: P3)

The curator wants a cleaner interface by removing secondary information that is not currently being used, specifically the AI selection indicators.

**Why this priority**: Reduces visual noise and focuses the user on the content.

**Independent Test**: Can be tested by verifying that no "AI Selected" badges or icons are visible on any trend cards.

**Acceptance Scenarios**:

1. **Given** the Dashboard is loaded, **When** viewing any trend item (even those marked as AI-selected in the database), **Then** no AI selection status is displayed.

---

### Edge Cases

- **No content in last 4 weeks**: The system should show a friendly message indicating no recent trends were found.
- **Item sent multiple times**: The status should simply show "Sent" regardless of how many newsletters it was included in.
- **Slow loading**: If fetching 4 weeks of data is slow, a loading indicator must be shown to maintain responsiveness.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST automatically filter trend items to show only those published within the last 28 days (4 weeks) from the current date.
- **FR-002**: System MUST remove the "Filter by Week" UI component from the Dashboard.
- **FR-003**: System MUST identify trend items that are associated with newsletters having a 'sent' status.
- **FR-004**: System MUST display a "Sent" (발송완료) label or status indicator on the trend cards for items identified in FR-003.
- **FR-005**: System MUST hide all visual indicators related to "AI Selected" or "AI Recommendations" on the Dashboard and MUST remove the "AI Selected Only" filter toggle.
- **FR-006**: The Dashboard MUST load content immediately without requiring user input for the initial time range.
- **FR-007**: System MUST allow selecting "Sent" items but MUST display a confirmation warning before including them in a new newsletter draft.
- **FR-008**: System MUST visually organize the 4-week trend list using weekly subheaders (e.g., "This Week", "Last Week", etc.) to facilitate scanning.
- **FR-009**: System MUST load all trend items from the 28-day period at once to ensure a complete overview for curation, while maintaining performance targets.
- **FR-010**: System MUST display an "In Draft" (작성 중) label for trend items that are currently included in a newsletter draft (status: 'draft').

## Clarifications

- Q: Should items already marked as "Sent" (발송완료) be selectable for new newsletters? → A: Allow selection with a warning/confirmation dialog.
- Q: How should this 4-week list be visually organized to help you scan the content? → A: Continuous list with weekly subheaders (e.g., "This Week", "Last Week", etc.).
- Q: Should the dashboard use infinite scrolling/pagination to handle high volumes, or always load the full 28 days? → A: Load the full 28 days at once (prioritize completeness).
- Q: If an item is in a draft (not yet sent) newsletter, should it have any special indicator to avoid double-adding it to another draft? → A: Use a different indicator for drafts (e.g., "In Draft" / "작성 중").
- Q: Should we also remove the ability to filter by "AI Selected only", or just hide the visual badges on individual cards? → A: Remove the "AI Selected Only" filter toggle entirely.

### Session 2026-01-13

### Assumptions

- **Time Range**: "Last 4 weeks" is interpreted as the last 28 calendar days from the moment of access.
- **Label Text**: The "Sent" indicator will use the text "발송완료" as requested by the user.
- **AI Selection**: Removing the AI Selected display is a temporary UI change; the underlying data and selection logic remain intact for future use.

### Key Entities *(include if feature involves data)*

- **TrendItem**: Represents a collected news piece. Key attributes: title, published date, source, and its relationship to newsletters.
- **Newsletter**: Represents a collection of trend items. Key attribute: status (draft vs. sent).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The number of clicks required to see the last 4 weeks of content is reduced to zero (automatic loading).
- **SC-002**: 100% of trend items that have been sent in a newsletter are correctly identified with the "Sent" label.
- **SC-003**: Dashboard initial load time (including 4-week filtering) remains under 800ms.
- **SC-004**: Visual noise is reduced by removing at least two UI elements (Week Filter, AI Badge).