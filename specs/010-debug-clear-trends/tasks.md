# Tasks: Debug Full System Wipe

## Phase 1: Setup
- [x] T001 Verify branch `010-debug-clear-trends`
- [x] T002 Baseline test run

## Phase 2: Backend (P1)
- [x] T003 Create `backend/src/api/debug.js` with `POST /wipe` logic
- [x] T004 Add wipe logic to delete from: `trend_items`, `newsletter_items`, `newsletters`, `sources`, `subscribers`
- [x] T005 Register debug router in `backend/src/server.js`

## Phase 3: Frontend (P2)
- [x] T006 Create `frontend/src/pages/Debug.jsx` with a "Full System Wipe" button
- [x] T007 Add confirmation `Dialog` (MUI) to the button
- [x] T008 Add `/debug` route to `frontend/src/App.jsx`
- [x] T009 Add "Clear All Trends" button to the Debug page (Part of Full Wipe)

## Phase 4: Verification
- [x] T010 Manually verify full wipe deletes all items and redirects correctly
- [x] T011 Ensure no breaking side effects on next data collection