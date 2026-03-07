import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PageLayout from './components/Layout/PageLayout'
import AdminLayout from './components/Layout/AdminLayout'
import Spinner from './components/UI/Spinner'

const Home = lazy(() => import('./pages/Home/index'))
const SchoolList = lazy(() => import('./pages/Schools/SchoolList'))
const SchoolDetail = lazy(() => import('./pages/Schools/SchoolDetail'))
const Schedule = lazy(() => import('./pages/Academic/Schedule'))
const Materials = lazy(() => import('./pages/Academic/Materials'))
const Programs = lazy(() => import('./pages/Culture/Programs'))
const Archive = lazy(() => import('./pages/Culture/Archive'))
const Clubs = lazy(() => import('./pages/Activities/Clubs'))
const Events = lazy(() => import('./pages/Activities/Events'))
const GalleryMain = lazy(() => import('./pages/Gallery/GalleryMain'))
const AlbumDetail = lazy(() => import('./pages/Gallery/AlbumDetail'))
const NoticeList = lazy(() => import('./pages/Notices/NoticeList'))
const NoticeDetail = lazy(() => import('./pages/Notices/NoticeDetail'))
const Login = lazy(() => import('./pages/Login/index'))
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'))
const SchoolManager = lazy(() => import('./pages/Admin/SchoolManager'))
const EventManager = lazy(() => import('./pages/Admin/EventManager'))
const MaterialManager = lazy(() => import('./pages/Admin/MaterialManager'))
const GalleryManager = lazy(() => import('./pages/Admin/GalleryManager'))
const NoticeManager = lazy(() => import('./pages/Admin/NoticeManager'))
const MemberManager = lazy(() => import('./pages/Admin/MemberManager'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner className="h-screen" />}>
      <Routes>
        <Route element={<PageLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/schools" element={<SchoolList />} />
          <Route path="/schools/:id" element={<SchoolDetail />} />
          <Route path="/academic/schedule" element={<Schedule />} />
          <Route path="/academic/materials" element={<Materials />} />
          <Route path="/culture/programs" element={<Programs />} />
          <Route path="/culture/archive" element={<Archive />} />
          <Route path="/activities/clubs" element={<Clubs />} />
          <Route path="/activities/events" element={<Events />} />
          <Route path="/gallery" element={<GalleryMain />} />
          <Route path="/gallery/:albumId" element={<AlbumDetail />} />
          <Route path="/notices" element={<NoticeList />} />
          <Route path="/notices/:id" element={<NoticeDetail />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="schools" element={<SchoolManager />} />
          <Route path="events" element={<EventManager />} />
          <Route path="materials" element={<MaterialManager />} />
          <Route path="gallery" element={<GalleryManager />} />
          <Route path="notices" element={<NoticeManager />} />
          <Route path="members" element={<MemberManager />} />
        </Route>
      </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
