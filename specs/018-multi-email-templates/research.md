# Research: Multiple Email Templates

## Decision: Template Storage and Registry
- **Decision**: Store templates as individual EJS files in `backend/src/utils/templates/` and maintain a static registry in a `templateService.js`.
- **Rationale**: For a fixed set of 10+ professional designs, a static registry is more performant and easier to maintain than a database table. It also allows for easier version control of the templates themselves.
- **Alternatives considered**: 
    - Database storage: Overkill for static professional templates.
    - Inline HTML in code: Not maintainable or readable.

## Decision: Selection UI
- **Decision**: Use a responsive Grid (`@mui/material/Grid2` or `Grid`) with `Card` components for each template.
- **Rationale**: Provides a clear visual comparison of layouts. Cards can contain a thumbnail, name, and a selection state (border/overlay).
- **Interactions**: Clicking a card immediately updates the local draft state and triggers a preview re-render.

## Decision: Thumbnail Strategy
- **Decision**: Use static PNG/SVG thumbnails for the initial implementation.
- **Rationale**: Live iframe previews for 10+ templates simultaneously would be resource-intensive and slow to load. Pre-rendered thumbnails provide instant visual feedback.

## Decision: Template Variety (10+ Templates)
Proposed structural variations:
1. **Classic List**: Standard vertical layout.
2. **Modern Grid**: 2-column grid for articles.
3. **Bold Hero**: Featured first article with large image.
4. **Minimalist**: Clean text-heavy layout without large borders.
5. **Dark Mode**: Dark background with high-contrast text.
6. **Tech/Code**: Courier-style fonts and syntax-like highlights.
7. **Newsletter Magazine**: Masonry-style or dense grid.
8. **Accent Color (Blue)**: Primary brand color highlights.
9. **Accent Color (Green)**: Nature/Growth themed highlights.
10. **Accent Color (Purple)**: Luxury/Innovation themed highlights.
11. **Compact**: Small thumbnails and short summaries for high volume.
