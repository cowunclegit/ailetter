# Quickstart: Update Sources

## Overview
This feature allows administrators to edit existing sources (Name, Category, URL) while preventing changes to the Source Type.

## Prerequisites
- Backend running on `http://localhost:3000`
- Frontend running on `http://localhost:5173`

## Usage Guide

### Editing a Source
1. Navigate to the **Sources** page.
2. Find the source you want to edit.
3. Click the **Edit** icon (pencil) in the actions column.
4. A form will appear with the source's data.
5. Modify the **Name**, **Category**, or **URL**.
   - *Note: The **Type** field is disabled.*
6. Click **Save** (or "Update Source").
7. Verify the changes are reflected in the list.

## Testing

### Manual Testing
1. **Name Change**: Edit a source, change name, save. Verify list updates.
2. **Type Protection**: Try to enable the Type dropdown via dev tools or verify it is visually disabled.
3. **Validation**: Clear the name and try to save. Ensure it blocks.

### Automated Testing
- Run `npm test` in `backend/` to verify the `PUT` endpoint ignores `type` changes.
- Run `npm test` in `frontend/` to verify the Edit form behavior.
