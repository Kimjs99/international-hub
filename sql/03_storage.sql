-- WF-02 · 3단계: Storage 버킷 생성 및 RLS 정책
-- Supabase SQL Editor에서 실행
-- (또는 Dashboard > Storage에서 직접 생성 가능)

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('gallery', 'gallery', true),
  ('materials', 'materials', true),
  ('schools', 'schools', true);

-- Storage RLS 정책: 공개 읽기
CREATE POLICY "gallery_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "materials_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'materials');

CREATE POLICY "schools_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'schools');

-- Storage 업로드: 인증된 사용자만
CREATE POLICY "authenticated_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('gallery', 'materials', 'schools'));
