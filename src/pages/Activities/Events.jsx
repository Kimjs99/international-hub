import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useEvents } from '../../hooks/useEvents'
import EventCard from '../../components/UI/EventCard'
import Spinner from '../../components/UI/Spinner'
import EmptyState from '../../components/UI/EmptyState'
import { CalendarDays } from 'lucide-react'

export default function Events() {
  const { t, i18n } = useTranslation('activities')
  const lang = i18n.language
  const [tab, setTab] = useState('upcoming')
  const { data: events = [], isLoading, isError } = useEvents({ category: 'activity' })

  const now = new Date()
  const upcoming = events.filter((e) => new Date(e.start_date) >= now)
  const past = events.filter((e) => new Date(e.start_date) < now)

  const displayed = tab === 'upcoming' ? upcoming : past

  const TABS = [
    { key: 'upcoming', label: lang === 'ko' ? '예정 행사' : '予定行事' },
    { key: 'past',     label: lang === 'ko' ? '지난 행사' : '過去の行事' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('events.title')}</h1>
        <p className="mt-2 text-gray-500">{t('events.subtitle')}</p>
      </div>

      <div className="flex gap-1 mb-8 border-b border-gray-200">
        {TABS.map((tabItem) => (
          <button
            key={tabItem.key}
            onClick={() => setTab(tabItem.key)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === tabItem.key
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tabItem.label}
            <span className="ml-1.5 text-xs bg-gray-100 text-gray-600 rounded-full px-1.5 py-0.5">
              {tabItem.key === 'upcoming' ? upcoming.length : past.length}
            </span>
          </button>
        ))}
      </div>

      {isLoading && <Spinner className="py-20" />}
      {isError && (
        <EmptyState
          icon={CalendarDays}
          title={lang === 'ko' ? '데이터를 불러오지 못했습니다' : 'データの取得に失敗しました'}
        />
      )}
      {!isLoading && !isError && displayed.length === 0 && (
        <EmptyState
          icon={CalendarDays}
          title={
            tab === 'upcoming'
              ? lang === 'ko' ? '예정된 행사가 없습니다' : '予定されている行事はありません'
              : lang === 'ko' ? '지난 행사가 없습니다' : '過去の行事はありません'
          }
        />
      )}
      {!isLoading && !isError && displayed.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayed.map((event) => (
            <EventCard key={event.id} event={event} lang={lang} />
          ))}
        </div>
      )}
    </div>
  )
}
