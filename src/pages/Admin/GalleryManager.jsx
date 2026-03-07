import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import Spinner from '../../components/UI/Spinner'
import Modal from '../../components/UI/Modal'
import { Plus, ChevronLeft, Trash2, Upload, Image } from 'lucide-react'

const EMPTY_ALBUM_FORM = {
  title_ko: '', title_ja: '', taken_date: '', school_id: '', is_public: true,
}

const uploadPhotos = async (albumId, files) => {
  const uploads = Array.from(files).map(async (file, i) => {
    if (file.size > 5 * 1024 * 1024) throw new Error('이미지는 5MB 이하여야 합니다.')
    const path = `${albumId}/${Date.now()}_${i}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('gallery').upload(path, file)
    if (error) throw error
    const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(path)
    return { album_id: albumId, photo_url: publicUrl, order_index: i }
  })
  const photos = await Promise.all(uploads)
  await supabase.from('gallery_photos').insert(photos)
}

export default function GalleryManager() {
  const qc = useQueryClient()
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [albumModalOpen, setAlbumModalOpen] = useState(false)
  const [albumForm, setAlbumForm] = useState(EMPTY_ALBUM_FORM)
  const [uploadError, setUploadError] = useState('')

  const { data: albums, isLoading: albumsLoading } = useQuery({
    queryKey: ['admin', 'gallery-albums'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_albums')
        .select('*, schools(name_ko), gallery_photos(count)')
        .order('taken_date', { ascending: false })
      if (error) throw error
      return data
    },
  })

  const { data: schools } = useQuery({
    queryKey: ['admin', 'schools-select'],
    queryFn: async () => {
      const { data, error } = await supabase.from('schools').select('id, name_ko').order('name_ko')
      if (error) throw error
      return data
    },
  })

  const { data: photos, isLoading: photosLoading } = useQuery({
    queryKey: ['admin', 'gallery-photos', selectedAlbum?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_photos')
        .select('*')
        .eq('album_id', selectedAlbum.id)
        .order('order_index')
      if (error) throw error
      return data
    },
    enabled: !!selectedAlbum,
  })

  const createAlbumMutation = useMutation({
    mutationFn: async (values) => {
      const payload = { ...values, school_id: values.school_id || null }
      const { error } = await supabase.from('gallery_albums').insert(payload)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'gallery-albums'] })
      setAlbumModalOpen(false)
      setAlbumForm(EMPTY_ALBUM_FORM)
    },
  })

  const deleteAlbumMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('gallery_albums').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'gallery-albums'] }),
  })

  const deletePhotoMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('gallery_photos').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'gallery-photos', selectedAlbum?.id] }),
  })

  const uploadMutation = useMutation({
    mutationFn: async ({ albumId, files }) => {
      await uploadPhotos(albumId, files)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'gallery-photos', selectedAlbum?.id] })
      qc.invalidateQueries({ queryKey: ['admin', 'gallery-albums'] })
      setUploadError('')
    },
    onError: (err) => setUploadError(err.message),
  })

  const handleAlbumSubmit = (e) => {
    e.preventDefault()
    createAlbumMutation.mutate(albumForm)
  }

  const handleDeleteAlbum = (album) => {
    if (!window.confirm(`"${album.title_ko}" 앨범을 삭제하시겠습니까?`)) return
    deleteAlbumMutation.mutate(album.id)
  }

  const handleDeletePhoto = (photo) => {
    if (!window.confirm('이 사진을 삭제하시겠습니까?')) return
    deletePhotoMutation.mutate(photo.id)
  }

  const handlePhotoUpload = (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploadError('')
    uploadMutation.mutate({ albumId: selectedAlbum.id, files })
    e.target.value = ''
  }

  const setAlbum = (field) => (e) => setAlbumForm(prev => ({ ...prev, [field]: e.target.value }))
  const setAlbumCheck = (field) => (e) => setAlbumForm(prev => ({ ...prev, [field]: e.target.checked }))

  if (selectedAlbum) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setSelectedAlbum(null)}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{selectedAlbum.title_ko}</h1>
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-3 border-2 border-dashed rounded-xl p-6 cursor-pointer hover:bg-gray-50 transition-colors">
            <Upload className="w-6 h-6 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">사진 업로드 (다중 선택 가능)</p>
              <p className="text-xs text-gray-400 mt-0.5">이미지 파일 — 각 5MB 이하</p>
            </div>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload}
              disabled={uploadMutation.isPending} />
          </label>
          {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
          {uploadMutation.isPending && <p className="mt-2 text-sm text-primary-600">업로드 중...</p>}
        </div>

        {photosLoading ? (
          <Spinner className="py-20" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos?.map(photo => (
              <div key={photo.id} className="relative group rounded-xl overflow-hidden aspect-square bg-gray-100">
                <img src={photo.photo_url} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => handleDeletePhoto(photo)}
                    className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {photos?.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
                <Image className="w-12 h-12 mb-2" />
                <p className="text-sm">사진이 없습니다. 업로드해주세요.</p>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  if (albumsLoading) return <Spinner className="py-20" />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">사진 관리</h1>
        <button onClick={() => setAlbumModalOpen(true)}
          className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" />
          앨범 생성
        </button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">앨범 제목 (한)</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">촬영일</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">학교</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">공개</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {albums?.map(album => (
              <tr key={album.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedAlbum(album)}>
                <td className="px-4 py-3 font-medium text-gray-900">{album.title_ko}</td>
                <td className="px-4 py-3 text-gray-600">{album.taken_date ?? '-'}</td>
                <td className="px-4 py-3 text-gray-600">{album.schools?.name_ko ?? '-'}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    album.is_public ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {album.is_public ? '공개' : '비공개'}
                  </span>
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => handleDeleteAlbum(album)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {albums?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">등록된 앨범이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={albumModalOpen} onClose={() => { setAlbumModalOpen(false); setAlbumForm(EMPTY_ALBUM_FORM) }}
        title="앨범 생성">
        <form onSubmit={handleAlbumSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">앨범 제목 (한국어) *</label>
              <input type="text" value={albumForm.title_ko} onChange={setAlbum('title_ko')} required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">앨범 제목 (일본어)</label>
              <input type="text" value={albumForm.title_ja} onChange={setAlbum('title_ja')}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">촬영일</label>
              <input type="date" value={albumForm.taken_date} onChange={setAlbum('taken_date')}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">학교</label>
              <select value={albumForm.school_id} onChange={setAlbum('school_id')}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">전체</option>
                {schools?.map(s => (
                  <option key={s.id} value={s.id}>{s.name_ko}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_public" checked={albumForm.is_public} onChange={setAlbumCheck('is_public')}
              className="w-4 h-4 rounded border-gray-300 text-primary-500" />
            <label htmlFor="is_public" className="text-sm text-gray-700">공개 앨범</label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setAlbumModalOpen(false); setAlbumForm(EMPTY_ALBUM_FORM) }}
              className="px-4 py-2 rounded-lg border text-sm font-medium text-gray-700 hover:bg-gray-50">
              취소
            </button>
            <button type="submit" disabled={createAlbumMutation.isPending}
              className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
              {createAlbumMutation.isPending ? '생성 중...' : '앨범 생성'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
