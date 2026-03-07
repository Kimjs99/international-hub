# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

국제교류 연구학교 허브 사이트 React 앱 — 한·일 국제교류 참여 학교 간 학술·문화 교류를 위한 공동 플랫폼.

**상위 프로토타입**: `../index.html` (단일 파일 HTML 프로토타입, 디자인 레퍼런스로 사용)

## Commands

```bash
bun run dev      # Vite 개발 서버 (http://localhost:5173)
bun run build    # 프로덕션 빌드
bun run lint     # ESLint 실행
bun run preview  # 빌드 미리보기
```

## Tech Stack

- React 19 + Vite 7
- TailwindCSS v3 (커스텀 컬러 토큰 포함)
- React Router v7 (`react-router-dom`)
- TanStack Query v5 (`@tanstack/react-query`)
- i18next + react-i18next + i18next-browser-languagedetector + i18next-http-backend
- Supabase JS Client (`@supabase/supabase-js`)
- lucide-react (아이콘), clsx (조건부 클래스), date-fns (날짜 유틸)

## Architecture

### Routing (`src/App.jsx`)

모든 라우트는 `PageLayout` (Outlet 포함) 아래 중첩됨. Admin만 별도:

```
/ → Home
/schools → SchoolList
/schools/:id → SchoolDetail
/academic/schedule → Schedule
/academic/materials → Materials
/culture/programs → Programs
/culture/archive → Archive
/activities/clubs → Clubs
/activities/events → Events
/gallery → GalleryMain
/gallery/:albumId → AlbumDetail
/notices → NoticeList
/notices/:id → NoticeDetail
/admin/* → AdminDashboard (PageLayout 밖)
```

### Entry Point (`src/main.jsx`)

`QueryClientProvider` → `App` 순서로 감싸짐.

### Key Files

- `src/lib/supabase.js` — Supabase 클라이언트 (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 환경변수 필요)
- `src/lib/queryClient.js` — TanStack Query 클라이언트 (staleTime: 5분, retry: 1)
- `src/components/Layout/PageLayout.jsx` — 공통 레이아웃 (Navbar, Footer 추가 예정)
- `src/styles/index.css` — Tailwind 디렉티브 + Google Fonts (Noto Sans KR/JP) import

### Design Tokens (`tailwind.config.js`)

```js
colors: {
  primary: { 50, 100, 500, 700, 900 }  // blue scale
  sakura: '#F9A8D4'                     // 일본 테마
  'accent-red': '#EF4444'              // 한국 테마
}
fontFamily: {
  ko: ['Noto Sans KR'],
  ja: ['Noto Sans JP'],
}
```

### i18n

번역 JSON은 `src/locales/ko/`, `src/locales/ja/` 아래 네임스페이스별로 분리 예정:
`common`, `schools`, `academic`, `culture`, `activities`, `gallery`, `notices`, `admin`

### Environment Variables

```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Current Status

WF-01 완료: 프로젝트 스캐폴딩, 패키지 설치, 라우트 구조, 플레이스홀더 페이지 모두 생성됨.
모든 페이지 컴포넌트는 현재 "준비 중" 플레이스홀더 상태.

다음 단계: WF-02 (Supabase DB 스키마 및 인증 설정)
