-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  theme TEXT NOT NULL,
  date_time TIMESTAMPTZ NOT NULL,
  venue TEXT NOT NULL,
  livestream_info TEXT NOT NULL DEFAULT '',
  hero_banner_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create award_categories table
CREATE TABLE IF NOT EXISTS award_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL DEFAULT '',
  thumbnail_url TEXT NOT NULL DEFAULT '',
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE award_categories ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Allow public read access on events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on award_categories"
  ON award_categories FOR SELECT
  USING (true);

-- Index for ordering
CREATE INDEX idx_award_categories_order ON award_categories ("order");
