import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../context/LanguageContext'
import { Image } from 'lucide-react'
import { useAlbums } from '../../hooks/useGallery'
import { useSchools } from '../../hooks/useSchools'
import Spinner from '../../components/UI/Spinner'
import EmptyState from '../../components/UI/EmptyState'

export default function GalleryMain() {
  const { t } = useTranslation('gallery')
  const { lang } = useLanguage()
  const [selectedSchool, setSelectedSchool] = useState(null)

  const { data: schools = [] } = useSchools()
  const { data: albums = [], isLoading, isError } = useAlbums(
    selectedSchool ? { schoolId: selectedSchool } : {}
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-2 text-gray-500">{t('subtitle')}</p>
      </div>

      {schools.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedSchool(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              selectedSchool === null
                ? 'bg-primary-500 text-white border-primary-500'
                : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
            }`}
          >
            {t('label.all', { ns: 'common' })}
          </button>
          {schools.map((school) => (
            <button
              key={school.id}
              onClick={() => setSelectedSchool(school.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                selectedSchool === school.id
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
              }`}
            >
              {lang === 'ja' ? (school.name_ja || school.name_ko) : lang === 'en' ? (school.name_en || school.name_ko) : school.name_ko}
            </button>
          ))}
        </div>
      )}

      {isLoading && <Spinner className="py-20" />}
      {isError && (
        <EmptyState
          icon={Image}
          title={t('status.loadError', { ns: 'common' })}
        />
      )}
      {!isLoading && !isError && albums.length === 0 && (
        <EmptyState
          icon={Image}
          title={t('status.empty', { ns: 'common' })}
        />
      )}
      {!isLoading && !isError && albums.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {albums.map((album) => (
            <Link
              key={album.id}
              to={`/gallery/${album.id}`}
              className="group relative rounded-2xl overflow-hidden aspect-video bg-gray-100 block"
            >
              {album.cover_photo_url ? (
                <img
                  src={album.cover_photo_url}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  alt={lang === 'ja' ? (album.title_ja || album.title_ko) : lang === 'en' ? (album.title_en || album.title_ko) : album.title_ko}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <Image className="w-12 h-12" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-semibold text-sm">
                  {lang === 'ja' ? (album.title_ja || album.title_ko) : lang === 'en' ? (album.title_en || album.title_ko) : album.title_ko}
                </h3>
                <p className="text-xs text-white/70">{album.taken_date}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
