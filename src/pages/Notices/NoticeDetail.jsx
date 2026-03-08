import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../context/LanguageContext'
import { ChevronLeft, Bell } from 'lucide-react'
import { format } from 'date-fns'
import { useNotice } from '../../hooks/useNotices'
import SchoolBadge from '../../components/UI/SchoolBadge'
import Spinner from '../../components/UI/Spinner'
import EmptyState from '../../components/UI/EmptyState'

export default function NoticeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation('notices')
  const { lang } = useLanguage()

  const { data: notice, isLoading, isError } = useNotice(id)

  const schoolName = notice?.schools
    ? (lang === 'ja' ? (notice.schools.name_ja || notice.schools.name_ko) : lang === 'en' ? (notice.schools.name_en || notice.schools.name_ko) : notice.schools.name_ko)
    : null

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-500 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        {t('back')}
      </button>

      {isLoading && <Spinner className="py-20" />}
      {isError && (
        <EmptyState
          icon={Bell}
          title={t('errorLoad')}
        />
      )}
      {!isLoading && !isError && !notice && (
        <EmptyState
          icon={Bell}
          title={t('errorNotFound')}
        />
      )}
      {!isLoading && !isError && notice && (
        <article className="bg-white border border-gray-200 rounded-2xl p-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {notice.is_pinned && (
                <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                  {t('pinned')}
                </span>
              )}
              {schoolName && <SchoolBadge name={schoolName} />}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {lang === 'ja' ? (notice.title_ja || notice.title_ko) : lang === 'en' ? (notice.title_en || notice.title_ko) : notice.title_ko}
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              {format(new Date(notice.created_at), lang === 'en' ? 'MMM dd, yyyy' : lang === 'ja' ? 'yyyy年MM月dd日' : 'yyyy년 MM월 dd일')}
            </p>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {lang === 'ja' ? (notice.content_ja || notice.content_ko) : lang === 'en' ? (notice.content_en || notice.content_ko) : notice.content_ko}
            </div>
          </div>
        </article>
      )}
    </div>
  )
}
