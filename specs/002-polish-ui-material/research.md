# Research: UI Polish & Material Design

**Feature**: UI Polish & Material Design
**Date**: 2026-01-13
**Status**: Complete

## Technology Decisions

### 1. UI Framework: MUI (Material-UI) v5
**Decision**: Use MUI (Material-UI) v5 as the primary component library.
**Rationale**:
- Mature ecosystem with comprehensive documentation.
- "System Default" theme requirement matches MUI's out-of-the-box behavior.
- Strong accessibility support.
- Excellent integration with React and Vite.

### 2. Theming Strategy
**Decision**: Use `createTheme` with default values and `<CssBaseline />`.
**Rationale**:
- **System Default**: The requirement explicitly asks for the standard theme. `createTheme({})` provides this.
- **Consistency**: `<CssBaseline />` ensures consistent browser rendering (normalize.css equivalent) and applies standard Material background colors.

### 3. Layout Architecture
**Decision**: 
- **Global Layout**: `Box` (flex column) with `AppBar` (fixed/sticky) and `Container` (main content).
- **Grids**: Use `Grid` (v2) or `Stack` components for responsive arrangements.
- **Feedback**: Global `Snackbar` provider context to manage notifications from anywhere in the app.

## Best Practices & Patterns

### MUI Integration
- **Styling**: Use the `sx` prop for one-off styles and `styled` API for reusable components. Avoid `makeStyles` (deprecated in v5).
- **Icons**: Use `@mui/icons-material` for standard iconography.
- **Responsiveness**: Use MUI's breakpoints (`xs`, `sm`, `md`, `lg`, `xl`) within `sx` props or Grid components (e.g., `xs={12} md={6} lg={4}`).

### Component Mapping
- **Buttons**: `<Button variant="contained" />` for primary, `variant="outlined"` for secondary.
- **Inputs**: `<TextField variant="outlined" />`.
- **Cards**: `<Card>` wrapping `<CardContent>` and `<CardActions>`.
- **Navigation**: `<AppBar>` containing `<Toolbar>` with navigation links.

## Alternatives Considered

- **Material Design Lite**: Rejected as it is legacy and less integrated with modern React.
- **Tailwind + Headless UI**: Rejected because full Material Design compliance was requested, and MUI provides this "batteries-included" faster than building from scratch.
- **Custom CSS**: Rejected due to high effort to replicate Material Design complex interactions (ripples, floating labels, shadows) and accessibility features.
