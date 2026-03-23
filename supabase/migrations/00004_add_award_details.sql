-- Add detail columns to award_categories for the awards page
ALTER TABLE award_categories
  ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS unit_type TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS prize_value INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS prize_sub_label TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS prize_value_team INTEGER,
  ADD COLUMN IF NOT EXISTS prize_sub_label_team TEXT;
