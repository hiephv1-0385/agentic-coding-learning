-- Seed SAA 2025 event
INSERT INTO events (name, theme, date_time, venue, livestream_info, hero_banner_url)
VALUES (
  'Sun* Annual Awards 2025',
  'ROOT FURTHER',
  '2026-03-31T18:30:00+07:00',
  'Nhà hát Âu Cơ - Âu Cơ Art Center',
  'Tường thuật trực tiếp qua sóng Livestream',
  '/images/hero-banner.png'
) ON CONFLICT DO NOTHING;

-- Seed 6 award categories
INSERT INTO award_categories (name, slug, short_description, description, thumbnail_url, "order", quantity, unit_type, prize_value, prize_sub_label, prize_value_team, prize_sub_label_team)
VALUES
  (
    'Top Talent',
    'top-talent',
    'Giải thưởng vinh danh 10 cá nhân xuất sắc nhất, những người đã có đóng góp nổi bật trong năm.',
    'Giải thưởng Top Talent vinh danh những cá nhân xuất sắc toàn diện – những người không ngừng khẳng định năng lực chuyên môn vững vàng, hiệu suất công việc vượt trội, luôn mang lại giá trị vượt kỳ vọng, được đánh giá cao bởi khách hàng và đồng đội. Với tinh thần sẵn sàng nhận mọi nhiệm vụ tổ chức giao phó, họ luôn là nguồn cảm hứng, thúc đẩy động lực và tạo ảnh hưởng tích cực đến cả tập thể.',
    '/images/awards/top-talent.png',
    1, 10, 'Cá nhân', 7000000, 'cho mỗi giải thưởng', NULL, NULL
  ),
  (
    'Top Project',
    'top-project',
    'Giải thưởng dành cho 02 dự án xuất sắc nhất, ghi nhận thành tích vượt trội của tập thể.',
    'Giải thưởng Top Project tôn vinh những dự án xuất sắc nhất – nơi sự phối hợp nhịp nhàng, năng lực chuyên môn và cam kết chất lượng đã tạo nên những thành quả vượt trội. Đây là những dự án mang lại giá trị thiết thực cho khách hàng, đóng góp tích cực vào sự phát triển chung của tổ chức và trở thành hình mẫu về tinh thần làm việc nhóm hiệu quả tại Sun*.',
    '/images/awards/top-project.png',
    2, 2, 'Tập thể', 15000000, 'cho mỗi giải thưởng', NULL, NULL
  ),
  (
    'Top Project Leader',
    'top-project-leader',
    'Vinh danh 03 trưởng dự án xuất sắc nhất với khả năng lãnh đạo và quản lý vượt trội.',
    'Giải thưởng Top Project Leader vinh danh những trưởng dự án xuất sắc – những người thể hiện khả năng lãnh đạo vượt trội trong việc dẫn dắt đội ngũ, quản lý tiến độ và đảm bảo chất lượng dự án. Họ không chỉ đạt được kết quả kinh doanh ấn tượng mà còn xây dựng được môi trường làm việc tích cực, phát triển năng lực cho thành viên và tạo dựng niềm tin vững chắc với khách hàng.',
    '/images/awards/top-project-leader.png',
    3, 3, 'Cá nhân', 7000000, 'cho mỗi giải thưởng', NULL, NULL
  ),
  (
    'Best Manager',
    'best-manager',
    'Giải thưởng cao quý dành cho 01 quản lý xuất sắc nhất với tầm nhìn và chiến lược vượt trội.',
    'Giải thưởng Best Manager tôn vinh nhà quản lý xuất sắc nhất – người có tầm nhìn chiến lược sâu rộng, khả năng truyền cảm hứng và dẫn dắt đội ngũ đạt được những mục tiêu đầy thách thức. Với phong cách quản lý hiệu quả và tâm huyết với sự phát triển của từng thành viên, họ đã góp phần quan trọng vào thành công chung của tổ chức.',
    '/images/awards/best-manager.png',
    4, 1, 'Cá nhân', 10000000, 'cho mỗi giải thưởng', NULL, NULL
  ),
  (
    'Signature 2025 - Creator',
    'signature-2025-creator',
    'Giải thưởng đặc biệt cho cá nhân hoặc tập thể sáng tạo đột phá trong năm 2025.',
    'Giải thưởng Signature vinh danh cá nhân hoặc tập thể thể hiện tinh thần đặc trưng mà Sun* hướng tới trong từng thời kỳ. Trong năm 2025, giải thưởng Signature vinh danh Creator - cá nhân/tập thể mang tư duy chủ động và nhạy bén, luôn nhìn thấy cơ hội trong thách thức và tiên phong trong hành động. Họ là những người nhạy bén với vấn đề, nhanh chóng nhận diện và đưa ra những giải pháp thực tiễn, mang lại giá trị rõ rệt cho dự án, khách hàng hoặc tổ chức. Với tư duy kiến tạo và tinh thần "Creator" đặc trưng của Sun*, họ không chỉ phản ứng tích cực trước sự thay đổi mà còn chủ động tạo ra cải tiến, góp phần định hình chuẩn mực mới cho cách mà người Sun* tạo giá trị.',
    '/images/awards/signature-2025-creator.png',
    5, 1, 'Cá nhân hoặc tập thể', 5000000, 'cho giải cá nhân', 8000000, 'cho giải tập thể'
  ),
  (
    'MVP (Most Valuable Person)',
    'mvp',
    'Giải thưởng danh giá nhất dành cho 01 cá nhân có giá trị đóng góp lớn nhất.',
    'Giải thưởng MVP (Most Valuable Person) là giải thưởng danh giá nhất của SAA 2025, vinh danh cá nhân có đóng góp giá trị lớn nhất cho tổ chức trong năm. Người nhận giải MVP không chỉ xuất sắc về chuyên môn mà còn thể hiện tầm ảnh hưởng sâu rộng, truyền cảm hứng cho đồng nghiệp và đóng vai trò then chốt trong những thành tựu quan trọng của Sun*.',
    '/images/awards/mvp.png',
    6, 1, 'Cá nhân', 15000000, '', NULL, NULL
  )
ON CONFLICT (slug) DO UPDATE SET
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  thumbnail_url = EXCLUDED.thumbnail_url,
  "order" = EXCLUDED."order",
  quantity = EXCLUDED.quantity,
  unit_type = EXCLUDED.unit_type,
  prize_value = EXCLUDED.prize_value,
  prize_sub_label = EXCLUDED.prize_sub_label,
  prize_value_team = EXCLUDED.prize_value_team,
  prize_sub_label_team = EXCLUDED.prize_sub_label_team;
