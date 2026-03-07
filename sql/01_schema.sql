-- WF-02 · 1단계: 전체 테이블 생성
-- Supabase SQL Editor에서 실행

-- ① schools (학교)
CREATE TABLE schools (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ko       TEXT NOT NULL,
  name_ja       TEXT NOT NULL,
  country       TEXT NOT NULL CHECK (country IN ('KR', 'JP')),
  city          TEXT,
  description_ko TEXT,
  description_ja TEXT,
  logo_url      TEXT,
  banner_url    TEXT,
  contact_email TEXT,
  contact_name  TEXT,
  website_url   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ② events (행사/일정)
CREATE TABLE events (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ko       TEXT NOT NULL,
  title_ja       TEXT NOT NULL,
  description_ko TEXT,
  description_ja TEXT,
  category       TEXT CHECK (category IN ('academic','culture','activity','general')),
  start_date     DATE NOT NULL,
  end_date       DATE,
  location_ko    TEXT,
  location_ja    TEXT,
  is_online      BOOLEAN DEFAULT FALSE,
  online_url     TEXT,
  school_id      UUID REFERENCES schools(id) ON DELETE SET NULL,
  created_by     UUID REFERENCES auth.users(id),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ③ materials (자료실)
CREATE TABLE materials (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ko       TEXT NOT NULL,
  title_ja       TEXT NOT NULL,
  description_ko TEXT,
  description_ja TEXT,
  file_url       TEXT NOT NULL,
  file_type      TEXT CHECK (file_type IN ('pdf','pptx','docx','image','other')),
  file_size      BIGINT,
  category       TEXT CHECK (category IN ('academic','culture','activity','general')),
  school_id      UUID REFERENCES schools(id) ON DELETE SET NULL,
  event_id       UUID REFERENCES events(id) ON DELETE SET NULL,
  download_count INT DEFAULT 0,
  is_public      BOOLEAN DEFAULT TRUE,
  created_by     UUID REFERENCES auth.users(id),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ④ gallery_albums (사진첩 앨범)
CREATE TABLE gallery_albums (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ko        TEXT NOT NULL,
  title_ja        TEXT NOT NULL,
  description_ko  TEXT,
  description_ja  TEXT,
  cover_photo_url TEXT,
  school_id       UUID REFERENCES schools(id) ON DELETE SET NULL,
  event_id        UUID REFERENCES events(id) ON DELETE SET NULL,
  taken_date      DATE,
  is_public       BOOLEAN DEFAULT TRUE,
  created_by      UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ⑤ gallery_photos (사진)
CREATE TABLE gallery_photos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id    UUID REFERENCES gallery_albums(id) ON DELETE CASCADE,
  photo_url   TEXT NOT NULL,
  caption_ko  TEXT,
  caption_ja  TEXT,
  order_index INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ⑥ notices (공지사항)
CREATE TABLE notices (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ko         TEXT NOT NULL,
  title_ja         TEXT NOT NULL,
  content_ko       TEXT,
  content_ja       TEXT,
  is_pinned        BOOLEAN DEFAULT FALSE,
  target_school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
  created_by       UUID REFERENCES auth.users(id),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ⑦ club_groups (동아리)
CREATE TABLE club_groups (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ko        TEXT NOT NULL,
  name_ja        TEXT NOT NULL,
  description_ko TEXT,
  description_ja TEXT,
  category       TEXT,
  school_id      UUID REFERENCES schools(id) ON DELETE SET NULL,
  cover_url      TEXT,
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ⑧ user_school_roles (사용자-학교 역할)
CREATE TABLE user_school_roles (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id  UUID REFERENCES schools(id) ON DELETE CASCADE,
  role       TEXT CHECK (role IN ('admin','manager','member')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, school_id)
);
