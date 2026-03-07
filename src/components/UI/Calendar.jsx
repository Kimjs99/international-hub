import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns'
import clsx from 'clsx'

const CATEGORY_COLORS = {
  academic: 'bg-blue-400',
  culture:  'bg-purple-400',
  activity: 'bg-green-400',
  general:  'bg-gray-400',
}

export default function Calendar({ events = [], lang = 'ko', onEventClick }) {
  const [current, setCurrent] = useState(new Date())

  const monthStart = startOfMonth(current)
  const monthEnd = endOfMonth(current)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const days = []
  let day = calStart
  while (day <= calEnd) {
    days.push(day)
    day = addDays(day, 1)
  }

  const getEventsForDay = (d) =>
    events.filter(e => isSameDay(new Date(e.start_date), d))

  const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <button onClick={() => setCurrent(subMonths(current, 1))} className="p-1 hover:bg-gray-100 rounded">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-semibold text-gray-800">
          {format(current, lang === 'ko' ? 'yyyy년 M월' : 'yyyy年M月')}
        </span>
        <button onClick={() => setCurrent(addMonths(current, 1))} className="p-1 hover:bg-gray-100 rounded">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7">
        {DAY_LABELS.map(label => (
          <div key={label} className="py-2 text-center text-xs font-medium text-gray-500">{label}</div>
        ))}
        {days.map((d, i) => {
          const dayEvents = getEventsForDay(d)
          const isCurrentMonth = isSameMonth(d, current)
          return (
            <div
              key={i}
              className={clsx(
                'min-h-[72px] p-1 border-t',
                !isCurrentMonth && 'bg-gray-50'
              )}
            >
              <span className={clsx(
                'text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full',
                isCurrentMonth ? 'text-gray-700' : 'text-gray-300',
                isSameDay(d, new Date()) && 'bg-primary-500 text-white'
              )}>
                {format(d, 'd')}
              </span>
              <div className="mt-0.5 space-y-0.5">
                {dayEvents.slice(0, 2).map(e => (
                  <button
                    key={e.id}
                    onClick={() => onEventClick?.(e)}
                    className={clsx(
                      'w-full text-left text-xs text-white px-1 rounded truncate',
                      CATEGORY_COLORS[e.category] ?? CATEGORY_COLORS.general
                    )}
                  >
                    {lang === 'ko' ? e.title_ko : e.title_ja}
                  </button>
                ))}
                {dayEvents.length > 2 && (
                  <span className="text-xs text-gray-400 px-1">+{dayEvents.length - 2}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-4 px-4 py-3 border-t text-xs text-gray-500">
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <span key={cat} className="flex items-center gap-1">
            <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
            {lang === 'ko'
              ? { academic: '학술', culture: '문화', activity: '활동', general: '일반' }[cat]
              : { academic: '学術', culture: '文化', activity: '活動', general: '一般' }[cat]
            }
          </span>
        ))}
      </div>
    </div>
  )
}
