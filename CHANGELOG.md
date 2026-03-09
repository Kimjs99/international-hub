# Changelog

All notable changes to this project will be documented in this file.

## [v0.3.1] - 2026-03-09

### 🐛 Bug Fixes
- 관리자 CRUD 전체: upsert/delete 후 Dashboard 통계 캐시 즉시 반영 (`stats` invalidation 추가) (c44ef91)
- EventCard, FileCard 카테고리 뱃지 영어 표시 → `t('category.xxx')` 번역 처리 (c44ef91)

### 📝 Documentation
- CLAUDE.md: 3언어 지원, RLS 정책 현황 표, Admin mutation 패턴 명시 (c44ef91)

## [v0.3.0] - 2026-03-09

### ✨ Features
- 영어(EN) 지원 추가 및 관리자 다국어 입력 UX 개선 — 언어 탭(ko/ja/en) 모달 UI, 번역 JSON en 파일 추가 (b9bba2a)
- 전체 텍스트 i18n 전환 + 영어→일본어 버그 수정 — 하드코딩 한국어 텍스트 i18n 키로 교체 (fc4e0d7)
- 풋터 저작권 문구 업데이트 (2026-2027, 학교명, 비영리) (fb12de7)

### 🐛 Bug Fixes
- 관리자 폼 onError 핸들러 추가 — 저장 실패 시 에러 메시지 표시 (3e207f1)
- 전체 페이지 영어 미전환 버그 수정 (26ca509)
- vercel.json SPA 리라이트 규칙 — locales/assets 경로 제외하여 i18n 번역 파일 접근 허용 (4c119af)

### 📝 Documentation
- CLAUDE.md 개선 및 불필요 파일 정리 (public/ 빈 폴더 제거) (6964862)

## [v0.2.0] - 2026-03-08

### ✨ Features
- WF-13 반응형 최적화 및 접근성 / SEO — LightboxViewer 터치 스와이프, Modal a11y(role/aria), react-helmet-async, React.lazy + Suspense 코드 스플리팅 (c757522)
- WF-12 관리자 기능 구현 — AdminLayout(인증 가드), AdminSidebar, Dashboard, SchoolManager, EventManager, MaterialManager, GalleryManager, NoticeManager, MemberManager, Login 페이지 (be45779)
- WF-08~11 문화교류·동아리·행사·사진첩·공지사항 구현 — Programs, Archive, Clubs, Events, GalleryMain, AlbumDetail, NoticeList(Realtime), NoticeDetail (b8de7ed)
- WF-05~07 홈·학교소개·학술교류 구현 — HeroBanner(자동 캐러셀), AnnouncementBar, QuickMenu, UpcomingEvents, SchoolHighlight, SchoolList, SchoolDetail, Schedule(캘린더), Materials (4139583)

### 📝 Documentation
- CLAUDE.md WF-04 완료 기준으로 업데이트 (f030e50)

## [v0.1.0] - 2026-03-08

### ✨ Features
- WF-04 레이아웃 및 i18n 설정 — Navbar/Footer/PageLayout, 번역 파일 16개(ko·ja × 8 네임스페이스), LanguageContext, LanguageToggle (0393c55)
- WF-03 공통 UI 컴포넌트 11개 제작 — Badge, SchoolBadge, Spinner, EmptyState, Modal, Pagination, EventCard, FileCard, PhotoGrid, LightboxViewer, Calendar (a6e5054)
- WF-02 Supabase DB 스키마 및 인증 설정 — 테이블 8개, RLS 정책, Storage 버킷 3개, 더미 데이터, AuthContext, React Query 훅 3개 (a32d4d8)
- WF-01 프로젝트 초기 설정 — Vite + React 19, TailwindCSS v3, React Router v7, TanStack Query v5, Supabase 클라이언트, 플레이스홀더 페이지 14개 (d59cc3c)
