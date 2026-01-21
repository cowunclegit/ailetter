# Implementation Plan: Debug Full System Wipe

**Branch**: `010-debug-clear-trends` | **Date**: 2026-01-14 | **Spec**: [specs/010-debug-clear-trends/spec.md](spec.md)

## Summary
Implement a "Full System Wipe" debug tool. This includes a backend endpoint to delete all data from all primary tables and a new React page at `/debug` to host the trigger button.

## Technical Context
- **Backend**: Node.js/Express. New route `POST /api/debug/wipe`.
- **Frontend**: React. New route `/debug`.
- **Database**: SQLite3. Atomic deletion of all rows.

## Project Structure
- `backend/src/api/debug.js`: New debug routes.
- `frontend/src/pages/Debug.jsx`: New debug page.

## Tasks
- T001 [Backend] Create `POST /api/debug/wipe` to delete data from all tables.
- T002 [Backend] Register debug router in `app.js`.
- T003 [Frontend] Create `Debug.jsx` page with "Full System Wipe" button and confirmation.
- T004 [Frontend] Add `/debug` route to `App.jsx`.
- T005 [Test] Verify full wipe in a clean environment.
