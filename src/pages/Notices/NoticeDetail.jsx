import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, Bell } from 'lucide-react'
import { format } from 'date-fns'
import { useNotice } from '../../hooks/useNotices'
import SchoolBadge from '../../components/UI/SchoolBadge'
import Spinner from '../../components/UI/Spinner'
import EmptyState from '../../components/UI/EmptyState'

export default function NoticeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation('notices')
  const lang = i18n.language

  const { data: notice, isLoading, isError } = useNotice(id)

  const schoolName = notice?.schools
    ? (lang === 'ko' ? notice.schools.name_ko : notice.schools.name_ja)
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
          title={lang === 'ko' ? '공지사항을 불러오지 못했습니다' : 'お知らせの取得に失敗しました'}
        />
      )}
      {!isLoading && !isError && !notice && (
        <EmptyState
          icon={Bell}
          title={lang === 'ko' ? '존재하지 않는 공지사항입니다' : '存在しないお知らせです'}
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
              {lang === 'ko' ? notice.title_ko : notice.title_ja}
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              {format(new Date(notice.created_at), 'yyyy년 MM월 dd일')}
            </p>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {lang === 'ko' ? notice.content_ko : notice.content_ja}
            </div>
          </div>
        </article>
      )}
    </div>
  )
}
