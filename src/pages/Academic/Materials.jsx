import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../context/LanguageContext'
import { Search } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useMaterials } from '../../hooks/useMaterials'
import { useSchools } from '../../hooks/useSchools'
import FileCard from '../../components/UI/FileCard'
import Spinner from '../../components/UI/Spinner'
import EmptyState from '../../components/UI/EmptyState'

const CATEGORIES = ['all', 'academic', 'culture', 'activity', 'general']

export default function Materials() {
  const { t } = useTranslation('academic')
  const { t: tc } = useTranslation('common')
  const { lang } = useLanguage()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [schoolId, setSchoolId] = useState('')
  // Debounced search submitted on button click / enter
  const [appliedSearch, setAppliedSearch] = useState('')

  const { data: materials, isLoading } = useMaterials({
    category: category || undefined,
    schoolId: schoolId || undefined,
    search: appliedSearch || undefined,
  })

  const { data: schools } = useSchools()

  const handleDownload = async (material) => {
    window.open(material.file_url, '_blank')
    // Increment download count (fire-and-forget)
    await supabase
      .from('materials')
      .update({ download_count: (material.download_count ?? 0) + 1 })
      .eq('id', material.id)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setAppliedSearch(search)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('materials.title')}</h1>
        <p className="text-gray-500 mt-1">{t('materials.subtitle')}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('materials.searchPlaceholder')}
              className="w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            {tc('action.search')}
          </button>
        </form>

        {/* Category filter */}
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="px-3 py-2.5 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat === 'all' ? '' : cat}>
              {cat === 'all' ? tc('label.all') : tc(`category.${cat}`)}
            </option>
          ))}
        </select>

        {/* School filter */}
        <select
          value={schoolId}
          onChange={e => setSchoolId(e.target.value)}
          className="px-3 py-2.5 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          <option value="">{tc('label.all')}</option>
          {schools?.map(s => (
            <option key={s.id} value={s.id}>
              {lang === 'ja' ? (s.name_ja || s.name_ko) : lang === 'en' ? (s.name_en || s.name_ko) : s.name_ko}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      {isLoading ? (
        <Spinner className="py-20" />
      ) : !materials?.length ? (
        <EmptyState title={tc('status.empty')} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {materials.map(m => (
            <FileCard
              key={m.id}
              material={m}
              lang={lang}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </div>
  )
}
