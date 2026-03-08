import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../context/LanguageContext'
import { useEvents } from '../../hooks/useEvents'
import EventCard from '../../components/UI/EventCard'
import Badge from '../../components/UI/Badge'
import Spinner from '../../components/UI/Spinner'
import EmptyState from '../../components/UI/EmptyState'
import { Calendar } from 'lucide-react'

function getEventStatus(startDate, endDate) {
  const now = new Date()
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : start
  if (now < start) return 'upcoming'
  if (now > end) return 'finished'
  return 'ongoing'
}

const STATUS_BADGE_TYPE = {
  upcoming: 'academic',
  ongoing:  'activity',
  finished: 'general',
}

export default function Programs() {
  const { t } = useTranslation('culture')
  const { lang } = useLanguage()
  const { data: events = [], isLoading, isError } = useEvents({ category: 'culture' })

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('programs.title')}</h1>
        <p className="mt-2 text-gray-500">{t('programs.subtitle')}</p>
      </div>

      {isLoading && <Spinner className="py-20" />}
      {isError && (
        <EmptyState
          icon={Calendar}
          title={t('status.loadError', { ns: 'common' })}
        />
      )}
      {!isLoading && !isError && events.length === 0 && (
        <EmptyState
          icon={Calendar}
          title={t('programs.empty')}
        />
      )}
      {!isLoading && !isError && events.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => {
            const status = getEventStatus(event.start_date, event.end_date)
            const statusKey = status === 'finished' ? 'ended' : status
            return (
              <div key={event.id} className="relative">
                <div className="absolute top-3 right-3 z-10">
                  <Badge label={t(`status.${statusKey}`)} type={STATUS_BADGE_TYPE[status]} />
                </div>
                <EventCard event={event} lang={lang} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
