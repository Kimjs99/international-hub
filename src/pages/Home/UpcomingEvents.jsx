import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../context/LanguageContext'
import { supabase } from '../../lib/supabase'
import EventCard from '../../components/UI/EventCard'
import Spinner from '../../components/UI/Spinner'
import EmptyState from '../../components/UI/EmptyState'

export default function UpcomingEvents() {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const today = new Date().toISOString().split('T')[0]

  const { data: events, isLoading } = useQuery({
    queryKey: ['events', 'upcoming'],
    queryFn: async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .gte('start_date', today)
        .order('start_date')
        .limit(6)
      return data ?? []
    },
  })

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('section.upcomingEvents', { ns: 'home' })}
        </h2>
        <Link to="/academic/schedule" className="text-sm text-primary-600 hover:underline">
          {t('action.viewMore')} &rarr;
        </Link>
      </div>
      {isLoading ? (
        <Spinner className="py-12" />
      ) : events?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(e => (
            <EventCard key={e.id} event={e} lang={lang} />
          ))}
        </div>
      ) : (
        <EmptyState title={t('status.empty')} />
      )}
    </section>
  )
}
