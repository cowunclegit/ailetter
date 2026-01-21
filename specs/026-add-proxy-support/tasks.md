# Tasks: Proxy Support for Proxy Service

**Input**: Design documents from `/specs/026-add-proxy-support/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/env.md

**Tests**: MANDATORY. Per Constitution Principle II, all features must be tested. Tests must be written first (TDD).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Path convention: `proxy-service/src/`, `proxy-service/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Install `https-proxy-agent` and `proxy-from-env` dependencies in `proxy-service/package.json`
- [X] T002 Configure linting for new files in `proxy-service/.eslintrc.js`
- [X] T003 [P] Create directory structure for proxy utilities: `proxy-service/src/utils/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T004 Setup environment variable loader for `PROXY_URL` and `NO_PROXY` in `proxy-service/src/config/proxy-config.js`
- [X] T005 [P] Implement base error classes for proxy connection failures in `proxy-service/src/utils/errors.js`
- [X] T006 [P] Create skeleton for proxy agent factory in `proxy-service/src/utils/proxy.js`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Configure Corporate Proxy (Priority: P1) 🎯 MVP

**Goal**: Enable routing of external requests through a corporate proxy.

**Independent Test**: Configure `PROXY_URL`, fetch an external RSS feed, and verify the request is routed through the proxy.

### Tests for User Story 1 (MANDATORY) ⚠️

- [X] T007 [P] [US1] Unit test for proxy agent creation in `proxy-service/tests/unit/proxy.test.js`
- [X] T008 [US1] Integration test for RSS fetching via proxy in `proxy-service/tests/integration/proxy-flow.test.js`

### Implementation for User Story 1

- [X] T009 [US1] Implement `getProxyAgent` logic in `proxy-service/src/utils/proxy.js` to return `HttpsProxyAgent` for external URLs
- [X] T010 [US1] Update `proxy-service/src/collector.js` to use `getProxyAgent` for all external HTTP/HTTPS requests
- [X] T011 [US1] Add logging for successful proxy connection in `proxy-service/src/utils/proxy.js`
- [X] T012 [US1] Update `proxy-service/src/index.js` to initialize proxy configuration on startup

**Checkpoint**: User Story 1 is functional. External requests route through proxy when configured.

---

## Phase 4: User Story 2 - Direct Access without Proxy (Priority: P2)

**Goal**: Ensure the service works normally without a proxy when none is configured.

**Independent Test**: Clear `PROXY_URL`, fetch an external resource, and verify direct connection.

### Tests for User Story 2 (MANDATORY) ⚠️

- [X] T013 [P] [US2] Unit test for direct agent fallback in `proxy-service/tests/unit/proxy.test.js`
- [X] T014 [US2] Integration test for data fetching without proxy configuration in `proxy-service/tests/integration/proxy-flow.test.js`

### Implementation for User Story 2

- [X] T015 [US2] Update `getProxyAgent` in `proxy-service/src/utils/proxy.js` to return `null` or standard agent when no proxy is configured
- [X] T016 [US2] Ensure `proxy-service/src/collector.js` handles null agents by performing direct requests

**Checkpoint**: User Story 2 is functional. Backward compatibility with direct connections is maintained.

---

## Phase 5: User Story 3 - Authenticated Proxy Support (Priority: P3)

**Goal**: Support proxies that require Basic Authentication.

**Independent Test**: Configure `PROXY_URL` with credentials (e.g., `http://user:pass@proxy:port`) and verify successful fetch.

### Tests for User Story 3 (MANDATORY) ⚠️

- [X] T017 [P] [US3] Unit test for proxy URL parsing with credentials in `proxy-service/tests/unit/proxy.test.js`
- [X] T018 [US3] Integration test with mock authenticated proxy in `proxy-service/tests/integration/proxy-flow.test.js`

### Implementation for User Story 3

- [X] T019 [US3] Enhance `getProxyAgent` in `proxy-service/src/utils/proxy.js` to correctly pass credentials to `HttpsProxyAgent`
- [X] T020 [US3] Implement sensitive logging masking (mask password in `PROXY_URL` logs) in `proxy-service/src/utils/proxy.js`

**Checkpoint**: User Story 3 is functional. Authenticated proxies are supported.

---

## Phase 6: NO_PROXY Bypass Support (P1/P2 extension)

**Goal**: Allow specific hosts to bypass the proxy.

**Independent Test**: Configure `PROXY_URL` and `NO_PROXY`, fetch a host in `NO_PROXY`, and verify direct connection.

### Tests for NO_PROXY Support (MANDATORY) ⚠️

- [X] T021 [P] [US1] Unit test for host matching against `NO_PROXY` list in `proxy-service/tests/unit/proxy.test.js`
- [X] T022 [US1] Integration test for bypassing proxy for internal hosts in `proxy-service/tests/integration/proxy-flow.test.js`

### Implementation for NO_PROXY Support

- [X] T023 [US1] Implement `shouldProxy(url)` helper in `proxy-service/src/utils/proxy.js` to check against `NO_PROXY`
- [X] T024 [US1] Update `getProxyAgent` to call `shouldProxy(url)` before creating a proxy agent

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T025 [P] Update `proxy-service/README.md` with new environment variables
- [X] T026 Add error handling for invalid `PROXY_URL` formats in `proxy-service/src/config/proxy-config.js`
- [X] T027 [P] Verify `quickstart.md` steps in a clean environment
- [X] T028 Performance check: Ensure agent reuse to prevent socket leaks in `proxy-service/src/utils/proxy.js`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Core dependencies initialization.
- **Foundational (Phase 2)**: Config and skeleton logic.
- **User Stories (Phase 3+)**: Depend on Foundational (Phase 2). 
  - US1 (P1) is the MVP.
  - US2 (P2) and US3 (P3) can follow.

### Parallel Opportunities

- Unit tests for US1, US2, US3 can be drafted in parallel in `proxy-service/tests/unit/proxy.test.js`.
- Error classes (T005) and Config loader (T004) can be implemented in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 + NO_PROXY)

1. Complete Setup + Foundational.
2. Complete User Story 1 implementation.
3. Add NO_PROXY bypass logic (critical for most corporate environments).
4. **STOP and VALIDATE**: Test with an actual or mocked proxy.

### Incremental Delivery

1. Foundation ready.
2. US1 + NO_PROXY → MVP.
3. US2 → Compatibility check.
4. US3 → Enterprise support.
