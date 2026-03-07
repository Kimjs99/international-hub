import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PageLayout from './components/Layout/PageLayout'

import Home from './pages/Home/index'
import SchoolList from './pages/Schools/SchoolList'
import SchoolDetail from './pages/Schools/SchoolDetail'
import Schedule from './pages/Academic/Schedule'
import Materials from './pages/Academic/Materials'
import Programs from './pages/Culture/Programs'
import Archive from './pages/Culture/Archive'
import Clubs from './pages/Activities/Clubs'
import Events from './pages/Activities/Events'
import GalleryMain from './pages/Gallery/GalleryMain'
import AlbumDetail from './pages/Gallery/AlbumDetail'
import NoticeList from './pages/Notices/NoticeList'
import NoticeDetail from './pages/Notices/NoticeDetail'
import AdminDashboard from './pages/Admin/Dashboard'

export default function App() {
  return (
    <BrowserRouter>
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
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
