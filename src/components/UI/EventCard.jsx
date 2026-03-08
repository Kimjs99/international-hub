import { useTranslation } from 'react-i18next'
import { Calendar, MapPin, Globe } from 'lucide-react'
import { format } from 'date-fns'
import Badge from './Badge'

export default function EventCard({ event, lang = 'ko', onClick }) {
  const { t } = useTranslation()
  const title = lang === 'ko' ? event.title_ko : event.title_ja
  const location = lang === 'ko' ? event.location_ko : event.location_ja

  return (
    <div
      onClick={onClick}
      className="bg-white border rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <Badge label={event.category} type={event.category} />
        {event.is_online && (
          <span className="text-xs text-blue-600 flex items-center gap-1">
            <Globe className="w-3 h-3" /> {t('label.online')}
          </span>
        )}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{title}</h3>
      <div className="flex items-center gap-1 text-sm text-gray-500">
        <Calendar className="w-4 h-4" />
        <span>{format(new Date(event.start_date), 'yyyy.MM.dd')}</span>
        {event.end_date && <span>~ {format(new Date(event.end_date), 'MM.dd')}</span>}
      </div>
      {location && (
        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
      )}
    </div>
  )
}
