# Feature Specification: AI Subject Recommendation Options

**Feature Branch**: `020-ai-subject-options`  
**Created**: 2026-01-19  
**Status**: Draft  
**Input**: User description: "Create Draft 시 Subject를 AI Recommend로 추천 받는데 아래 옵션을 추가하는 기능을 만들어야 해 옵션은 필수로 선택이 되어야 하는데 리더들을 위한 SW개발자들을 위한 등 사용자가 직접 AI Recommend를 하기 위한 프롬프트를 추가해서 LLM을 이용할 수 있게 만들어주고 옵션은 신규,수정,삭제가 되어야 해 프롬프트에서는 예약어 ${contentList}를 통하여 실제 Draft Item들의 제목과 요약 리스트를 전달하여 프롬프트에서 사용 할 수 있게 해줘"

## Clarifications

### Session 2026-01-19
- Q: How should the draft items be formatted when injected into the prompt? → A: Markdown bullet points (e.g., "- Title: Summary").
- Q: Where and how should the curator select the preset within the draft editor? → A: Dropdown menu positioned immediately next to the "AI Recommend" button.
- Q: Where should the management interface for these presets be located? → A: A dedicated Settings page within the application.
- Q: How should the system handle ${contentList} if the draft is empty? → A: Replace with an empty string ('').

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Managing AI Recommendation Presets (Priority: P1)

As a newsletter curator, I want to manage a list of AI recommendation presets (e.g., "For Leaders", "For Developers") with custom prompt templates so that I can tailor the AI-generated subject lines to specific audiences.

**Why this priority**: Core requirement for the feature. Users need a way to define how the AI should behave.

**Independent Test**: Can be fully tested by creating a new preset with a name and a prompt containing `${contentList}`, updating its name, and deleting it.

**Acceptance Scenarios**:

1. **Given** the AI Option management view, **When** the user provides a name and a prompt template, **Then** a new preset is saved and appears in the list.
2. **Given** an existing preset, **When** the user modifies the prompt and saves, **Then** the updated prompt is persisted.
3. **Given** an existing preset, **When** the user deletes it, **Then** it is no longer available for selection.

---

### User Story 2 - Using Presets for Subject Generation (Priority: P1)

As a newsletter curator, I want to select a preset before clicking "AI Recommend" so that the LLM generates a subject line based on my specific prompt instructions and the current draft content.

**Why this priority**: This is the primary interaction for the end-user during the draft creation process.

**Independent Test**: Can be tested by selecting a preset, clicking "AI Recommend", and verifying that the LLM is called with the prompt where `${contentList}` is replaced by actual item data.

**Acceptance Scenarios**:

1. **Given** a newsletter draft with items, **When** the user selects a preset and clicks "AI Recommend", **Then** the system replaces `${contentList}` with the titles and summaries of the draft items.
2. **Given** the processed prompt, **When** the LLM returns a suggestion, **Then** the draft subject line is updated with the suggested text.
3. **Given** no preset is selected, **When** the user clicks "AI Recommend", **Then** the system prompts the user to select an option first.

---

### User Story 3 - Default Presets (Priority: P2)

As a newsletter curator, I want some pre-defined presets to be available out-of-the-box so that I can use the AI recommendation feature immediately without manual configuration.

**Why this priority**: Enhances immediate usability and provides examples for users.

**Independent Test**: Can be tested by checking the AI options list on a fresh installation.

**Acceptance Scenarios**:

1. **Given** a new installation, **When** the user views AI options, **Then** presets like "For Leaders" and "For Developers" are already available.

---

### Edge Cases

- **Empty Draft**: What happens when `${contentList}` is used but there are no items in the draft? (System should handle gracefully, perhaps warning the user or providing a fallback string).
- **Prompt Size**: What happens if the combined length of the prompt and the content list exceeds LLM limits? (System should truncate or warn).
- **Invalid Placeholder**: What happens if the user makes a typo in `${contentList}`? (System should treat it as literal text, but UI could highlight it).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a CRUD interface for "AI Subject Presets" located on a dedicated Settings page.
- **FR-002**: Each preset MUST have a unique name and a prompt template string.
- **FR-003**: The prompt template MUST support the reserved keyword `${contentList}`.
- **FR-004**: When generating a subject, the system MUST replace `${contentList}` with a string of Markdown bullet points (e.g., "- Title: Summary") containing the titles and summaries of all items in the current draft.
- **FR-005**: Selection of an AI Subject Preset via a dropdown menu MUST be mandatory before triggering the AI recommendation.
- **FR-006**: System MUST call an LLM (via REST API) using the resolved prompt to get the subject suggestion.
- **FR-007**: System SHOULD provide at least two default presets: "For Leaders" and "For Developers".

### Key Entities *(include if feature involves data)*

- **AI Subject Preset**:
    - `id`: Unique identifier.
    - `name`: Human-readable label (e.g., "SW Developers").
    - `prompt_template`: The text template containing instructions and `${contentList}`.
    - `is_default`: Boolean flag for system-provided presets.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully create, edit, and delete custom AI presets.
- **SC-002**: The `${contentList}` placeholder is correctly expanded into item data before being sent to the LLM.
- **SC-003**: Subject generation is blocked until a preset is selected.
- **SC-004**: LLM response is received and populated into the subject field in under 5 seconds (excluding LLM processing time).