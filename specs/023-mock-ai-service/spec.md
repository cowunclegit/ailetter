# Feature Specification: Mock AI Service Integration

**Feature Branch**: `023-mock-ai-service`  
**Created**: 2026-01-21  
**Status**: Draft  
**Input**: User description: "aiService에서 openai 라이브러리를 사용하지 않고 custom api를 나중에 구현할거야 지금은 단순히 가상으로 ai 에뮬레이션해서 답변을 리턴해주는 방식으로 수정해줘"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - System Functionality with Mock AI (Priority: P1)

As a system developer or automated process, I want the AI-driven features (like trend summarization and subject generation) to function without requiring an external OpenAI connection, so that the system remains operational and testable without API dependencies.

**Why this priority**: Essential for decoupling from external providers and enabling local development/testing without costs or connectivity issues.

**Independent Test**: Can be fully tested by triggering an AI-dependent action (e.g., generating a newsletter draft) and verifying that content is successfully generated using the mock service.

**Acceptance Scenarios**:

1. **Given** the system is configured to use the mock AI service, **When** a trend summary is requested, **Then** the system returns a predefined or template-based summary response immediately.
2. **Given** the system is configured to use the mock AI service, **When** an email subject is generated, **Then** the system returns a valid subject line from the mock repository.

---

### User Story 2 - Seamless Future Integration (Priority: P2)

As a developer, I want the AI service layer to be abstracted such that replacing the mock implementation with a custom API implementation later requires minimal changes to the rest of the codebase.

**Why this priority**: Ensures long-term maintainability and aligns with the stated goal of implementing a custom API later.

**Independent Test**: Verified by reviewing the code structure to ensure all AI calls go through a unified interface that doesn't leak implementation details.

**Acceptance Scenarios**:

1. **Given** a standard AI interface, **When** a custom API is implemented, **Then** only the internal logic of the AI service needs to change, not the components calling it.

---

### Edge Cases

- **What happens when the expected AI output format is complex (e.g., multi-field JSON)?** The mock service must return valid, well-formed JSON that matches the schema expected by the consumer.
- **How does the system handle concurrent requests to the mock service?** The mock service should handle multiple requests without locking or performance degradation, ideally returning responses nearly instantaneously.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST remove the direct dependency on the `openai` library within the `aiService`.
- **FR-002**: The system MUST implement a mock AI provider that emulates the behavior of an AI engine.
- **FR-003**: The mock AI provider MUST return deterministic or template-based responses for all current AI use cases (summarization, tagging, subject generation).
- **FR-004**: The system MUST NOT require an OpenAI API key or any external credentials to perform AI tasks in this mode.
- **FR-005**: All internal components MUST interact with a generic AI service interface rather than a provider-specific client.

### Key Entities *(include if feature involves data)*

- **AI Response Template**: A collection of predefined strings or patterns used to emulate AI output.
- **AI Service Interface**: The contract defining the methods for interaction with any AI provider (mock or real).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of features previously requiring OpenAI now function correctly using the mock emulation.
- **SC-002**: AI-related service calls complete in under 50ms (average).
- **SC-003**: Zero imports or references to the `openai` library remain in the active `aiService` implementation.
- **SC-004**: System successfully generates a newsletter draft with mock summaries and subjects on the first attempt after modification.