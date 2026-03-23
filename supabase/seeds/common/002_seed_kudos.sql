-- Seed data for Kudos Live Board development
-- Depends on auth.users existing (from Supabase Auth)

-- Departments from design spec
INSERT INTO departments (id, name) VALUES
  ('d0000001-0000-0000-0000-000000000001', 'CTO'),
  ('d0000001-0000-0000-0000-000000000002', 'SPD'),
  ('d0000001-0000-0000-0000-000000000003', 'FCOV'),
  ('d0000001-0000-0000-0000-000000000004', 'CEVC1'),
  ('d0000001-0000-0000-0000-000000000005', 'CEVC2'),
  ('d0000001-0000-0000-0000-000000000006', 'CEVC3'),
  ('d0000001-0000-0000-0000-000000000007', 'CEVC4'),
  ('d0000001-0000-0000-0000-000000000008', 'CEVEC'),
  ('d0000001-0000-0000-0000-000000000009', 'STVC'),
  ('d0000001-0000-0000-0000-000000000010', 'OPDC - HRF'),
  ('d0000001-0000-0000-0000-000000000011', 'OPDC - HRD - C&C'),
  ('d0000001-0000-0000-0000-000000000012', 'OPDC - HRF - C&B'),
  ('d0000001-0000-0000-0000-000000000013', 'OPDC - HRF - OD'),
  ('d0000001-0000-0000-0000-000000000014', 'OPDC - HRF - TA'),
  ('d0000001-0000-0000-0000-000000000015', 'OPDC - HRD - L&D'),
  ('d0000001-0000-0000-0000-000000000016', 'OPDC - HRD - TI'),
  ('d0000001-0000-0000-0000-000000000017', 'OPDC - HRD - HRBP'),
  ('d0000001-0000-0000-0000-000000000018', 'OPDC - HRD'),
  ('d0000001-0000-0000-0000-000000000019', 'FCOV - LRM'),
  ('d0000001-0000-0000-0000-000000000020', 'FCOV - F&A'),
  ('d0000001-0000-0000-0000-000000000021', 'FCOV - GA'),
  ('d0000001-0000-0000-0000-000000000022', 'FCOV - ISO'),
  ('d0000001-0000-0000-0000-000000000023', 'STVC - R&D'),
  ('d0000001-0000-0000-0000-000000000024', 'STVC - EE'),
  ('d0000001-0000-0000-0000-000000000025', 'STVC - R&D - DTR'),
  ('d0000001-0000-0000-0000-000000000026', 'STVC - R&D - DPS'),
  ('d0000001-0000-0000-0000-000000000027', 'STVC - R&D - AIR'),
  ('d0000001-0000-0000-0000-000000000028', 'STVC - R&D - SDX'),
  ('d0000001-0000-0000-0000-000000000029', 'STVC - Infra'),
  ('d0000001-0000-0000-0000-000000000030', 'CEVC1 - DSV'),
  ('d0000001-0000-0000-0000-000000000031', 'CEVC1 - DSV - UI/UX 1'),
  ('d0000001-0000-0000-0000-000000000032', 'CEVC1 - DSV - UI/UX 2'),
  ('d0000001-0000-0000-0000-000000000033', 'CEVC1 - AIE'),
  ('d0000001-0000-0000-0000-000000000034', 'CEVC2 - CySS'),
  ('d0000001-0000-0000-0000-000000000035', 'CEVC2 - System'),
  ('d0000001-0000-0000-0000-000000000036', 'CEVEC - SAPD'),
  ('d0000001-0000-0000-0000-000000000037', 'CEVEC - GSD'),
  ('d0000001-0000-0000-0000-000000000038', 'GEU'),
  ('d0000001-0000-0000-0000-000000000039', 'GEU - HUST'),
  ('d0000001-0000-0000-0000-000000000040', 'GEU - TM'),
  ('d0000001-0000-0000-0000-000000000041', 'GEU - DUT'),
  ('d0000001-0000-0000-0000-000000000042', 'GEU - UET'),
  ('d0000001-0000-0000-0000-000000000043', 'GEU - UIT'),
  ('d0000001-0000-0000-0000-000000000044', 'PAO'),
  ('d0000001-0000-0000-0000-000000000045', 'PAO - PEC'),
  ('d0000001-0000-0000-0000-000000000046', 'PAO - PAO'),
  ('d0000001-0000-0000-0000-000000000047', 'IAV'),
  ('d0000001-0000-0000-0000-000000000048', 'CPV'),
  ('d0000001-0000-0000-0000-000000000049', 'CPV - CGP'),
  ('d0000001-0000-0000-0000-000000000050', 'BDV')
ON CONFLICT (name) DO NOTHING;

-- Sample hashtags (fixed: use valid hex UUID prefix)
INSERT INTO hashtags (id, name) VALUES
  ('b0000001-0000-0000-0000-000000000001', '#teamwork'),
  ('b0000001-0000-0000-0000-000000000002', '#innovation'),
  ('b0000001-0000-0000-0000-000000000003', '#leadership'),
  ('b0000001-0000-0000-0000-000000000004', '#dedication'),
  ('b0000001-0000-0000-0000-000000000005', '#creativity'),
  ('b0000001-0000-0000-0000-000000000006', '#mentorship'),
  ('b0000001-0000-0000-0000-000000000007', '#quality'),
  ('b0000001-0000-0000-0000-000000000008', '#growth')
ON CONFLICT (name) DO NOTHING;

-- Create auth.users entries for dev seed profiles
-- These are placeholder dev users; real users will be created via Google OAuth
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token)
VALUES
  ('a0000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'nguyenvana@sun-asterisk.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Nguyen Van A"}', now(), now(), ''),
  ('a0000001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'tranthib@sun-asterisk.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Tran Thi B"}', now(), now(), ''),
  ('a0000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'levanc@sun-asterisk.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Le Van C"}', now(), now(), ''),
  ('a0000001-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'phamthid@sun-asterisk.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Pham Thi D"}', now(), now(), ''),
  ('a0000001-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'hoangvane@sun-asterisk.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Hoang Van E"}', now(), now(), '')
ON CONFLICT (id) DO NOTHING;

-- Sample profiles
INSERT INTO profiles (id, display_name, email, department, avatar_url, kudos_received_count, kudos_sent_count, hearts_received) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'Nguyen Van A', 'nguyenvana@sun-asterisk.com', 'CEVC1', NULL, 15, 8, 42),
  ('a0000001-0000-0000-0000-000000000002', 'Tran Thi B', 'tranthib@sun-asterisk.com', 'CEVC2', NULL, 23, 12, 67),
  ('a0000001-0000-0000-0000-000000000003', 'Le Van C', 'levanc@sun-asterisk.com', 'STVC', NULL, 8, 5, 19),
  ('a0000001-0000-0000-0000-000000000004', 'Pham Thi D', 'phamthid@sun-asterisk.com', 'FCOV', NULL, 52, 20, 130),
  ('a0000001-0000-0000-0000-000000000005', 'Hoang Van E', 'hoangvane@sun-asterisk.com', 'CEVC1', NULL, 11, 7, 28)
ON CONFLICT (id) DO NOTHING;

-- Sample kudos (fixed: use valid hex UUID prefix)
INSERT INTO kudos (id, sender_id, receiver_id, content, hashtags, images, video_url, category, heart_count, created_at) VALUES
  ('c0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000002',
   'Cảm ơn bạn đã hỗ trợ mình hoàn thành dự án đúng hạn. Bạn là người đồng đội tuyệt vời!',
   ARRAY['#teamwork', '#dedication'], ARRAY[]::TEXT[], NULL, 'IDOL GIOI TRE', 25, now() - interval '2 hours'),

  ('c0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000003',
   'Xin gửi lời cảm ơn đến anh vì đã hướng dẫn mình rất nhiều trong thời gian qua. Anh là người mentor tuyệt vời nhất!',
   ARRAY['#mentorship', '#growth'], ARRAY[]::TEXT[], NULL, NULL, 18, now() - interval '5 hours'),

  ('c0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000004',
   'Chị đã làm rất tốt trong việc triển khai chiến dịch marketing mới. Kết quả vượt xa kỳ vọng!',
   ARRAY['#leadership', '#innovation'], ARRAY[]::TEXT[], NULL, NULL, 32, now() - interval '1 day'),

  ('c0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000005',
   'Cảm ơn anh đã fix bug critical vào cuối tuần. Tinh thần trách nhiệm của anh thật đáng ngợi!',
   ARRAY['#dedication', '#quality'], ARRAY[]::TEXT[], NULL, NULL, 45, now() - interval '2 days'),

  ('c0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000001',
   'Bạn đã có những ý tưởng sáng tạo tuyệt vời cho sản phẩm mới. Rất mong chờ được làm việc cùng bạn nhiều hơn!',
   ARRAY['#creativity', '#innovation'], ARRAY[]::TEXT[], NULL, NULL, 12, now() - interval '3 days')
ON CONFLICT (id) DO NOTHING;

-- Sample secret boxes
INSERT INTO secret_boxes (user_id, total_count, opened_count) VALUES
  ('a0000001-0000-0000-0000-000000000001', 5, 2),
  ('a0000001-0000-0000-0000-000000000002', 3, 1),
  ('a0000001-0000-0000-0000-000000000003', 2, 0),
  ('a0000001-0000-0000-0000-000000000004', 8, 5),
  ('a0000001-0000-0000-0000-000000000005', 1, 0)
ON CONFLICT (user_id) DO NOTHING;

-- Sample gift recipients
INSERT INTO gift_recipients (user_id, gift_description, awarded_at) VALUES
  ('a0000001-0000-0000-0000-000000000004', 'Nhận được 1 áo phông SAA', now() - interval '1 day'),
  ('a0000001-0000-0000-0000-000000000002', 'Nhận được 1 voucher cafe', now() - interval '2 days'),
  ('a0000001-0000-0000-0000-000000000001', 'Nhận được 1 sticker set', now() - interval '3 days')
ON CONFLICT DO NOTHING;

-- Sample special day (today for testing)
INSERT INTO special_days (date, multiplier) VALUES
  (CURRENT_DATE, 2)
ON CONFLICT (date) DO NOTHING;
