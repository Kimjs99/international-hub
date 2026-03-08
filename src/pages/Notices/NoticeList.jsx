import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../context/LanguageContext'
import { useQueryClient } from '@tanstack/react-query'
import { Pin, Bell } from 'lucide-react'
import { format } from 'date-fns'
import { supabase } from '../../lib/supabase'
import { useNotices } from '../../hooks/useNotices'
import { useSchools } from '../../hooks/useSchools'
import SchoolBadge from '../../components/UI/SchoolBadge'
import Spinner from '../../components/UI/Spinner'
import EmptyState from '../../components/UI/EmptyState'

export default function NoticeList() {
  const { t } = useTranslation('notices')
  const { lang } = useLanguage()
  const queryClient = useQueryClient()
  const [selectedSchool, setSelectedSchool] = useState(null)

  const { data: schools = [] } = useSchools()
  const { data: notices = [], isLoading, isError } = useNotices(
    selectedSchool ? { schoolId: selectedSchool } : {}
  )

  useEffect(() => {
    const channel = supabase
      .channel('notices-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notices' },
        () => queryClient.invalidateQueries({ queryKey: ['notices'] })
      )
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [queryClient])

  const pinned = notices.filter((n) => n.is_pinned)
  const regular = notices.filter((n) => !n.is_pinned)

  function schoolName(notice) {
    if (!notice.schools) return null
    return lang === 'ja' ? (notice.schools.name_ja || notice.schools.name_ko) : lang === 'en' ? (notice.schools.name_en || notice.schools.name_ko) : notice.schools.name_ko
  }

  function NoticeRow({ notice, highlight = false }) {
    return (
      <Link
        to={`/notices/${notice.id}`}
        className={`flex items-start gap-3 p-4 rounded-xl border transition-colors hover:bg-gray-50 ${
          highlight ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
        }`}
      >
        {highlight && <Pin className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {highlight && (
              <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                {t('pinned')}
              </span>
            )}
            {notice.schools && (
              <SchoolBadge name={schoolName(notice)} />
            )}
          </div>
          <p className={`font-medium truncate ${highlight ? 'text-red-900' : 'text-gray-900'}`}>
            {lang === 'ja' ? (notice.title_ja || notice.title_ko) : lang === 'en' ? (notice.title_en || notice.title_ko) : notice.title_ko}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {format(new Date(notice.created_at), 'yyyy.MM.dd')}
          </p>
        </div>
      </Link>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-2 text-gray-500">{t('subtitle')}</p>
      </div>

      {schools.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedSchool(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              selectedSchool === null
                ? 'bg-primary-500 text-white border-primary-500'
                : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
            }`}
          >
            {t('label.all', { ns: 'common' })}
          </button>
          {schools.map((school) => (
            <button
              key={school.id}
              onClick={() => setSelectedSchool(school.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                selectedSchool === school.id
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
              }`}
            >
              {lang === 'ja' ? (school.name_ja || school.name_ko) : lang === 'en' ? (school.name_en || school.name_ko) : school.name_ko}
            </button>
          ))}
        </div>
      )}

      {isLoading && <Spinner className="py-20" />}
      {isError && (
        <EmptyState
          icon={Bell}
          title={t('status.loadError', { ns: 'common' })}
        />
      )}
      {!isLoading && !isError && notices.length === 0 && (
        <EmptyState
          icon={Bell}
          title={t('status.empty', { ns: 'common' })}
        />
      )}
      {!isLoading && !isError && notices.length > 0 && (
        <div className="flex flex-col gap-3">
          {pinned.map((notice) => (
            <NoticeRow key={notice.id} notice={notice} highlight />
          ))}
          {pinned.length > 0 && regular.length > 0 && (
            <div className="border-t border-gray-200 my-1" />
          )}
          {regular.map((notice) => (
            <NoticeRow key={notice.id} notice={notice} />
          ))}
        </div>
      )}
    </div>
  )
}
