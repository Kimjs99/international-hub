import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LayoutDashboard, School, Calendar, FileText, Image, Bell, Users, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const ADMIN_MENUS = [
  { key: 'dashboard', path: '/admin', icon: LayoutDashboard, end: true },
  { key: 'schools', path: '/admin/schools', icon: School },
  { key: 'events', path: '/admin/events', icon: Calendar },
  { key: 'materials', path: '/admin/materials', icon: FileText },
  { key: 'gallery', path: '/admin/gallery', icon: Image },
  { key: 'notices', path: '/admin/notices', icon: Bell },
  { key: 'members', path: '/admin/members', icon: Users },
]

export default function AdminSidebar() {
  const { signOut } = useAuth()
  const { t } = useTranslation('admin')
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-gray-300 flex flex-col">
      <div className="p-6 text-white font-bold text-lg border-b border-gray-700">
        {t('panel')}
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {ADMIN_MENUS.map(m => {
          const Icon = m.icon
          return (
            <NavLink key={m.path} to={m.path} end={m.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-primary-600 text-white' : 'hover:bg-gray-800 hover:text-white'
                }`
              }>
              <Icon className="w-4 h-4" />
              {t(`nav.${m.key}`)}
            </NavLink>
          )
        })}
      </nav>
      <button onClick={signOut}
        className="m-4 flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-gray-800 hover:text-white transition-colors">
        <LogOut className="w-4 h-4" />
        {t('logout')}
      </button>
    </aside>
  )
}
