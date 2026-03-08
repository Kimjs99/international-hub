import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import Spinner from '../../components/UI/Spinner'
import { School, Calendar, FileText, Image } from 'lucide-react'

export default function AdminDashboard() {
  const { t } = useTranslation('admin')
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const [schools, events, materials, photos] = await Promise.all([
        supabase.from('schools').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('materials').select('id', { count: 'exact', head: true }),
        supabase.from('gallery_photos').select('id', { count: 'exact', head: true }),
      ])
      return {
        schools: schools.count ?? 0,
        events: events.count ?? 0,
        materials: materials.count ?? 0,
        photos: photos.count ?? 0,
      }
    },
  })

  const STAT_CARDS = [
    { label: t('dashboard.schools'), key: 'schools', icon: School, color: 'text-blue-600 bg-blue-50' },
    { label: t('dashboard.events'), key: 'events', icon: Calendar, color: 'text-purple-600 bg-purple-50' },
    { label: t('dashboard.materials'), key: 'materials', icon: FileText, color: 'text-green-600 bg-green-50' },
    { label: t('dashboard.photos'), key: 'photos', icon: Image, color: 'text-amber-600 bg-amber-50' },
  ]

  if (isLoading) return <Spinner className="py-20" />

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('dashboard.title')}</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map(card => {
          const Icon = card.icon
          return (
            <div key={card.key} className="bg-white rounded-xl border p-6">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats?.[card.key]}</p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
