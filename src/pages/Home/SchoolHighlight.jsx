import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import Spinner from '../../components/UI/Spinner'

export default function SchoolHighlight() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const { data: schools, isLoading } = useQuery({
    queryKey: ['schools', 'highlight'],
    queryFn: async () => {
      const { data } = await supabase
        .from('schools')
        .select('id, name_ko, name_ja, city, country, logo_url')
        .limit(4)
      return data ?? []
    },
  })

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('section.schools', { ns: 'home' })}
        </h2>
        <Link to="/schools" className="text-sm text-primary-600 hover:underline">
          {t('action.viewMore')} &rarr;
        </Link>
      </div>
      {isLoading ? (
        <Spinner className="py-12" />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {schools?.map(s => (
            <Link
              key={s.id}
              to={`/schools/${s.id}`}
              className="bg-white border rounded-2xl p-6 hover:shadow-md transition-shadow text-center"
            >
              {s.logo_url ? (
                <img
                  src={s.logo_url}
                  alt=""
                  className="w-16 h-16 object-contain mx-auto mb-3 rounded-full"
                />
              ) : (
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                  {s.country === 'KR' ? '\uD83C\uDDF0\uD83C\uDDF7' : '\uD83C\uDDEF\uD83C\uDDF5'}
                </div>
              )}
              <h3 className="font-semibold text-gray-900 text-sm">
                {lang === 'ko' ? s.name_ko : s.name_ja}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{s.city}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
