import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import Spinner from '../../components/UI/Spinner'
import Modal from '../../components/UI/Modal'
import { Plus, Pencil, Trash2, Upload } from 'lucide-react'

const CATEGORIES = ['curriculum', 'research', 'presentation', 'report', 'other']
const CATEGORY_LABELS = { curriculum: '교육과정', research: '연구자료', presentation: '발표자료', report: '보고서', other: '기타' }
const FILE_TYPES = ['pdf', 'pptx', 'docx']

const ALLOWED_MIME = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const EMPTY_FORM = {
  title_ko: '', title_ja: '', title_en: '', category: 'research', file_type: 'pdf', school_id: '',
}

const handleFileUpload = async (file) => {
  if (!ALLOWED_MIME.includes(file.type)) throw new Error('허용되지 않는 파일 형식입니다. (PDF, PPTX, DOCX만 가능)')
  if (file.size > 50 * 1024 * 1024) throw new Error('파일 크기는 50MB 이하여야 합니다.')
  const path = `${Date.now()}_${file.name}`
  const { error } = await supabase.storage.from('materials').upload(path, file)
  if (error) throw error
  const { data: { publicUrl } } = supabase.storage.from('materials').getPublicUrl(path)
  return publicUrl
}

export default function MaterialManager() {
  const qc = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState('')
  const [activeTab, setActiveTab] = useState('ko')

  const { data: materials, isLoading } = useQuery({
    queryKey: ['admin', 'materials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('materials')
        .select('*, schools(name_ko)')
        .order('created_at', { ascending: false })
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

  const upsertMutation = useMutation({
    mutationFn: async ({ values, uploadFile }) => {
      let fileUrl = editing?.file_url ?? null
      if (uploadFile) {
        fileUrl = await handleFileUpload(uploadFile)
      }
      const payload = { ...values, school_id: values.school_id || null, file_url: fileUrl }
      if (editing) {
        const { error } = await supabase.from('materials').update(payload).eq('id', editing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('materials').insert(payload)
        if (error) throw error
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'materials'] })
      closeModal()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('materials').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'materials'] }),
  })

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFile(null)
    setFileError('')
    setActiveTab('ko')
    setModalOpen(true)
  }

  const openEdit = (material) => {
    setEditing(material)
    setForm({
      title_ko: material.title_ko ?? '',
      title_ja: material.title_ja ?? '',
      title_en: material.title_en ?? '',
      category: material.category ?? 'research',
      file_type: material.file_type ?? 'pdf',
      school_id: material.school_id ?? '',
    })
    setFile(null)
    setFileError('')
    setActiveTab('ko')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
    setForm(EMPTY_FORM)
    setFile(null)
    setFileError('')
    setActiveTab('ko')
  }

  const handleDelete = (material) => {
    if (!window.confirm(`"${material.title_ko}" 자료를 삭제하시겠습니까?`)) return
    deleteMutation.mutate(material.id)
  }

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    setFileError('')
    if (!selected) { setFile(null); return }
    if (!ALLOWED_MIME.includes(selected.type)) {
      setFileError('PDF, PPTX, DOCX 파일만 업로드할 수 있습니다.')
      setFile(null)
      return
    }
    if (selected.size > 50 * 1024 * 1024) {
      setFileError('파일 크기는 50MB 이하여야 합니다.')
      setFile(null)
      return
    }
    setFile(selected)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!editing && !file) { setFileError('파일을 선택해주세요.'); return }
    upsertMutation.mutate({ values: form, uploadFile: file })
  }

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  if (isLoading) return <Spinner className="py-20" />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">자료 관리</h1>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" />
          자료 추가
        </button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">제목 (한)</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">카테고리</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">파일 형식</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">다운로드</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {materials?.map(material => (
              <tr key={material.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{material.title_ko}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700">
                    {CATEGORY_LABELS[material.category] ?? material.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 uppercase">{material.file_type}</td>
                <td className="px-4 py-3 text-gray-600">{material.download_count ?? 0}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => openEdit(material)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(material)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {materials?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">등록된 자료가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? '자료 수정' : '자료 추가'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex border-b mb-3">
              {[
                { id: 'ko', label: '🇰🇷 한국어' },
                { id: 'ja', label: '🇯🇵 日本語' },
                { id: 'en', label: '🇬🇧 English' },
              ].map(tab => (
                <button key={tab.id} type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>
            {activeTab === 'ko' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목 (한국어) *</label>
                <input type="text" value={form.title_ko} onChange={set('title_ko')} required
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            )}
            {activeTab === 'ja' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목 (일본어)</label>
                <input type="text" value={form.title_ja} onChange={set('title_ja')}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            )}
            {activeTab === 'en' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title (English)</label>
                <input type="text" value={form.title_en} onChange={set('title_en')}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 *</label>
              <select value={form.category} onChange={set('category')} required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">파일 형식 *</label>
              <select value={form.file_type} onChange={set('file_type')} required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                {FILE_TYPES.map(t => (
                  <option key={t} value={t}>{t.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">학교</label>
              <select value={form.school_id} onChange={set('school_id')}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">전체</option>
                {schools?.map(s => (
                  <option key={s.id} value={s.id}>{s.name_ko}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              파일 업로드 {!editing && '*'}
            </label>
            <label className="flex items-center gap-3 border-2 border-dashed rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-500">
                {file ? file.name : editing ? '새 파일 선택 (선택사항)' : 'PDF, PPTX, DOCX — 최대 50MB'}
              </span>
              <input type="file" accept=".pdf,.pptx,.docx" className="hidden" onChange={handleFileChange} />
            </label>
            {fileError && <p className="mt-1 text-xs text-red-600">{fileError}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal}
              className="px-4 py-2 rounded-lg border text-sm font-medium text-gray-700 hover:bg-gray-50">
              취소
            </button>
            <button type="submit" disabled={upsertMutation.isPending}
              className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
              {upsertMutation.isPending ? '업로드 중...' : editing ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
