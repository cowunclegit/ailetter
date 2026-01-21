# Feature Specification: Update Sources

**Feature Branch**: `013-update-sources`  
**Created**: 2026-01-19  
**Status**: Draft  
**Input**: User description: "Souces 수정 기능 추가, 현재는 삭제밖에 되지 않는데 수정을 하여 이름, 카테고리, URL/ID 등을 수정할 수 있게 해줘, 다만 Type(Youtube/RSS)는 수정 불가하도록 해줘"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Edit Source Details (Priority: P1)

As an administrator, I want to edit the details of an existing Source (Name, Category, URL/Channel ID) so that I can correct errors or update information without deleting and recreating the source.

**Why this priority**: Correcting data is a fundamental need for maintaining the integrity of the source list.

**Independent Test**: Can be tested by navigating to the source list, clicking an edit button for a source, changing fields, and verifying the updates are reflected in the list.

**Acceptance Scenarios**:

1. **Given** I am on the Source list page, **When** I click the "Edit" button for a source, **Then** a form (modal or page) opens pre-filled with the source's current data.
2. **Given** the Edit form is open, **When** I change the Name and click "Save", **Then** the source is updated and the list shows the new Name.
3. **Given** the Edit form is open, **When** I change the Category and click "Save", **Then** the source is updated with the new Category.
4. **Given** the Edit form is open, **When** I change the URL/Channel ID and click "Save", **Then** the source is updated with the new URL.

---

### User Story 2 - Prevent Type Modification (Priority: P1)

As an administrator, I must NOT be able to change the Type (YouTube vs. RSS) of an existing source during editing, because the processing logic differs significantly between types.

**Why this priority**: Critical to prevent system errors or undefined behavior that would occur if a source's type mismatching its URL/structure.

**Independent Test**: Can be tested by opening the edit form and verifying the "Type" field is disabled or read-only.

**Acceptance Scenarios**:

1. **Given** I am editing an existing RSS source, **Then** the "Type" field shows "RSS" and is disabled/read-only.
2. **Given** I am editing an existing YouTube source, **Then** the "Type" field shows "YouTube" and is disabled/read-only.

### Edge Cases

- What happens if I update the URL to an invalid format? (Assume: Standard validation applies as per creation).
- What happens if I try to save without changing anything? (Assume: No-op or success message with no changes).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide an interface to edit existing Sources.
- **FR-002**: System MUST allow updating the Source Name.
- **FR-003**: System MUST allow updating the Source Category.
- **FR-004**: System MUST allow updating the Source URL (or Channel ID).
- **FR-005**: System MUST prevent modification of the Source Type (RSS/YouTube) for existing sources.
- **FR-006**: System MUST validate updated fields (Name required, URL format) identical to creation rules.

### Key Entities *(include if feature involves data)*

- **Source**: Existing entity. Attributes to update: Name, CategoryID, URL. Attribute to protect: Type.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admin can successfully update any mutable field of a source in under 3 clicks.
- **SC-002**: 100% of attempts to change Source Type on existing records via the UI are blocked.
- **SC-003**: Updated source information is immediately visible in the Source list after save.