# Quickstart: Collect Now & Progress

## Prerequisites
- Node.js & NPM
- Running Backend Server (`npm run dev:backend`)
- Running Frontend Server (`npm run dev:frontend`)

## Testing the Feature

1. **Navigate to Dashboard**: Open `http://localhost:5173` (or configured frontend port).
2. **Locate Button**: Find the "Collect NOW" button (likely in the toolbar/header of the Trend List).
3. **Trigger**: Click the button.
   - *Expected*: Button changes to loading state (spinner).
4. **Monitor**: 
   - Watch the backend logs (`npm run dev:backend` terminal) for "Starting collection job...".
   - Watch the frontend network tab for polling requests to `/api/trends/collect/status`.
5. **Completion**:
   - Wait for backend to log "Collection Job finished" or similar.
   - *Expected*: Button reverts to normal state.
   - *Expected*: Trend list refreshes automatically (new items appear if any).

## API Commands (Manual Verification)

**Trigger Collection:**
```bash
curl -X POST http://localhost:3000/api/trends/collect
```

**Check Status:**
```bash
curl http://localhost:3000/api/trends/collect/status
```
