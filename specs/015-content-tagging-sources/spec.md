# Feature Specification: Content Tagging and Source Deduplication

**Feature Branch**: `015-content-tagging-sources`  
**Created**: 2026-01-19  
**Status**: Draft  
**Input**: User description: "컨텐츠에 태깅을 해야해 기본적으로 sources의 카테고리로 collect 되니 태깅을 하는데 만약 sources에 2개 카테고리에 동일한 source가 중복 등록되어 있으면 collect 시 1회만 collect하게 하고 tagging을 2개 카테고리로 하는 방식으로 효과적으로 collect하고 컨텐츠의 출처 및 카테고리 관련성을 태깅을 통해 만드려고 해"

## Clarifications

### Session 2026-01-19
- Q: Manual Tagging Control → A: Auto-only: Tags are only applied during collection based on the source's categories.
- Q: Category Deletion Behavior → A: Cascading Soft-Delete: Category deletion hides tags in the UI but preserves historical records in the database.
- Q: Duplicate URL Metadata Ownership → A: URL-Primary: Metadata (e.g., Source Name) is inherited from the first source encountered during the collection cycle.
- Q: URL Matching Strictness → A: Absolute: Duplicate detection uses exact string matching for URLs as stored in the database.
- Q: Default Dashboard Filter State → A: All Content (Unfiltered): Show all items from all categories by default when the dashboard is loaded.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Categorized Content Collection (Priority: P1)

As a curator, I want the system to automatically tag collected content with the category associated with its source, so that I can easily browse and organize trends by topic.

**Why this priority**: Core functionality that provides the basic organization needed for the newsletter.

**Independent Test**: Can be tested by adding a source with a category, running a collection, and verifying the resulting trend item has the correct category tag.

**Acceptance Scenarios**:

1. **Given** a source "TechCrunch" assigned to the category "Technology", **When** content is collected from TechCrunch, **Then** the content is automatically tagged with "Technology".
2. **Given** a new source assigned to a category "AI", **When** a collection is triggered, **Then** the collected items appear in the dashboard with the "AI" tag.

---

### User Story 2 - Source Deduplication and Multi-Tagging (Priority: P1)

As a system administrator, I want the system to collect content only once even if a source is registered in multiple categories, but apply all relevant category tags to the collected item, ensuring efficient storage and comprehensive categorization.

**Why this priority**: Prevents redundant data and duplicate items in the UI while preserving category relevance as requested by the user.

**Independent Test**: Can be tested by registering the same RSS URL under two different categories (e.g., "General" and "Tech") and verifying that only one trend item is created per unique article, but it carries both tags.

**Acceptance Scenarios**:

1. **Given** a source URL "http://example.com/feed" registered twice—once in category "A" and once in category "B"—**When** collection runs, **Then** only one instance of each article is saved to the database.
2. **Given** an article collected from a source registered in multiple categories, **When** viewed on the dashboard, **Then** it displays all categories as tags (e.g., "Category A", "Category B").

---

### User Story 3 - Category-Based Filtering (Priority: P2)

As a curator, I want to filter the dashboard by category tags so that I can focus on specific topics when drafting my newsletter.

**Why this priority**: Enhances the usability of the dashboard as the volume of collected content grows.

**Independent Test**: Can be tested by clicking a category tag or selecting a category filter and verifying that only items with that tag are displayed.

**Acceptance Scenarios**:

1. **Given** content tagged with "Technology" and "Marketing", **When** filtering by "Technology", **Then** only technology-related items are shown.
2. **Given** an item with multiple tags ("AI", "Health"), **When** filtering by "AI", **Then** the item is shown.

---

### Edge Cases

- **No Category**: How does the system handle sources that are not assigned to any category? (Assumption: A default "Uncategorized" tag is applied).
- **Tag Removal/Edit**: What happens to content tags if a source's category is changed after collection? Assignment changes are future-only; existing trend items retain the tags they were assigned at the time of collection.
- **Duplicate Detection Logic**: If multiple sources share the exact same URL string (absolute match), the metadata (Source Name, Title) used for the resulting trend items is derived from the first source processed in the collection cycle.
- **Category Deletion**: If a category is deleted, its associated tags are hidden in the UI (soft-deleted) but preserved in the database for historical integrity.
- **Empty Filter State**: If all category filters are deselected (if the UI allows it), the dashboard should return to the default "All Content" view or display a friendly "Select a category" message.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support assigning one or more categories to a source.
- **FR-002**: System MUST automatically tag collected items with the category/categories of the originating source.
- **FR-002.1**: System MUST NOT allow manual creation, editing, or deletion of tags on individual trend items; all tagging is derived from source categories at ingestion.
- **FR-003**: System MUST identify duplicate sources by their unique URL during the collection process.
- **FR-003.1**: For duplicate URLs, the system MUST derive item metadata from the first encountered source instance.
- **FR-003.2**: System MUST use absolute string comparison for URL deduplication.
- **FR-004**: System MUST perform only one fetch operation per unique source URL during a collection cycle, regardless of how many categories it belongs to.
- **FR-005**: System MUST associate a single collected trend item with multiple category tags if the source belongs to multiple categories.
- **FR-006**: The dashboard MUST display tags on each trend item to indicate its source category/categories.
- **FR-007**: System MUST support multi-select filtering (OR logic) on the dashboard, allowing users to view content from one or more selected categories simultaneously.
- **FR-007.1**: The dashboard MUST display all trend items (unfiltered) by default when first loaded.
- **FR-008**: System MUST support soft-deletion of categories, which hides associated tags in the UI while maintaining data records for existing trend items.

### Key Entities *(include if feature involves data)*

- **Category**: Represents a logical grouping of sources (e.g., "Technology", "Business"). Supports soft-delete state.
- **Tag**: An association between a trend item and a category.
- **Source (Updated)**: Now has a relationship to one or more Categories.
- **Trend Item (Updated)**: Now has a relationship to one or more Tags.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of collected items from a categorized source are correctly tagged upon ingestion.
- **SC-002**: Database storage efficiency improves as redundant item entries for multi-category sources are eliminated (0% duplication for identical source URLs).
- **SC-003**: Collection processing time remains stable even when sources are mapped to multiple categories (no redundant network requests).
- **SC-004**: Users can filter the dashboard by category and receive filtered results in under 500ms.
- **SC-005**: 100% of trend items display their relevant category tags in the UI.

## Assumptions

- **A-001**: Sources are considered identical if they share the exact same URL string.
- **A-002**: A source can belong to multiple categories.
- **A-003**: If a source has no category, it will be tagged as "Uncategorized".
