import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, Image } from 'lucide-react'
import { useAlbumPhotos } from '../../hooks/useGallery'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import PhotoGrid from '../../components/UI/PhotoGrid'
import Spinner from '../../components/UI/Spinner'
import EmptyState from '../../components/UI/EmptyState'

function useAlbum(albumId) {
  return useQuery({
    queryKey: ['gallery_albums', albumId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_albums')
        .select('*, schools(name_ko, name_ja)')
        .eq('id', albumId)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!albumId,
  })
}

export default function AlbumDetail() {
  const { albumId } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation('gallery')
  const lang = i18n.language

  const { data: album, isLoading: albumLoading } = useAlbum(albumId)
  const { data: photos = [], isLoading: photosLoading, isError } = useAlbumPhotos(albumId)

  const isLoading = albumLoading || photosLoading

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-500 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        {t('back')}
      </button>

      {album && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {lang === 'ko' ? album.title_ko : album.title_ja}
          </h1>
          {album.taken_date && (
            <p className="mt-2 text-gray-500">{album.taken_date}</p>
          )}
          {photos.length > 0 && (
            <p className="mt-1 text-sm text-gray-400">
              {photos.length}{t('photos')}
            </p>
          )}
        </div>
      )}

      {isLoading && <Spinner className="py-20" />}
      {isError && (
        <EmptyState
          icon={Image}
          title={lang === 'ko' ? '사진을 불러오지 못했습니다' : '写真の取得に失敗しました'}
        />
      )}
      {!isLoading && !isError && photos.length === 0 && (
        <EmptyState
          icon={Image}
          title={lang === 'ko' ? '등록된 사진이 없습니다' : '登録された写真はありません'}
        />
      )}
      {!isLoading && !isError && photos.length > 0 && (
        <PhotoGrid photos={photos} lang={lang} />
      )}
    </div>
  )
}
