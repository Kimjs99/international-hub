import { NavLink } from 'react-router-dom'
import { LayoutDashboard, School, Calendar, FileText, Image, Bell, Users, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const ADMIN_MENUS = [
  { label: '대시보드', path: '/admin', icon: LayoutDashboard, end: true },
  { label: '학교 관리', path: '/admin/schools', icon: School },
  { label: '행사 관리', path: '/admin/events', icon: Calendar },
  { label: '자료 관리', path: '/admin/materials', icon: FileText },
  { label: '사진 관리', path: '/admin/gallery', icon: Image },
  { label: '공지 관리', path: '/admin/notices', icon: Bell },
  { label: '회원 관리', path: '/admin/members', icon: Users },
]

export default function AdminSidebar() {
  const { signOut } = useAuth()
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-gray-300 flex flex-col">
      <div className="p-6 text-white font-bold text-lg border-b border-gray-700">
        관리자 패널
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
              {m.label}
            </NavLink>
          )
        })}
      </nav>
      <button onClick={signOut}
        className="m-4 flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-gray-800 hover:text-white transition-colors">
        <LogOut className="w-4 h-4" />
        로그아웃
      </button>
    </aside>
  )
}
