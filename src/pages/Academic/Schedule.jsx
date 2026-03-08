import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../context/LanguageContext'
import { CalendarDays, List } from 'lucide-react'
import { format } from 'date-fns'
import { useEvents } from '../../hooks/useEvents'
import Calendar from '../../components/UI/Calendar'
import EventCard from '../../components/UI/EventCard'
import Modal from '../../components/UI/Modal'
import Spinner from '../../components/UI/Spinner'
import EmptyState from '../../components/UI/EmptyState'

export default function Schedule() {
  const { t } = useTranslation('academic')
  const { t: tc } = useTranslation('common')
  const { lang } = useLanguage()
  const [viewMode, setViewMode] = useState('calendar') // 'calendar' | 'list'
  const [selectedEvent, setSelectedEvent] = useState(null)

  const { data: events, isLoading } = useEvents({})

  const formatDateRange = (e) => {
    const start = format(new Date(e.start_date), 'yyyy.MM.dd')
    if (!e.end_date) return start
    return `${start} ~ ${format(new Date(e.end_date), 'yyyy.MM.dd')}`
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('schedule.title')}</h1>
          <p className="text-gray-500 mt-1">{t('schedule.subtitle')}</p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'calendar'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            {t('schedule.viewCalendar')}
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <List className="w-4 h-4" />
            {t('schedule.viewList')}
          </button>
        </div>
      </div>

      {isLoading ? (
        <Spinner className="py-20" />
      ) : !events?.length ? (
        <EmptyState title={tc('status.empty')} />
      ) : viewMode === 'calendar' ? (
        <Calendar
          events={events}
          lang={lang}
          onEventClick={setSelectedEvent}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(e => (
            <EventCard
              key={e.id}
              event={e}
              lang={lang}
              onClick={() => setSelectedEvent(e)}
            />
          ))}
        </div>
      )}

      {/* Event detail modal */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent ? (lang === 'ja' ? (selectedEvent.title_ja || selectedEvent.title_ko) : lang === 'en' ? (selectedEvent.title_en || selectedEvent.title_ko) : selectedEvent.title_ko) : ''}
        size="md"
      >
        {selectedEvent && (
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <span className="font-medium text-gray-500 block mb-1">
                {t('schedule.period')}
              </span>
              <span>{formatDateRange(selectedEvent)}</span>
            </div>
            {(selectedEvent.location_ko || selectedEvent.location_ja) && (
              <div>
                <span className="font-medium text-gray-500 block mb-1">
                  {t('schedule.location')}
                </span>
                <span>
                  {lang === 'ja' ? (selectedEvent.location_ja || selectedEvent.location_ko) : lang === 'en' ? (selectedEvent.location_en || selectedEvent.location_ko) : selectedEvent.location_ko}
                </span>
              </div>
            )}
            {(selectedEvent.description_ko || selectedEvent.description_ja) && (
              <div>
                <span className="font-medium text-gray-500 block mb-1">
                  {t('schedule.content')}
                </span>
                <p className="whitespace-pre-wrap leading-relaxed">
                  {lang === 'ja' ? (selectedEvent.description_ja || selectedEvent.description_ko) : lang === 'en' ? (selectedEvent.description_en || selectedEvent.description_ko) : selectedEvent.description_ko}
                </p>
              </div>
            )}
            {selectedEvent.is_online && (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                {tc('label.online')}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
