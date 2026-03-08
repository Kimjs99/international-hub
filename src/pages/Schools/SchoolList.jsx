import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../context/LanguageContext'
import { useSchools } from '../../hooks/useSchools'
import Spinner from '../../components/UI/Spinner'
import EmptyState from '../../components/UI/EmptyState'

const FILTERS = [
  { value: 'all', labelKey: 'filter.all' },
  { value: 'KR',  labelKey: 'filter.korea' },
  { value: 'JP',  labelKey: 'filter.japan' },
]

export default function SchoolList() {
  const { t } = useTranslation('schools')
  const { lang } = useLanguage()
  const [filter, setFilter] = useState('all')

  const { data: schools, isLoading } = useSchools()

  const filtered = schools
    ? filter === 'all'
      ? schools
      : schools.filter(s => s.country === filter)
    : []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-500 mt-2">{t('subtitle')}</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-8">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t(f.labelKey)}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <Spinner className="py-20" />
      ) : filtered.length === 0 ? (
        <EmptyState title={t('status.empty', { ns: 'common' })} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(s => (
            <Link
              key={s.id}
              to={`/schools/${s.id}`}
              className="bg-white border rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Logo / flag */}
              <div className="flex items-center gap-4 mb-4">
                {s.logo_url ? (
                  <img
                    src={s.logo_url}
                    alt=""
                    className="w-14 h-14 object-contain rounded-full border"
                  />
                ) : (
                  <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center text-2xl border">
                    {s.country === 'KR' ? '\uD83C\uDDF0\uD83C\uDDF7' : '\uD83C\uDDEF\uD83C\uDDF5'}
                  </div>
                )}
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {lang === 'ja' ? (s.name_ja || s.name_ko) : lang === 'en' ? (s.name_en || s.name_ko) : s.name_ko}
                  </h2>
                  <p className="text-sm text-gray-500">{s.city}</p>
                </div>
              </div>

              {/* Description */}
              {(lang === 'ja' ? (s.description_ja || s.description_ko) : lang === 'en' ? (s.description_en || s.description_ko) : s.description_ko) && (
                <p className="text-sm text-gray-600 line-clamp-2 flex-1">
                  {lang === 'ja' ? (s.description_ja || s.description_ko) : lang === 'en' ? (s.description_en || s.description_ko) : s.description_ko}
                </p>
              )}

              {/* Country badge */}
              <div className="mt-4">
                <span
                  className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                    s.country === 'KR'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-pink-50 text-pink-600'
                  }`}
                >
                  {s.country === 'KR' ? t('filter.korea') : t('filter.japan')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
