-- Kudos Live Board database schema
-- Migration: 00002_create_kudos_tables

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  email TEXT,
  department TEXT,
  avatar_url TEXT,
  kudos_received_count INTEGER NOT NULL DEFAULT 0,
  kudos_sent_count INTEGER NOT NULL DEFAULT 0,
  hearts_received INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Hashtags table
CREATE TABLE IF NOT EXISTS hashtags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Kudos table
CREATE TABLE IF NOT EXISTS kudos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  hashtags TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  category TEXT,
  heart_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Kudos likes table
CREATE TABLE IF NOT EXISTS kudos_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kudos_id UUID NOT NULL REFERENCES kudos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_special_day BOOLEAN NOT NULL DEFAULT false,
  hearts_awarded INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(kudos_id, user_id)
);

-- Secret boxes table
CREATE TABLE IF NOT EXISTS secret_boxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  total_count INTEGER NOT NULL DEFAULT 0,
  opened_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Gift recipients table (for leaderboard)
CREATE TABLE IF NOT EXISTS gift_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  gift_description TEXT NOT NULL,
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Special days table (for heart multiplier)
CREATE TABLE IF NOT EXISTS special_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  multiplier INTEGER NOT NULL DEFAULT 2,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_kudos_created_at ON kudos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_kudos_heart_count ON kudos(heart_count DESC);
CREATE INDEX IF NOT EXISTS idx_kudos_sender ON kudos(sender_id);
CREATE INDEX IF NOT EXISTS idx_kudos_receiver ON kudos(receiver_id);
CREATE INDEX IF NOT EXISTS idx_kudos_likes_kudos_user ON kudos_likes(kudos_id, user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON profiles(display_name);
CREATE INDEX IF NOT EXISTS idx_gift_recipients_awarded ON gift_recipients(awarded_at DESC);

-- RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kudos ENABLE ROW LEVEL SECURITY;
ALTER TABLE kudos_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE secret_boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_days ENABLE ROW LEVEL SECURITY;

-- Read policies (authenticated users can read all)
CREATE POLICY "Authenticated users can read profiles" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read kudos" ON kudos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read kudos_likes" ON kudos_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read own secret_boxes" ON secret_boxes FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Authenticated users can read gift_recipients" ON gift_recipients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read hashtags" ON hashtags FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read departments" ON departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read special_days" ON special_days FOR SELECT TO authenticated USING (true);

-- Write policies
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "Users can update own secret_boxes" ON secret_boxes FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Kudos likes: users can like/unlike but not their own kudos
CREATE POLICY "Users can insert likes" ON kudos_likes FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND kudos_id IN (SELECT id FROM kudos WHERE sender_id != auth.uid())
  );
CREATE POLICY "Users can delete own likes" ON kudos_likes FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- toggle_like RPC function (atomic like/unlike)
CREATE OR REPLACE FUNCTION toggle_like(p_kudos_id UUID, p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_existing_like kudos_likes%ROWTYPE;
  v_kudos kudos%ROWTYPE;
  v_multiplier INTEGER := 1;
  v_hearts INTEGER;
  v_result JSON;
BEGIN
  -- Get the kudos record
  SELECT * INTO v_kudos FROM kudos WHERE id = p_kudos_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Kudos not found';
  END IF;

  -- Sender cannot like own kudos
  IF v_kudos.sender_id = p_user_id THEN
    RAISE EXCEPTION 'Cannot like own kudos';
  END IF;

  -- Check for special day
  SELECT multiplier INTO v_multiplier
  FROM special_days
  WHERE date = CURRENT_DATE;
  IF NOT FOUND THEN
    v_multiplier := 1;
  END IF;

  -- Check if already liked
  SELECT * INTO v_existing_like
  FROM kudos_likes
  WHERE kudos_id = p_kudos_id AND user_id = p_user_id;

  IF FOUND THEN
    -- Unlike: remove like and deduct hearts
    v_hearts := v_existing_like.hearts_awarded;

    DELETE FROM kudos_likes WHERE id = v_existing_like.id;

    UPDATE kudos SET heart_count = GREATEST(heart_count - 1, 0)
    WHERE id = p_kudos_id;

    UPDATE profiles SET hearts_received = GREATEST(hearts_received - v_hearts, 0)
    WHERE id = v_kudos.sender_id;

    SELECT json_build_object(
      'action', 'unliked',
      'heart_count', (SELECT heart_count FROM kudos WHERE id = p_kudos_id),
      'hearts_awarded', v_hearts
    ) INTO v_result;
  ELSE
    -- Like: add like and award hearts
    v_hearts := v_multiplier;

    INSERT INTO kudos_likes (kudos_id, user_id, is_special_day, hearts_awarded)
    VALUES (p_kudos_id, p_user_id, v_multiplier > 1, v_hearts);

    UPDATE kudos SET heart_count = heart_count + 1
    WHERE id = p_kudos_id;

    UPDATE profiles SET hearts_received = hearts_received + v_hearts
    WHERE id = v_kudos.sender_id;

    SELECT json_build_object(
      'action', 'liked',
      'heart_count', (SELECT heart_count FROM kudos WHERE id = p_kudos_id),
      'hearts_awarded', v_hearts
    ) INTO v_result;
  END IF;

  RETURN v_result;
END;
$$;
