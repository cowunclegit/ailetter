# Research & Decisions: Source Categories

**Feature**: 012-source-categories

## Decisions

### Database Schema Design
- **Decision**: Create a new `source_categories` table and add a `category_id` foreign key to the `sources` table.
- **Rationale**: Normalization allows for efficient renaming and management of categories without duplicating strings in the `sources` table. It ensures consistency.
- **Alternatives Considered**: 
  - Adding a text column `category` to `sources`. Rejected because renaming a category would require updating all rows, and it doesn't support strict validation of allowed categories as easily.

### Frontend Routing
- **Decision**: Add a new route `/categories` for the management page.
- **Rationale**: Keeps the management interface distinct from the main dashboard, adhering to the requirement for a "Dedicated Page".

### API Structure
- **Decision**: RESTful endpoints at `/api/categories`.
- **Rationale**: Standard convention for resource management in this project.
