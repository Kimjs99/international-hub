import HeroBanner from './HeroBanner'
import AnnouncementBar from './AnnouncementBar'
import QuickMenu from './QuickMenu'
import UpcomingEvents from './UpcomingEvents'
import SchoolHighlight from './SchoolHighlight'

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <AnnouncementBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <QuickMenu />
        <UpcomingEvents />
        <SchoolHighlight />
      </div>
    </div>
  )
}
