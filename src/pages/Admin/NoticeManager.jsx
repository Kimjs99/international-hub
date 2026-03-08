import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import Spinner from '../../components/UI/Spinner'
import Modal from '../../components/UI/Modal'
import { Plus, Pencil, Trash2, Pin } from 'lucide-react'

const EMPTY_FORM = {
  title_ko: '', title_ja: '', title_en: '',
  content_ko: '', content_ja: '', content_en: '',
  is_pinned: false, target_school_id: '',
}

export default function NoticeManager() {
  const qc = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [activeTab, setActiveTab] = useState('ko')

  const { data: notices, isLoading } = useQuery({
    queryKey: ['admin', 'notices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notices')
        .select('*, schools(name_ko)')
        .order('is_pinned', { ascending: false })
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
    mutationFn: async (values) => {
      const payload = { ...values, target_school_id: values.target_school_id || null }
      if (editing) {
        const { error } = await supabase.from('notices').update(payload).eq('id', editing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('notices').insert(payload)
        if (error) throw error
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'notices'] })
      closeModal()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('notices').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'notices'] }),
  })

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setActiveTab('ko')
    setModalOpen(true)
  }

  const openEdit = (notice) => {
    setEditing(notice)
    setForm({
      title_ko: notice.title_ko ?? '',
      title_ja: notice.title_ja ?? '',
      title_en: notice.title_en ?? '',
      content_ko: notice.content_ko ?? '',
      content_ja: notice.content_ja ?? '',
      content_en: notice.content_en ?? '',
      is_pinned: notice.is_pinned ?? false,
      target_school_id: notice.target_school_id ?? '',
    })
    setActiveTab('ko')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
    setForm(EMPTY_FORM)
    setActiveTab('ko')
  }

  const handleDelete = (notice) => {
    if (!window.confirm(`"${notice.title_ko}" 공지를 삭제하시겠습니까?`)) return
    deleteMutation.mutate(notice.id)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    upsertMutation.mutate(form)
  }

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))
  const setCheck = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.checked }))

  if (isLoading) return <Spinner className="py-20" />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">공지 관리</h1>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" />
          공지 작성
        </button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">제목 (한)</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">고정</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">대상 학교</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">작성일</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {notices?.map(notice => (
              <tr key={notice.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-2">
                  {notice.is_pinned && <Pin className="w-3 h-3 text-primary-500 flex-shrink-0" />}
                  {notice.title_ko}
                </td>
                <td className="px-4 py-3">
                  {notice.is_pinned ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-50 text-primary-700">고정</span>
                  ) : '-'}
                </td>
                <td className="px-4 py-3 text-gray-600">{notice.schools?.name_ko ?? '전체'}</td>
                <td className="px-4 py-3 text-gray-600">
                  {notice.created_at ? new Date(notice.created_at).toLocaleDateString('ko-KR') : '-'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => openEdit(notice)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(notice)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {notices?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">등록된 공지가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? '공지 수정' : '공지 작성'} size="lg">
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
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">제목 (한국어) *</label>
                  <input type="text" value={form.title_ko} onChange={set('title_ko')} required
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">내용 (한국어)</label>
                  <textarea value={form.content_ko} onChange={set('content_ko')} rows={6}
                    placeholder="한국어 내용을 입력하세요"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
            )}
            {activeTab === 'ja' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">제목 (일본어)</label>
                  <input type="text" value={form.title_ja} onChange={set('title_ja')}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">내용 (일본어)</label>
                  <textarea value={form.content_ja} onChange={set('content_ja')} rows={6}
                    placeholder="일본어 내용을 입력하세요"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
            )}
            {activeTab === 'en' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title (English)</label>
                  <input type="text" value={form.title_en} onChange={set('title_en')}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content (English)</label>
                  <textarea value={form.content_en} onChange={set('content_en')} rows={6}
                    placeholder="Enter content in English"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_pinned" checked={form.is_pinned} onChange={setCheck('is_pinned')}
                className="w-4 h-4 rounded border-gray-300 text-primary-500" />
              <label htmlFor="is_pinned" className="text-sm text-gray-700">공지 고정</label>
            </div>
            <div className="flex-1">
              <select value={form.target_school_id} onChange={set('target_school_id')}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">전체 학교 대상</option>
                {schools?.map(s => (
                  <option key={s.id} value={s.id}>{s.name_ko}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal}
              className="px-4 py-2 rounded-lg border text-sm font-medium text-gray-700 hover:bg-gray-50">
              취소
            </button>
            <button type="submit" disabled={upsertMutation.isPending}
              className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
              {upsertMutation.isPending ? '저장 중...' : editing ? '수정' : '등록'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
