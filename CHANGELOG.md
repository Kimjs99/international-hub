# Changelog

All notable changes to this project will be documented in this file.

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
