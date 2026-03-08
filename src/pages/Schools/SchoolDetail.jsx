import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../context/LanguageContext'
import { Mail, User, ChevronLeft } from 'lucide-react'
import { useSchool } from '../../hooks/useSchools'
import EventCard from '../../components/UI/EventCard'
import FileCard from '../../components/UI/FileCard'
import Spinner from '../../components/UI/Spinner'
import EmptyState from '../../components/UI/EmptyState'

const TABS = ['info', 'events', 'materials', 'gallery']

export default function SchoolDetail() {
  const { id } = useParams()
  const { t } = useTranslation('schools')
  const { t: tc } = useTranslation('common')
  const { lang } = useLanguage()
  const [activeTab, setActiveTab] = useState('info')

  const { data: school, isLoading } = useSchool(id)

  if (isLoading) return <Spinner className="py-32" />
  if (!school) return <EmptyState title={tc('status.empty')} />

  const name = lang === 'ja' ? (school.name_ja || school.name_ko) : lang === 'en' ? (school.name_en || school.name_ko) : school.name_ko
  const description = lang === 'ja' ? (school.description_ja || school.description_ko) : lang === 'en' ? (school.description_en || school.description_ko) : school.description_ko
  const isKorea = school.country === 'KR'

  const bannerGradient = isKorea
    ? 'from-primary-900 via-primary-700 to-primary-500'
    : 'from-rose-900 via-rose-700 to-pink-500'

  return (
    <div>
      {/* Banner */}
      {school.banner_url ? (
        <div className="h-56 sm:h-72 overflow-hidden">
          <img
            src={school.banner_url}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className={`h-56 sm:h-72 bg-gradient-to-br ${bannerGradient}`} />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <div className="pt-6">
          <Link to="/schools" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <ChevronLeft className="w-4 h-4" />
            {tc('action.back')}
          </Link>
        </div>

        {/* School header */}
        <div className="mt-4 pb-6 border-b flex flex-col sm:flex-row sm:items-end gap-4">
          {/* Logo */}
          {school.logo_url ? (
            <img
              src={school.logo_url}
              alt=""
              className="w-20 h-20 rounded-full border-4 border-white shadow object-contain bg-white"
            />
          ) : (
            <div
              className={`w-20 h-20 rounded-full border-4 border-white shadow flex items-center justify-center text-3xl ${
                isKorea ? 'bg-primary-100' : 'bg-pink-100'
              }`}
            >
              {isKorea ? '\uD83C\uDDF0\uD83C\uDDF7' : '\uD83C\uDDEF\uD83C\uDDF5'}
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{name}</h1>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  isKorea ? 'bg-red-50 text-red-600' : 'bg-pink-50 text-pink-600'
                }`}
              >
                {isKorea ? t('filter.korea') : t('filter.japan')}
              </span>
            </div>
            <p className="text-gray-500 mt-1">{school.city}</p>

            {/* Contact */}
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
              {school.contact_name && (
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {school.contact_name}
                </span>
              )}
              {school.contact_email && (
                <a
                  href={`mailto:${school.contact_email}`}
                  className="flex items-center gap-1 hover:text-primary-600"
                >
                  <Mail className="w-4 h-4" />
                  {school.contact_email}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-6 border-b">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab
                  ? 'bg-white border border-b-white text-primary-700 -mb-px border-gray-200'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t(`detail.${tab}`)}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="py-8">
          {activeTab === 'info' && (
            <div className="prose max-w-none text-gray-700">
              {description ? (
                <p className="whitespace-pre-wrap leading-relaxed">{description}</p>
              ) : (
                <EmptyState title={tc('status.empty')} />
              )}
            </div>
          )}

          {activeTab === 'events' && (
            school.events?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {school.events.map(e => (
                  <EventCard key={e.id} event={e} lang={lang} />
                ))}
              </div>
            ) : (
              <EmptyState title={tc('status.empty')} />
            )
          )}

          {activeTab === 'materials' && (
            school.materials?.length ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {school.materials.map(m => (
                  <FileCard
                    key={m.id}
                    material={m}
                    lang={lang}
                    onDownload={mat => window.open(mat.file_url, '_blank')}
                  />
                ))}
              </div>
            ) : (
              <EmptyState title={tc('status.empty')} />
            )
          )}

          {activeTab === 'gallery' && (
            school.gallery_albums?.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {school.gallery_albums.map(album => (
                  <Link
                    key={album.id}
                    to={`/gallery/${album.id}`}
                    className="group rounded-xl overflow-hidden border hover:shadow-md transition-shadow"
                  >
                    {album.cover_url ? (
                      <img
                        src={album.cover_url}
                        alt=""
                        className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-36 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                        No image
                      </div>
                    )}
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {lang === 'ja' ? (album.title_ja || album.title_ko) : lang === 'en' ? (album.title_en || album.title_ko) : album.title_ko}
                      </p>
                      {album.photo_count != null && (
                        <p className="text-xs text-gray-400 mt-0.5">{album.photo_count} photos</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState title={tc('status.empty')} />
            )
          )}
        </div>
      </div>
    </div>
  )
}
