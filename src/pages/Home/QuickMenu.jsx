import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { School, BookOpen, Palette, Users, Image, Bell } from 'lucide-react'

const MENUS = [
  { key: 'schools',    path: '/schools',           icon: School,   color: 'bg-blue-50 text-blue-600' },
  { key: 'academic',   path: '/academic/schedule', icon: BookOpen, color: 'bg-purple-50 text-purple-600' },
  { key: 'culture',    path: '/culture/programs',  icon: Palette,  color: 'bg-pink-50 text-pink-600' },
  { key: 'activities', path: '/activities/events', icon: Users,    color: 'bg-green-50 text-green-600' },
  { key: 'gallery',    path: '/gallery',            icon: Image,    color: 'bg-amber-50 text-amber-600' },
  { key: 'notices',    path: '/notices',            icon: Bell,     color: 'bg-red-50 text-red-600' },
]

export default function QuickMenu() {
  const { t } = useTranslation()
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('footer.links')}</h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
        {MENUS.map(m => {
          const Icon = m.icon
          return (
            <Link
              key={m.key}
              to={m.path}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:shadow-md transition-shadow bg-white border"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${m.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-gray-700 text-center">
                {t(`nav.${m.key}`)}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
