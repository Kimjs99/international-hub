import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../context/LanguageContext'
import { useClubs } from '../../hooks/useClubs'
import SchoolBadge from '../../components/UI/SchoolBadge'
import Spinner from '../../components/UI/Spinner'
import EmptyState from '../../components/UI/EmptyState'
import { Users } from 'lucide-react'

const CATEGORIES = ['all', 'academic', 'culture', 'sports', 'volunteer']

export default function Clubs() {
  const { t } = useTranslation('activities')
  const { lang } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('all')

  const filters = activeCategory !== 'all' ? { category: activeCategory } : {}
  const { data: clubs = [], isLoading, isError } = useClubs(filters)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('clubs.title')}</h1>
        <p className="mt-2 text-gray-500">{t('clubs.subtitle')}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeCategory === cat
                ? 'bg-primary-500 text-white border-primary-500'
                : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
            }`}
          >
            {t(`clubs.filter.${cat}`)}
          </button>
        ))}
      </div>

      {isLoading && <Spinner className="py-20" />}
      {isError && (
        <EmptyState
          icon={Users}
          title={t('status.loadError', { ns: 'common' })}
        />
      )}
      {!isLoading && !isError && clubs.length === 0 && (
        <EmptyState
          icon={Users}
          title={t('status.empty', { ns: 'common' })}
        />
      )}
      {!isLoading && !isError && clubs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {clubs.map((club) => (
            <div
              key={club.id}
              className="bg-white border rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-40 bg-gradient-to-br from-primary-100 to-primary-200">
                {club.cover_url && (
                  <img
                    src={club.cover_url}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    alt={lang === 'ja' ? (club.name_ja || club.name_ko) : lang === 'en' ? (club.name_en || club.name_ko) : club.name_ko}
                  />
                )}
              </div>
              <div className="p-4">
                <SchoolBadge
                  name={lang === 'ja' ? (club.schools?.name_ja || club.schools?.name_ko) : lang === 'en' ? (club.schools?.name_en || club.schools?.name_ko) : club.schools?.name_ko}
                />
                <h3 className="font-semibold mt-2 text-gray-900">
                  {lang === 'ja' ? (club.name_ja || club.name_ko) : lang === 'en' ? (club.name_en || club.name_ko) : club.name_ko}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                  {lang === 'ja' ? (club.description_ja || club.description_ko) : lang === 'en' ? (club.description_en || club.description_ko) : club.description_ko}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
