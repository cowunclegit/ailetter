# Quickstart: Newsletter History Details

## Setup
1. Backend is ready (endpoint exists).
2. Frontend needs a new route `/newsletters/:id`.

## Verification
1. **Navigate to History**: Go to `/history`.
2. **Click Row**: Click on any newsletter row in the table.
3. **Check URL**: Verify browser address is `/newsletters/:id`.
4. **View Content**:
   - Verify Subject and Status are correct.
   - Verify articles list matches the counts in history.
   - Verify HTML sections (Intro/Outro) render correctly.
5. **Draft Action**:
   - For 'Draft' newsletters, verify "Continue Editing" button appears.
   - Click button and verify navigation to `/newsletters/:id/draft`.
6. **Return**: Use "Back to History" button to return.
