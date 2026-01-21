CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('rss', 'youtube')),
  url TEXT NOT NULL,
  reliability_score REAL DEFAULT 1.0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  category_id INTEGER -- Legacy, should be removed later
);

CREATE TABLE IF NOT EXISTS source_categories (
  source_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  PRIMARY KEY (source_id, category_id),
  FOREIGN KEY (source_id) REFERENCES sources (id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS trend_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  original_url TEXT NOT NULL UNIQUE,
  published_at DATETIME NOT NULL,
  summary TEXT,
  thumbnail_url TEXT,
  ai_selected BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (source_id) REFERENCES sources (id)
);

CREATE TABLE IF NOT EXISTS trend_item_tags (
  trend_item_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  PRIMARY KEY (trend_item_id, category_id),
  FOREIGN KEY (trend_item_id) REFERENCES trend_items (id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_trend_items_published_at ON trend_items(published_at);

CREATE TABLE IF NOT EXISTS newsletters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  issue_date DATE NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('draft', 'sending', 'sent')),
  subject TEXT,
  introduction_html TEXT,
  conclusion_html TEXT,
  template_id TEXT DEFAULT 'classic-list',
  confirmation_uuid TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  sent_at DATETIME
);

CREATE TABLE IF NOT EXISTS newsletter_items (
  newsletter_id INTEGER NOT NULL,
  trend_item_id INTEGER NOT NULL,
  display_order INTEGER NOT NULL,
  PRIMARY KEY (newsletter_id, trend_item_id),
  FOREIGN KEY (newsletter_id) REFERENCES newsletters (id),
  FOREIGN KEY (trend_item_id) REFERENCES trend_items (id)
);

CREATE TABLE IF NOT EXISTS ai_subject_presets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  prompt_template TEXT NOT NULL,
  is_default BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uuid TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  is_subscribed BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscriber_categories (
  subscriber_id INTEGER NOT NULL,
  preset_id INTEGER NOT NULL,
  PRIMARY KEY (subscriber_id, preset_id),
  FOREIGN KEY (subscriber_id) REFERENCES subscribers(id) ON DELETE CASCADE,
  FOREIGN KEY (preset_id) REFERENCES ai_subject_presets(id) ON DELETE CASCADE
);

-- Seed initial AI subject presets
INSERT OR IGNORE INTO ai_subject_presets (name, prompt_template, is_default) VALUES 
('Standard Trend Summary', 'Summarize the following trends for a general tech audience: {{items}}', 1),
('SW Developer Focus', 'Highlight technical details and architectural implications for developers: {{items}}', 0),
('Business Leader Insights', 'Focus on market impact and strategic importance for executives: {{items}}', 0);