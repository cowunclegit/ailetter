# Feature Specification: Dashboard Week-Based Curation and Collection

**Feature Branch**: `004-dashboard-week-curation`  
**Created**: 2026-01-13  
**Status**: Draft  
**Input**: User description: "Dashboard에서 Filter by Week 대신 현재 Week를 선택하는 UI가 제공되고 UI의 Week를 변경하면 Dashboar내의 추천 Source list가 해당 Week의 내용으로(Date 기반) 변경된다. Collect Now도 현재 Week를 기준으로 날짜별로 Collect 하도록 해줘"

## Clarifications

### Session 2026-01-13
- Q: How many past weeks should be available for selection in the UI? → A: Last 12 weeks
- Q: What is the exact date/time range for a week? → A: Monday 00:00:00 to Sunday 23:59:59 (Inclusive)
- Q: How should the UI behave when the week selection changes? → A: Clear current list and show loading
- Q: What is the display format for the week selection? → A: "Week 2 (01.05 ~ 01.11)"
- Q: How should concurrent collection jobs for different weeks be handled? → A: Concurrent (Different weeks allowed)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Week-Based Trend Exploration (Priority: P1)

As a curator, I want to select a specific week from the dashboard so that I can focus on trends and sources relevant to that specific time period.

**Why this priority**: Core functionality that replaces the generic filter with a focused, time-bound curation workflow.

**Independent Test**: Can be tested by selecting different weeks in the UI and verifying that the displayed trend list and sources update to reflect only items from the selected Monday-to-Sunday range.

**Acceptance Scenarios**:

1. **Given** the dashboard is loaded, **When** the user selects the "Current Week" (or any specific week) from the selector, **Then** the trend list displays only items published within that week's date range.
2. **Given** a specific week is selected, **When** the user changes the selection to a previous week, **Then** the current trend list is cleared, a loading indicator is shown, and the list refreshes once data is retrieved.

---

### User Story 2 - Targeted Week Collection (Priority: P2)

As a curator, I want to trigger data collection for the currently selected week so that I can ensure I have the most complete data for my curation task, even for past periods.

**Why this priority**: Enhances the "Collect Now" feature to be context-aware, preventing irrelevant data from being collected when focused on a specific period.

**Independent Test**: Select a past week, click "Collect Now", and verify that the system attempts to fetch data corresponding to the selected week's date range.

**Acceptance Scenarios**:

1. **Given** a specific week is selected in the UI, **When** the user clicks "Collect Now", **Then** the backend collection process uses the start and end dates of that selected week as filters for fetching new data.
2. **Given** the collection process is triggered for a past week, **When** new items are found for that period, **Then** they appear in the dashboard under the selected week view.

### Edge Cases

- **Future Weeks**: Future weeks MUST be disabled in the UI selector to prevent invalid selections.
- **Empty Weeks**: How does the system handle a week where no data is available even after "Collect Now"?
- **Cross-Week Items**: How are items handled that were published on the boundary (e.g., Sunday night vs Monday morning)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a UI component to select a specific week (Monday to Sunday) from the current week back to the last 12 weeks, labeled using the format "Week N (MM.DD ~ MM.DD)".
- **FR-002**: The default selection MUST be the current calendar week.
- **FR-003**: Changing the selected week MUST update the trend list to show only items within that week's range.
- **FR-004**: The "Collect Now" action MUST use the date range of the currently selected week as its temporal boundary.
- **FR-005**: When "Collect Now" is triggered for a past week, the system MUST scan all currently active sources for that specific date range.
- **FR-006**: The selected week state MUST NOT persist across sessions; the dashboard MUST always reset to the "Current Week" upon initial load or navigation return.
- **FR-007**: The system MUST allow concurrent "Collect Now" triggers for different weeks, ensuring that an in-memory lock only applies to the specific week being collected.

### Key Entities

- **WeekRange**: Represents a period from Monday 00:00:00 to Sunday 23:59:59.
- **TrendItem**: Existing entity, filtered based on its `published_at` attribute matching the selected `WeekRange`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can switch between any two weeks and see updated results in under 500ms.
- **SC-002**: 100% of items displayed in a week view must have a publication date within that week's range.
- **SC-003**: Triggering "Collect Now" for a specific week must only result in data collection attempts relevant to that week's timeframe.
- **SC-004**: Curators report that the week-based view makes it easier to manage weekly newsletter issues compared to the previous filtering system.