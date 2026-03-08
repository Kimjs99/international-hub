import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../context/LanguageContext'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import FileCard from '../../components/UI/FileCard'
import Spinner from '../../components/UI/Spinner'
import EmptyState from '../../components/UI/EmptyState'
import { Archive } from 'lucide-react'

async function fetchCultureMaterials(year) {
  let query = supabase
    .from('materials')
    .select('*')
    .eq('category', 'culture')
    .order('created_at', { ascending: false })
  if (year) {
    const start = `${year}-01-01`
    const end = `${year}-12-31`
    query = query.gte('created_at', start).lte('created_at', end)
  }
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

async function fetchAvailableYears() {
  const { data } = await supabase
    .from('materials')
    .select('created_at')
    .eq('category', 'culture')
  if (!data) return []
  const years = [...new Set(data.map((r) => new Date(r.created_at).getFullYear()))]
  return years.sort((a, b) => b - a)
}

export default function ArchivePage() {
  const { t } = useTranslation('culture')
  const { lang } = useLanguage()
  const [selectedYear, setSelectedYear] = useState(null)

  const { data: years = [] } = useQuery({
    queryKey: ['culture-materials-years'],
    queryFn: fetchAvailableYears,
  })

  const { data: materials = [], isLoading, isError } = useQuery({
    queryKey: ['culture-materials', selectedYear],
    queryFn: () => fetchCultureMaterials(selectedYear),
  })

  async function handleDownload(material) {
    window.open(material.file_url, '_blank')
    await supabase
      .from('materials')
      .update({ download_count: (material.download_count ?? 0) + 1 })
      .eq('id', material.id)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('archive.title')}</h1>
        <p className="mt-2 text-gray-500">{t('archive.subtitle')}</p>
      </div>

      {years.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedYear(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              selectedYear === null
                ? 'bg-primary-500 text-white border-primary-500'
                : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
            }`}
          >
            {t('label.all', { ns: 'common' })}
          </button>
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                selectedYear === year
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      )}

      {isLoading && <Spinner className="py-20" />}
      {isError && (
        <EmptyState
          icon={Archive}
          title={t('status.loadError', { ns: 'common' })}
        />
      )}
      {!isLoading && !isError && materials.length === 0 && (
        <EmptyState
          icon={Archive}
          title={t('status.empty', { ns: 'common' })}
        />
      )}
      {!isLoading && !isError && materials.length > 0 && (
        <div className="flex flex-col gap-4">
          {materials.map((material) => (
            <FileCard
              key={material.id}
              material={material}
              lang={lang}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </div>
  )
}
