# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

국제교류 연구학교 허브 사이트 — 한·일 국제교류 참여 학교 간 학술·문화 교류를 위한 공동 플랫폼.
디자인 레퍼런스: `../index.html` (단일 파일 HTML 프로토타입)

## Commands

```bash
bun run dev      # Vite 개발 서버 (http://localhost:5173)
bun run build    # 프로덕션 빌드
bun run lint     # ESLint 실행
bun run preview  # 빌드 미리보기
```

## Tech Stack

- React 19 + Vite 7, TailwindCSS v3
- React Router v7, TanStack Query v5
- i18next + react-i18next + i18next-browser-languagedetector
- Supabase JS Client, lucide-react, clsx, date-fns

## Architecture

### Provider 계층 (`src/main.jsx`)

```
QueryClientProvider → AuthProvider → LanguageProvider → App
```

### Routing (`src/App.jsx`)

모든 페이지는 `PageLayout`(Navbar + Footer) 아래 중첩. `/admin/*`만 별도.

### Context

| Context | 파일 | 제공값 |
|---------|------|--------|
| AuthContext | `src/context/AuthContext.jsx` | `user`, `role`, `loading`, `signIn`, `signOut` |
| LanguageContext | `src/context/LanguageContext.jsx` | `lang`, `switchLanguage` — `html[lang]` 및 localStorage `language` 키 동기화 |

### i18n (`src/lib/i18n.js`)

- 네임스페이스: `common`(기본), `home`, `schools`, `academic`, `culture`, `activities`, `gallery`, `notices`
- 번역 파일: `src/locales/ko/`, `src/locales/ja/`
- 언어 감지 순서: `localStorage('language')` → 브라우저
- 컴포넌트에서 `useTranslation()` 또는 `useLanguage()` 사용
- Supabase 다국어 필드는 `_ko`/`_ja` suffix 패턴 (예: `title_ko`, `title_ja`)

### Data Fetching (`src/hooks/`)

TanStack Query 훅. `useSchools`, `useSchool(id)`, `useEvents({ category, schoolId })`, `useEvent(id)`, `useNotices({ schoolId })`, `useNotice(id)` — 모두 `supabase` 클라이언트 직접 호출.

### UI Components (`src/components/UI/`)

재사용 컴포넌트. `lang` prop으로 `'ko'|'ja'`를 받는 것들: `EventCard`, `FileCard`, `PhotoGrid`, `LightboxViewer`, `Calendar`.
`Calendar`는 events 배열을 받아 월간 뷰 렌더링 (카테고리 색상: academic=blue, culture=purple, activity=green, general=gray).

### Design Tokens (`tailwind.config.js`)

```js
colors: { primary: {50,100,500,700,900}, sakura: '#F9A8D4', 'accent-red': '#EF4444' }
fontFamily: { ko: ['Noto Sans KR'], ja: ['Noto Sans JP'] }
```

### Supabase DB 테이블

`schools`, `events`, `materials`, `gallery_albums`, `gallery_photos`, `notices`, `club_groups`, `user_school_roles`
SQL 마이그레이션: `sql/01_schema.sql` → `02_rls.sql` → `03_storage.sql` → `04_seed.sql` 순서로 실행.

### Environment Variables

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Current Status

WF-01~04 완료. 모든 페이지 컴포넌트는 아직 플레이스홀더 상태.
다음 단계: WF-05~11 페이지 구현 (병렬 진행 가능) → WF-12~14 관리자·최적화·배포.
