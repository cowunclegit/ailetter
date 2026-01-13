# Quickstart: UI Polish & Material Design

## Prerequisites
- Node.js (v18+)
- npm (v9+)

## Setup

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Key Components
- **Layout**: Wraps all pages, provides Navigation.
- **TrendCard**: Used in Dashboard grid.
- **FeedbackProvider**: Context for global snackbars.

## Theme Customization
Modify `frontend/src/theme/index.js` to adjust global styles. Currently set to **System Default** per specification.
