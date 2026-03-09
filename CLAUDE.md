# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

국제교류 연구학교 허브 사이트 — 한·일 국제교류 참여 학교 간 학술·문화 교류를 위한 공동 플랫폼.
디자인 레퍼런스: `../index.html` (단일 파일 HTML 프로토타입)

## Commands

```bash
# 개발 서버 — bun run dev는 esbuild EPIPE 오류 발생. node로 직접 실행해야 함
node node_modules/.bin/vite          # 개발 서버 (http://localhost:5173)
bun run build                        # 프로덕션 빌드
bun run lint                         # ESLint 실행
bun run preview                      # 빌드 미리보기
```

## Tech Stack

- React 19 + Vite 7, TailwindCSS v3
- React Router v7 (nested routes), TanStack Query v5 (staleTime: 5분, retry: 1)
- i18next + react-i18next + i18next-browser-languagedetector
- Supabase JS Client, react-helmet-async, lucide-react, clsx, date-fns

## Architecture

### Provider 계층 (`src/main.jsx`)

```
HelmetProvider → QueryClientProvider → AuthProvider → LanguageProvider → App
```

### Routing (`src/App.jsx`)

모든 페이지는 `React.lazy + Suspense`로 코드 스플리팅. 구조:
- `<PageLayout>` (Navbar + Footer) 아래 일반 페이지 중첩
- `/login` — PageLayout 밖 독립 라우트
- `/admin/*` — `<AdminLayout>` (인증 가드 + 사이드바) 아래 중첩

### Context

| Context | 파일 | 제공값 |
|---------|------|--------|
| AuthContext | `src/context/AuthContext.jsx` | `user`, `role`, `loading`, `signIn`, `signOut` |
| LanguageContext | `src/context/LanguageContext.jsx` | `lang`, `switchLanguage` |

- `role`은 현재 항상 `'guest'`로 고정 (미구현). 향후 `user_school_roles` 테이블과 연동 예정.
- `switchLanguage`는 i18n 언어 변경 + `localStorage('language')` + `html[lang]` 속성을 동시에 갱신.
- 폰트는 CSS에서 `html[lang='ja']`일 때 Noto Sans JP로 자동 전환.

### i18n (`src/lib/i18n.js`)

- **3개 언어 지원**: `ko` / `ja` / `en`
- 번역 파일은 **빌드 시 JS 번들에 정적으로 포함** (`src/locales/ko/`, `src/locales/ja/`, `src/locales/en/`). HTTP fetch 방식이 아님.
- 네임스페이스: `common`(기본), `home`, `schools`, `academic`, `culture`, `activities`, `gallery`, `notices`, `admin`
- 언어 감지 순서: `localStorage('language')` → fallback `ko`
- 컴포넌트에서 `useTranslation('namespace')` 또는 `useLanguage()` 사용
- Supabase DB 다국어 필드: `_ko`/`_ja`/`_en` suffix 패턴 (예: `title_ko`, `title_ja`, `title_en`)
- 새 번역 키 추가 시 `ko/`, `ja/`, `en/` 세 언어 JSON 파일 모두 수정 필요

### Data Fetching (`src/hooks/`)

TanStack Query 훅. 모두 `supabase` 클라이언트를 직접 호출:
- `useSchools()`, `useSchool(id)`
- `useEvents({ category, schoolId })`, `useEvent(id)`
- `useNotices({ schoolId })`, `useNotice(id)`
- `useMaterials({ category, schoolId, search })`
- `useClubs({ category, schoolId })`
- `useAlbums({ schoolId })`, `useAlbumPhotos(albumId)`

### UI Components (`src/components/UI/`)

`lang` prop(`'ko'|'ja'|'en'`)을 받는 컴포넌트: `EventCard`, `FileCard`, `PhotoGrid`, `LightboxViewer`, `Calendar`.
- `Calendar`: events 배열 → 월간 뷰 (카테고리 색상: academic=blue, culture=purple, activity=green, general=gray)
- `PhotoGrid`: 사진 그리드 + `LightboxViewer` 내장 (터치 스와이프, 키보드 내비게이션)
- `Modal`: `role="dialog"`, `aria-modal`, `aria-labelledby` 포함

### Admin (`/admin/*`)

`AdminLayout`이 인증 체크 (`user` 없으면 `/login` 리디렉션). 사이드바: `AdminSidebar`.
관리 페이지: Dashboard, SchoolManager, EventManager, MaterialManager, GalleryManager, NoticeManager, MemberManager — 모두 Supabase CRUD + Modal 폼.

**Admin mutation 패턴**: 모든 관리자 페이지의 upsert/delete `onSuccess`에서 `['admin', 'stats']` 쿼리도 함께 invalidate해야 Dashboard 통계가 실시간 반영됨.

```js
onSuccess: () => {
  qc.invalidateQueries({ queryKey: ['admin', 'xxx'] })
  qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
}
```

### Design Tokens (`tailwind.config.js`)

```js
colors: { primary: {50,100,500,700,900}, sakura: '#F9A8D4', 'accent-red': '#EF4444' }
fontFamily: { ko: ['Noto Sans KR'], ja: ['Noto Sans JP'] }
```

### Supabase DB 테이블

`schools`, `events`, `materials`, `gallery_albums`, `gallery_photos`, `notices`, `club_groups`, `user_school_roles`
SQL 마이그레이션: `sql/01_schema.sql` → `02_rls.sql` → `03_storage.sql` → `04_seed.sql` 순서로 실행.

### Supabase RLS 주의사항

`sql/02_rls.sql`에 정의된 쓰기 정책 현황:

| 테이블 | SELECT | INSERT | UPDATE | DELETE |
|--------|--------|--------|--------|--------|
| schools | ✅ public | ❌ 없음 | ❌ 없음 | ❌ 없음 |
| events | ✅ public | ❌ 없음 | ❌ 없음 | ❌ 없음 |
| gallery_albums | ✅ is_public | ❌ 없음 | ❌ 없음 | ❌ 없음 |
| gallery_photos | ✅ public | ❌ 없음 | ❌ 없음 | ❌ 없음 |
| club_groups | ✅ is_active | ❌ 없음 | ❌ 없음 | ❌ 없음 |
| materials | ✅ is_public | ✅ created_by 필요 | ✅ owner/manager | ❌ 없음 |
| notices | ✅ public | ✅ created_by 필요 | ❌ 없음 | ❌ 없음 |

**❌ 없음** 표시 테이블은 관리자 write 작업 시 RLS 오류 발생. Supabase SQL Editor에서 직접 정책을 추가해야 함:

```sql
-- schools, events, gallery_albums, gallery_photos, club_groups 공통 패턴
CREATE POLICY "xxx_auth_insert" ON xxx FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "xxx_auth_update" ON xxx FOR UPDATE TO authenticated USING (true);
CREATE POLICY "xxx_auth_delete" ON xxx FOR DELETE TO authenticated USING (true);
```

`materials`와 `notices` INSERT는 `created_by: user.id` 필드를 payload에 포함해야 정책 통과.

### Environment Variables

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Deployment (Vercel)

- 프로젝트: `jsmajs-9184s-projects/international-hub`
- Production URL: https://international-hub.vercel.app
- `vercel.json`에 SPA 리라이트 규칙 포함 (locales/assets 경로는 제외 — i18n 번들 접근용)
- 배포 명령: `vercel --prod` (international-hub 디렉토리에서 실행)
- 환경변수는 Vercel 대시보드 또는 `vercel env add`로 설정

## Current Status

WF-01~14 완료. 모든 페이지 구현, 최적화(코드 스플리팅, a11y, SEO), Vercel 배포 완료.
- 3개 언어(ko/ja/en) 지원 완료
- 미구현: `role` 기반 권한 제어 (현재 관리자 접근은 로그인 여부만 체크)
- 미구현: schools/events/gallery/clubs 테이블 write RLS 정책 (현재 Supabase에서 직접 추가 필요)
