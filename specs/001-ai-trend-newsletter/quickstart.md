# Quickstart: AI Trend Newsletter

## Prerequisites

- Node.js v18+
- SQLite3
- OpenAI API Key
- SendGrid API Key

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file:
   ```env
   DATABASE_URL="file:./dev.db"
   OPENAI_API_KEY="sk-..."
   SENDGRID_API_KEY="SG..."
   PORT=3000
   ```

3. **Database Migration**
   Initialize the SQLite database schema:
   ```bash
   npm run db:migrate
   ```

## Running the Application

- **Start Backend (API + Jobs)**
  ```bash
  npm run start:server
  ```
- **Start Frontend (Admin UI)**
  ```bash
  npm run start:client
  ```

## Usage Guide

1. **Add Sources**: Navigate to `/admin/sources` and add RSS feed URLs (e.g., `https://techcrunch.com/feed/`).
2. **Trigger Collection**: The background job runs weekly, or you can manually trigger it via the admin dashboard button.
3. **Review Trends**: Go to `/admin/trends` to see the AI-curated list.
4. **Create & Send**: Select items -> "Create Draft" -> Preview -> "Send".
