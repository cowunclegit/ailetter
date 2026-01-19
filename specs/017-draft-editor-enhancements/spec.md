# Feature Specification: Draft Editor Enhancements

**Feature Branch**: `017-draft-editor-enhancements`  
**Created**: 2026-01-19  
**Status**: Draft  
**Input**: User description: "Create Draft 시 Drag to Reorder Items에 각각에 아이템에 삭제도 가능하도록 삭제 버튼도 추가해줘 기사 리스트 앞에 설명(소개글 등), 기사 리스트 뒤에 설명(소개글 등)이 필요할 수도 있으니 추가 설명을 쓰기 위한 에디터도추가해야해(HTML이면 좋을거 같아) 메일 제목은 현재 Organize Newsletter #15 등으로 고정되어 있는데 이것도 수정이 가능하게 해주고 AI 추천하는 기능도 넣어야 하는데 LLM CUSTOM REST API를 사용할거야 우선은 API를 호출하면 CUSTOM REST API를 호출할 수 없으니 (AI 추천 제목)이라고 string append하는것으로 우선 구현해줘"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Refining Article List and Subject (Priority: P1)

As a newsletter curator, I want to remove irrelevant articles from my draft and customize the email subject line so that the newsletter is focused and appropriately titled.

**Why this priority**: Essential for basic draft management and personalization beyond the automated defaults.

**Independent Test**: Can be tested by creating a draft, deleting one article from the list, modifying the subject text, and saving the draft.

**Acceptance Scenarios**:

1. **Given** a draft article list, **When** the user clicks the delete button on a specific article item, **Then** that article is removed from the draft list.
2. **Given** the subject input field, **When** the user types a new subject, **Then** the newsletter subject is updated to the custom text.

---

### User Story 2 - Adding Context with Intro and Outro (Priority: P2)

As a newsletter curator, I want to add an introduction at the beginning and a conclusion at the end of the article list using a rich text editor so that I can provide context and personal touch to my subscribers.

**Why this priority**: Enhances the quality of the newsletter content, moving beyond just a list of links.

**Independent Test**: Can be tested by entering HTML/Rich Text into the intro and outro editors and verifying they are saved and displayed correctly in the newsletter preview.

**Acceptance Scenarios**:

1. **Given** the draft editor view, **When** the user enters text in the Introduction editor, **Then** the content is saved as the newsletter's preamble.
2. **Given** the draft editor view, **When** the user enters text in the Conclusion editor, **Then** the content is saved as the newsletter's closing remarks.

---

### User Story 3 - AI-Assisted Subject Line (Priority: P3)

As a newsletter curator, I want to get suggestions for the email subject line from an AI so that I can improve open rates with more engaging titles.

**Why this priority**: Provides additional value by leveraging AI, though the draft can be manually titled without it.

**Independent Test**: Can be tested by clicking the "AI Recommend" button and verifying that the subject text is updated with the expected placeholder suffix.

**Acceptance Scenarios**:

1. **Given** a subject line, **When** the user clicks the "AI Recommend" button, **Then** the text "(AI 추천 제목)" is appended to the current subject line.

---

### Edge Cases

- **Empty Introduction/Conclusion**: System must handle drafts where intro or outro sections are left blank.
- **Deleting All Articles**: System should handle or warn the user if they try to save a newsletter with no articles remaining.
- **Large Subject Lines**: Ensure the UI handles very long subject lines without breaking the layout.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a "Delete" button for each item in the drag-and-drop reorderable list.
- **FR-002**: System MUST allow users to edit the newsletter subject line in a text input field.
- **FR-003**: System MUST provide an "Introduction" editor located above the article list.
- **FR-004**: System MUST provide a "Conclusion" editor located below the article list.
- **FR-005**: The Introduction and Conclusion editors MUST support rich text/HTML input.
- **FR-006**: System MUST provide a button to trigger AI subject recommendation.
- **FR-007**: AI Subject Recommendation MUST append "(AI 추천 제목)" to the current subject text as an initial implementation.
- **FR-008**: All draft changes (deleted items, custom subject, intro/outro text) MUST be persisted when the draft is saved.

### Key Entities *(include if feature involves data)*

- **Newsletter Draft**: Updated to include `subject`, `introduction_html`, and `conclusion_html`.
- **Draft Item**: Articles linked to the draft; must support deletion (removing the link).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can delete an article from a draft list in a single click.
- **SC-002**: Introduction and Conclusion content is successfully rendered in the newsletter preview as HTML.
- **SC-003**: Subject line changes are reflected in the sent email's subject header.
- **SC-004**: AI recommendation placeholder is visible immediately after clicking the suggestion button.