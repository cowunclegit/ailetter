# Research & Decisions: Update Sources

**Feature**: 013-update-sources

## Decisions

### API Method
- **Decision**: Use `PUT /api/sources/:id` for updating existing sources.
- **Rationale**: `PUT` is the standard HTTP method for updating resources.
- **Alternatives Considered**: 
  - `PATCH`: Could be used for partial updates, but we are updating the entire mutable state of the object (or close to it). `PUT` is simpler and fits the pattern of "save changes".

### Data Validation
- **Decision**: Validate on both Frontend (prevent submitting if Type changed or fields empty) and Backend (ignore Type field if sent, validate required fields).
- **Rationale**: Dual validation ensures UI responsiveness and Backend data integrity. Explicitly ignoring `type` in the backend update logic prevents malicious or accidental type changes.

### UI Interaction
- **Decision**: Reuse `SourceForm` but add an `isEditing` prop to disable the Type selector.
- **Rationale**: Reusing the form reduces code duplication. The Type field will be rendered as a disabled select or read-only text when in edit mode.
