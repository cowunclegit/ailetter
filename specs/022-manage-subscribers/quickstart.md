# Quickstart: Subscriber Management

## Prerequisites
- Node.js environment
- SQLite database initialized

## Testing the Feature

### 1. Database Migration
Ensure the new tables are created:
```bash
npm run db:migrate
```

### 2. Admin UI
1. Navigate to the dashboard.
2. Locate the new "Subscribers" tab/link.
3. **Add User**: Click "Add Subscriber", fill form, save. Verify in list.
4. **Edit User**: Click a user row, change categories or toggle status. Save.
5. **Sync**: Click the "Sync" button. Check server console for "Simulating sync..." log.

### 3. Unsubscribe Flow
1. Obtain a subscriber's UUID (from DB or API response).
2. Navigate to `http://localhost:5173/unsubscribe/<UUID>`.
3. Verify the "Unsubscribe Successful" message.
4. Check Admin UI to confirm status is now `Unsubscribed`.
