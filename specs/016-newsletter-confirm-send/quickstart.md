# Quickstart: Newsletter Approval and Sending Workflow

## Setup
1. Ensure the `newsletters` table in SQLite has the `confirmation_uuid` column.
2. Install dependencies: `npm install uuid ejs`.

## Integration Scenarios

### 1. Verification Flow
1. Create a draft newsletter.
2. Go to the Preview page to see the generated HTML.
3. Click "Send Test Mail".
4. Check the backend console for the `confirmation_uuid` and simulated email log.
5. Visit `http://localhost:3000/api/newsletters/confirm/<uuid>`.
6. Verify that the newsletter status changes to `sent` and distribution logs appear in the console.

### 2. Duplicate Prevention
1. Attempt to visit the same confirmation URL again.
2. Verify the system returns an error or redirects to a failure page.
