# Feature Specification: Multiple Email Templates

**Feature Branch**: `018-multi-email-templates`  
**Created**: 2026-01-19  
**Status**: Draft  
**Input**: User description: "create draft 시 여러가지 메일 템플릿을 선택할 수 있게 해줘, 최소 10개 이상 메일 템플릿을 만들어줘"

## Clarifications

### Session 2026-01-19
- Q: With at least 10 templates required, what is the preferred layout for the selection interface? → A: Responsive Grid of thumbnails (Option A).
- Q: Content summary requirements across templates? → A: All templates must include content thumbnails in their summaries.
- Q: Beyond the structural layout, should users be able to customize styling? → A: Templates will provide structural variety with fixed designs (no per-template color/font editing).
- Q: Behavior when changing templates for an existing draft? → A: Immediate re-render (Live switch).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Choosing a Template during Draft Creation (Priority: P1)

As a newsletter curator, I want to select from a list of various email templates when creating a new newsletter draft so that I can choose a layout that best suits my current content.

**Why this priority**: Core value of the feature. Without selection, users are stuck with a single default layout.

**Independent Test**: Can be fully tested by starting the draft creation process, selecting a specific template from a list of options, and verifying that the draft is successfully created with that template assigned.

**Acceptance Scenarios**:

1. **Given** the draft creation view, **When** the user is presented with template options, **Then** at least 10 distinct templates are available for selection.
2. **Given** a selected template, **When** the draft is created, **Then** the draft metadata correctly stores the chosen template ID.

---

### User Story 2 - Previewing Templates (Priority: P2)

As a newsletter curator, I want to see a visual preview of each template before I make a selection so that I can understand the layout and styling differences without having to create multiple drafts.

**Why this priority**: Enhances user experience by providing visual feedback before a decision is made.

**Independent Test**: Can be tested by navigating the template selection list and verifying that a thumbnail or live preview is displayed for each template.

**Acceptance Scenarios**:

1. **Given** the template selection list, **When** the user hovers over or selects a template entry, **Then** a visual representation (thumbnail or layout sketch) of that template is displayed.

---

### Edge Cases

- **Default Template**: If no template is explicitly selected, the system should fall back to a sensible default (Legacy template).
- **Template Unavailability**: If a template is removed or disabled, existing drafts using that template should still render using a fallback or the cached layout.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide at least 10 distinct email template layouts with structural variety (e.g., Grid, List, Bold) and fixed professional designs.
- **FR-002**: Users MUST be able to select a template during the initial "Create Draft" step or in the draft editor settings.
- **FR-003**: System MUST store the selected template ID as part of the Newsletter Draft entity.
- **FR-004**: System MUST render the newsletter preview and the final sent email using the structure defined by the selected template.
- **FR-005**: System MUST provide a responsive grid of visual thumbnails for all available templates in the selection UI.
- **FR-006**: All email templates MUST include content thumbnails within the article summary sections.

### Key Entities *(include if feature involves data)*

- **Newsletter Template**:
    - `id`: Unique identifier.
    - `name`: Human-readable name.
    - `thumbnail_url`: Path to a preview image.
    - `layout_file`: Path to the EJS template file or layout reference.
- **Newsletter Draft (Updated)**:
    - `template_id`: Foreign key to the selected Newsletter Template.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 10 functional and distinct email templates are available in the system.
- **SC-002**: Users can switch templates for a draft in under 3 clicks.
- **SC-003**: The rendered newsletter (preview and sent) matches the structure of the selected template 100% of the time.
- **SC-004**: Template selection is persisted across browser refreshes and session restarts.