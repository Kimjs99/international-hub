import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, GraduationCap, ChevronDown } from 'lucide-react'
import LanguageToggle from '../UI/LanguageToggle'

const NAV_ITEMS = [
  { key: 'schools', path: '/schools' },
  {
    key: 'academic', path: '#',
    children: [
      { key: 'academicSchedule', path: '/academic/schedule' },
      { key: 'academicMaterials', path: '/academic/materials' },
    ]
  },
  {
    key: 'culture', path: '#',
    children: [
      { key: 'culturePrograms', path: '/culture/programs' },
      { key: 'cultureArchive', path: '/culture/archive' },
    ]
  },
  {
    key: 'activities', path: '#',
    children: [
      { key: 'activityClubs', path: '/activities/clubs' },
      { key: 'activityEvents', path: '/activities/events' },
    ]
  },
  { key: 'gallery', path: '/gallery' },
  { key: 'notices', path: '/notices' },
]

export default function Navbar() {
  const { t } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link to="/" className="flex items-center gap-2 text-primary-700 font-bold text-lg">
            <GraduationCap className="w-7 h-7" />
            <span className="hidden sm:inline">{t('hubName')}</span>
          </Link>

          {/* 데스크탑 메뉴 */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <div key={item.key} className="relative group">
                {item.children ? (
                  <>
                    <button className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 hover:text-primary-600 rounded-lg hover:bg-gray-50">
                      {t(`nav.${item.key}`)}
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <div className="absolute top-full left-0 mt-1 bg-white border rounded-xl shadow-lg py-1 min-w-36 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      {item.children.map(child => (
                        <NavLink key={child.key} to={child.path}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">
                          {t(`nav.${child.key}`)}
                        </NavLink>
                      ))}
                    </div>
                  </>
                ) : (
                  <NavLink to={item.path}
                    className={({ isActive }) =>
                      `px-3 py-2 text-sm rounded-lg ${isActive ? 'text-primary-600 bg-primary-50 font-medium' : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'}`
                    }>
                    {t(`nav.${item.key}`)}
                  </NavLink>
                )}
              </div>
            ))}
          </div>

          {/* 언어 전환 + 모바일 버튼 */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <LanguageToggle />
            </div>
            <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileOpen && (
        <div className="lg:hidden border-t bg-white px-4 py-3 space-y-1">
          <div className="mb-3">
            <LanguageToggle />
          </div>
          {NAV_ITEMS.map(item => (
            <div key={item.key}>
              {item.children ? (
                <>
                  <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {t(`nav.${item.key}`)}
                  </p>
                  {item.children.map(child => (
                    <NavLink key={child.key} to={child.path}
                      onClick={() => setMobileOpen(false)}
                      className="block px-6 py-2 text-sm text-gray-700 hover:text-primary-600">
                      {t(`nav.${child.key}`)}
                    </NavLink>
                  ))}
                </>
              ) : (
                <NavLink to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-sm ${isActive ? 'text-primary-600 bg-primary-50 font-medium' : 'text-gray-700'}`
                  }>
                  {t(`nav.${item.key}`)}
                </NavLink>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  )
}
