# Feature Specification: Source Categories

**Feature Branch**: `012-source-categories`  
**Created**: 2026-01-19  
**Status**: Draft  
**Input**: User description: "Sources에 카테고리를 추가해서 AI개발, UX, 제조 등 여러 분야의 Sources를 추가 할 수 있게 해주고 카테코리 자체도 추가, 수정, 삭제가 가능하게 해야해"

## Clarifications

### Session 2026-01-19
- Q: How should the system handle Sources assigned to a category that is being deleted? → A: Unassign (Set Null) - Automatically remove the category from linked sources (they become "Uncategorized").
- Q: Where should the user manage these categories? → A: Dedicated Page - A new menu item/page for full category management.
- Q: How should categories be ordered in lists and dropdowns? → A: Alphabetical - Automatically sort categories A-Z.
- Q: Can a source belong to multiple categories? → A: Single Select - Each source belongs to exactly one category (or none).
- Q: Should the source list be filterable by category? → A: Category Filter - Add a dropdown to filter the Source list by category.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Manage Source Categories (Priority: P1)

As an administrator, I want to create, update, and delete categories via a dedicated "Categories" management page so that I can define specific topics like "AI Development", "UX", or "Manufacturing".

**Why this priority**: This is the foundational data structure required before sources can be categorized.

**Independent Test**: Can be tested by navigating to a category management area and performing CRUD operations on categories without needing to touch sources yet.

**Acceptance Scenarios**:

1. **Given** I am on the category management page, **When** I enter a new category name "AI Development" and click add, **Then** the category appears in the list.
2. **Given** an existing category "Manufacture", **When** I rename it to "Manufacturing", **Then** the list shows the updated name.
3. **Given** a category "Unused", **When** I delete it, **Then** it is removed from the list.
4. **Given** I try to create a category with a duplicate name, **Then** the system prevents it and shows an error.

---

### User Story 2 - Assign Category to Source (Priority: P1)

As an administrator, I want to assign a category when adding or editing a Source so that the source is correctly classified.

**Why this priority**: Links the source data to the new category structure, enabling the organization of content.

**Independent Test**: Can be tested by creating/editing a source and verifying the category selection persists.

**Acceptance Scenarios**:

1. **Given** I am creating a new Source, **When** I look at the form, **Then** I see a dropdown or selector to choose from existing categories.
2. **Given** an existing Source, **When** I edit it and change the category from "UX" to "AI", **Then** the source is saved with the new category "AI".
3. **Given** I am viewing the list of Sources, **Then** I can see the assigned category for each source.

### Edge Cases

- What happens if I delete a category that is currently assigned to a Source? The system MUST automatically unassign the category from those sources, leaving them "Uncategorized".
- What happens if I create a source but no categories exist yet? (Assume: Category selection is optional or "Uncategorized" default exists).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow creating, reading, updating, and deleting (CRUD) Source Categories.
- **FR-002**: Source Categories MUST have a unique name.
- **FR-003**: System MUST allow assigning exactly one Category to a Source.
- **FR-004**: System MUST allow removing a Category assignment from a Source (making it uncategorized).
- **FR-005**: The Source list view MUST display the assigned Category for each Source.
- **FR-006**: When deleting a category, the system MUST handle linked sources safely (e.g., set them to null or block deletion).
- **FR-007**: System MUST provide a dedicated page/view for managing Source Categories.
- **FR-008**: System MUST sort categories alphabetically in all list and selection views.
- **FR-009**: System MUST allow filtering the Source list by Category.

### Key Entities *(include if feature involves data)*

- **Source Category**: Represents a topic or field (e.g., "AI", "UX"). Attributes: Name (Unique, Required).
- **Source**: Existing entity. New Attribute: CategoryID (Foreign Key to Source Category, Optional).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admin can define at least 10 different categories without UI issues.
- **SC-002**: Admin can successfully assign and re-assign categories to 100% of existing sources.
- **SC-003**: Source list loads with category information in under 1 second (standard performance).