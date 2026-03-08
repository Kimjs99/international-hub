import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Megaphone } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useLanguage } from '../../context/LanguageContext'

export default function AnnouncementBar() {
  const { t } = useTranslation()
  const { lang } = useLanguage()

  const { data: notices } = useQuery({
    queryKey: ['notices', 'pinned'],
    queryFn: async () => {
      const { data } = await supabase
        .from('notices')
        .select('id, title_ko, title_ja, title_en')
        .eq('is_pinned', true)
        .order('created_at', { ascending: false })
        .limit(3)
      return data ?? []
    },
  })

  if (!notices?.length) return null

  const getTitle = (n) =>
    lang === 'ja' ? (n.title_ja || n.title_ko)
    : lang === 'en' ? (n.title_en || n.title_ko)
    : n.title_ko

  return (
    <div className="bg-primary-50 border-b border-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-3">
        <span className="shrink-0 flex items-center gap-1 text-primary-700 font-semibold text-sm">
          <Megaphone className="w-4 h-4" />
          {t('label.pinned')}
        </span>
        <div className="overflow-hidden flex-1 space-y-0.5">
          {notices.map(n => (
            <Link
              key={n.id}
              to={`/notices/${n.id}`}
              className="block truncate text-sm text-primary-800 hover:underline"
            >
              {getTitle(n)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
