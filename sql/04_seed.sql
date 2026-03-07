-- WF-02 · 4단계: 더미 데이터 입력
-- Supabase SQL Editor에서 실행 (01_schema.sql 이후)

-- 더미 학교 데이터
INSERT INTO schools (name_ko, name_ja, country, city, description_ko, description_ja) VALUES
  ('서울국제고등학교', '서울国際高等学校', 'KR', '서울', '서울 소재 국제교류 연구학교입니다.', 'ソウル所在の国際交流研究校です。'),
  ('부산외국어고등학교', '釜山外国語高等学校', 'KR', '부산', '부산 소재 외국어 특성화 학교입니다.', '釜山所在の外国語特化校です。'),
  ('東京国際高校', '東京国際高校', 'JP', '東京', '도쿄 소재 국제교류 연구학교입니다.', '東京所在の国際交流研究校です。'),
  ('大阪グローバル高校', '大阪グローバル高校', 'JP', '大阪', '오사카 소재 글로벌 특성화 학교입니다.', '大阪所在のグローバル特化校です。');

-- 더미 행사 데이터
INSERT INTO events (title_ko, title_ja, category, start_date, end_date, location_ko, location_ja) VALUES
  ('2026 한일 학술 심포지엄', '2026日韓学術シンポジウム', 'academic', '2026-05-15', '2026-05-16', '서울', 'ソウル'),
  ('문화교류 축제', '文化交流フェスティバル', 'culture', '2026-06-20', '2026-06-21', '도쿄', '東京'),
  ('동아리 교류 행사', 'クラブ交流行事', 'activity', '2026-07-10', NULL, '부산', '釜山'),
  ('온라인 학술 발표회', 'オンライン学術発表会', 'academic', '2026-04-25', '2026-04-25', '온라인', 'オンライン'),
  ('사진전 & 전시회', '写真展＆展示会', 'culture', '2026-08-01', '2026-08-07', '오사카', '大阪');

-- 더미 공지사항 데이터
INSERT INTO notices (title_ko, title_ja, content_ko, content_ja, is_pinned) VALUES
  ('2026년 상반기 교류 일정 안내', '2026年上半期交流スケジュールのご案内',
   '2026년 상반기 한일 교류 행사 일정을 안내드립니다.',
   '2026年上半期の日韓交流行事スケジュールをお知らせします。', true),
  ('신규 회원 학교 모집 공고', '新規会員校募集のお知らせ',
   '국제교류 연구학교 네트워크에 참여할 신규 회원 학교를 모집합니다.',
   '国際交流研究校ネットワークに参加する新規会員校を募集します。', true),
  ('플랫폼 사용 가이드 업데이트', 'プラットフォーム利用ガイド更新',
   '허브 플랫폼 사용 가이드가 업데이트되었습니다.',
   'ハブプラットフォームの利用ガイドが更新されました。', false);

-- 더미 자료 데이터 (file_url은 실제 Storage URL로 교체 필요)
INSERT INTO materials (title_ko, title_ja, file_url, file_type, category, is_public) VALUES
  ('2025 교류 보고서', '2025交流報告書', 'https://placeholder.example/report2025.pdf', 'pdf', 'academic', true),
  ('문화 소개 자료집', '文化紹介資料集', 'https://placeholder.example/culture.pptx', 'pptx', 'culture', true),
  ('동아리 활동 사진첩', 'クラブ活動写真集', 'https://placeholder.example/clubs.pdf', 'pdf', 'activity', true);
