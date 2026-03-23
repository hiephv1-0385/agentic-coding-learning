-- Migration: 00003_add_kudos_modal_fields
-- Purpose: Add fields for Write Kudos Modal (Viet Kudo)
-- Adds: danh_hieu, is_anonymous, anonymous_name columns
-- Adds: INSERT RLS policy for kudos
-- Adds: create_kudos RPC function for atomic insert + counter updates
-- Adds: kudos-images storage bucket

-- Add new columns to kudos table
ALTER TABLE kudos ADD COLUMN IF NOT EXISTS danh_hieu TEXT NOT NULL DEFAULT '';
ALTER TABLE kudos ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE kudos ADD COLUMN IF NOT EXISTS anonymous_name TEXT;

-- RLS policy: Users can insert kudos (but not to themselves)
CREATE POLICY "Users can insert kudos"
  ON kudos
  FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid() AND sender_id != receiver_id);

-- Atomic RPC function: insert kudos + update sender/receiver counters
-- Similar pattern to existing toggle_like function
CREATE OR REPLACE FUNCTION create_kudos(
  p_receiver_id UUID,
  p_danh_hieu TEXT,
  p_content TEXT,
  p_hashtags TEXT[],
  p_images TEXT[],
  p_is_anonymous BOOLEAN DEFAULT false,
  p_anonymous_name TEXT DEFAULT NULL
)
RETURNS kudos
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_sender_id UUID;
  v_kudos kudos;
BEGIN
  -- Get the authenticated user
  v_sender_id := auth.uid();

  -- Validate: cannot send kudos to yourself
  IF v_sender_id = p_receiver_id THEN
    RAISE EXCEPTION 'Cannot send kudos to yourself';
  END IF;

  -- Insert the kudos record
  INSERT INTO kudos (
    sender_id,
    receiver_id,
    danh_hieu,
    content,
    hashtags,
    images,
    is_anonymous,
    anonymous_name,
    video_url,
    category,
    heart_count
  ) VALUES (
    v_sender_id,
    p_receiver_id,
    p_danh_hieu,
    p_content,
    p_hashtags,
    COALESCE(p_images, ARRAY[]::TEXT[]),
    p_is_anonymous,
    p_anonymous_name,
    NULL,
    NULL,
    0
  )
  RETURNING * INTO v_kudos;

  -- Increment sender's kudos_sent_count
  UPDATE profiles
  SET kudos_sent_count = kudos_sent_count + 1,
      updated_at = now()
  WHERE id = v_sender_id;

  -- Increment receiver's kudos_received_count
  UPDATE profiles
  SET kudos_received_count = kudos_received_count + 1,
      updated_at = now()
  WHERE id = p_receiver_id;

  RETURN v_kudos;
END;
$$;

-- Storage bucket for kudos image attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'kudos-images',
  'kudos-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for kudos-images bucket
CREATE POLICY "Authenticated users can upload kudos images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'kudos-images');

CREATE POLICY "Anyone can view kudos images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'kudos-images');
