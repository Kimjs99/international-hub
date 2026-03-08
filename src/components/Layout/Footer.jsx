import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GraduationCap } from 'lucide-react'

const FOOTER_LINKS = [
  { path: '/schools', key: 'nav.schools' },
  { path: '/academic/schedule', key: 'nav.academicSchedule' },
  { path: '/gallery', key: 'nav.gallery' },
  { path: '/notices', key: 'nav.notices' },
]

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
            <GraduationCap className="w-6 h-6" />
            {t('hubName')}
          </div>
          <p className="text-sm text-gray-400">{t('footer.description')}</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">{t('footer.links')}</h4>
          <ul className="space-y-2 text-sm">
            {FOOTER_LINKS.map(({ path, key }) => (
              <li key={path}>
                <Link to={path} className="hover:text-white transition-colors">
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">{t('footer.contact')}</h4>
          <p className="text-sm text-gray-400">hub@international-school.kr</p>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        {t('footer.copyright')}
      </div>
    </footer>
  )
}
