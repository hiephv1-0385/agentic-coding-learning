-- User badges table (badges collected from opening secret boxes)
-- Migration: 00005_create_user_badges

CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL CHECK (badge_type IN (
    'REVIVAL',
    'TOUCH_OF_LIGHT',
    'STAY_GOLD',
    'FLOW_TO_HORIZON',
    'BEYOND_THE_BOUNDARY',
    'ROOT_FURTHER'
  )),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for querying user's badges
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);

-- RLS
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Users can read their own badges
CREATE POLICY "Users can read own badges" ON user_badges
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Insert is done via API route (service role), but allow authenticated insert for own badges
CREATE POLICY "Users can insert own badges" ON user_badges
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
