# Feature Specification: Dashboard Collection and Draft History Improvements

**Feature Branch**: `003-dashboard-collection-drafts`  
**Created**: 2026-01-13  
**Status**: Draft  
**Input**: User description: "데이터 수집을 위해 Dashboard에 Collect Now 버튼을 제공해줘, 주별로 조회가 가능하게 해줘, Draft를 만들면 이력도 만들어줘, 새로운 Draft를 만들때 기존에 선택한 내용이 중복되었는지 체크도 필요해"

## Clarifications

### Session 2026-01-13
- Q: 중복 아이템 선택 시의 동작 방식 → A: 경고 후 허용 (Soft Warning)
- Q: Draft History(이력)에 표시될 정보 → A: 기본 메타데이터 (생성 일시, 아이템 수, 상태)
- Q: "Collect Now" 실행 시 중복 데이터 처리 → A: 중복 제외 (Skip Duplicates)
- Q: 주별 필터의 기준 요일과 표시 형식 → A: 월요일 시작 + 기간 병기 (예: 2026-W03 (01.12 ~ 01.18))
- Q: "Collect Now" 실행 시 사용자 알림 방식 → A: 비동기 토스트 알림 (Snackbar)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Manual Data Collection (Priority: P1)

As a content curator, I want to trigger data collection manually from the dashboard so that I can get the latest trends immediately. I want to see the progress via notifications and be able to continue using the dashboard while it runs in the background.

**Why this priority**: Essential for flexibility. Asynchronous notifications provide a modern UX that doesn't block the user's workflow.

**Independent Test**: Click "Collect Now", verify "Collection started" toast appears, continue using other features, then verify "Collection completed" toast appears and the list refreshes.

**Acceptance Scenarios**:

1. **Given** the dashboard page, **When** I click the "Collect Now" button, **Then** the system triggers the background process and immediately shows a "Collection started..." toast notification.
2. **Given** a collection is running, **When** it completes successfully, **Then** a "Collection completed" toast notification appears and the current trend list is automatically refreshed.
3. **Given** a collection process is in progress, **When** I view the dashboard, **Then** the "Collect Now" button should be disabled to prevent redundant triggers.

---

### User Story 2 - Weekly Trend Filtering (Priority: P1)

As a curator, I want to filter trend items by week (starting on Monday) so that I can review content based on specific time periods with clear dates.

**Why this priority**: High volume of trend items makes it difficult to manage without time-based filtering.

**Independent Test**: Select a week like "2026-W03 (01.12 ~ 01.18)" from the filter and verify only items from that Monday-Sunday range are displayed.

**Acceptance Scenarios**:

1. **Given** the trend list, **When** I select a specific week from the filter, **Then** the list updates to show only items published during that week (Monday 00:00 to Sunday 23:59).
2. **Given** the dashboard, **When** I first load the page, **Then** it defaults to showing items for the current week.

---

### User Story 3 - Newsletter History (Priority: P2)

As a curator, I want to see a history of all past newsletters so that I can track previous issues, review their status, and see how many items were included in each.

**Why this priority**: Essential for oversight and tracking the lineage of sent content.

**Independent Test**: Navigate to the "History" page and verify that a list of past newsletters is displayed with correct issue dates, statuses, and item counts.

**Acceptance Scenarios**:

1. **Given** the system has multiple drafts and sent newsletters, **When** I view the History page, **Then** I see a table or list showing each newsletter's creation date, status (Draft/Sent), and the number of items included.
2. **Given** a newsletter in the list, **When** I click on it, **Then** I am taken to the detail view of that specific newsletter.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a "Collect Now" button on the dashboard to trigger manual collection.
- **FR-002**: System MUST allow filtering the dashboard trend list by week (Year-Week format).
- **FR-003**: System MUST persist a record of every "Draft" created, including metadata and the list of associated trend items.
- **FR-004**: System MUST check if a selected trend item has been part of any previous "Sent" newsletter during the creation process.
- **FR-005**: System MUST provide a "Draft History" view displaying the creation timestamp, item count, and current status for each draft.
- **FR-006**: System MUST show a duplicate warning to the user if they select an item that was included in ANY previous draft that reached "Sent" status, but MUST NOT prevent the user from proceeding if they confirm.

### Key Entities *(include if feature involves data)*

- **NewsletterHistory**: A logical view of the `newsletters` table representing a past curation session (ID, CreatedAt, Status, ItemCount, List of TrendItems).
- **TrendItem**: Existing entity, now needs a way to track if it's "used" in a draft (likely via a relationship to DraftHistory).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Curators can trigger manual collection and see updated results in under 30 seconds.
- **SC-002**: Users can filter through a full year's worth of data by week with zero page reloads (using client-side filtering or fast API response).
- **SC-003**: 100% of created drafts are accurately recorded in the history.
- **SC-004**: System identifies and flags 100% of previously used items during the selection process.