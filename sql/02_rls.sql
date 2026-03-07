-- WF-02 · 2단계: Row Level Security (RLS) 설정
-- Supabase SQL Editor에서 실행 (01_schema.sql 이후)

-- 모든 테이블 RLS 활성화
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_school_roles ENABLE ROW LEVEL SECURITY;

-- 공개 데이터 열람 (비로그인도 가능)
CREATE POLICY "schools_public_select" ON schools FOR SELECT USING (true);
CREATE POLICY "events_public_select" ON events FOR SELECT USING (true);
CREATE POLICY "materials_public_select" ON materials FOR SELECT USING (is_public = true);
CREATE POLICY "gallery_albums_public_select" ON gallery_albums FOR SELECT USING (is_public = true);
CREATE POLICY "gallery_photos_public_select" ON gallery_photos FOR SELECT USING (true);
CREATE POLICY "notices_public_select" ON notices FOR SELECT USING (true);
CREATE POLICY "club_groups_public_select" ON club_groups FOR SELECT USING (is_active = true);

-- 인증된 사용자만 자료 등록
CREATE POLICY "materials_auth_insert" ON materials
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- 자료 수정/삭제: 등록자 또는 학교 관리자
CREATE POLICY "materials_owner_update" ON materials
  FOR UPDATE USING (
    auth.uid() = created_by
    OR EXISTS (
      SELECT 1 FROM user_school_roles
      WHERE user_id = auth.uid()
        AND school_id = materials.school_id
        AND role IN ('admin','manager')
    )
  );

-- 공지사항 등록: 인증된 사용자
CREATE POLICY "notices_auth_insert" ON notices
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- user_school_roles: 본인 역할만 열람
CREATE POLICY "user_roles_select" ON user_school_roles
  FOR SELECT USING (auth.uid() = user_id);
