import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import Spinner from '../../components/UI/Spinner'
import Modal from '../../components/UI/Modal'
import { Plus, Pencil, Trash2 } from 'lucide-react'

const EMPTY_FORM = {
  name_ko: '', name_ja: '', name_en: '', country: 'KR', city: '',
  description_ko: '', description_ja: '', description_en: '',
  contact_name: '', contact_email: '', website_url: '',
}

export default function SchoolManager() {
  const qc = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null) // null = 추가, object = 수정
  const [form, setForm] = useState(EMPTY_FORM)
  const [activeTab, setActiveTab] = useState('ko')

  const { data: schools, isLoading } = useQuery({
    queryKey: ['admin', 'schools'],
    queryFn: async () => {
      const { data, error } = await supabase.from('schools').select('*').order('name_ko')
      if (error) throw error
      return data
    },
  })

  const upsertMutation = useMutation({
    mutationFn: async (values) => {
      if (editing) {
        const { error } = await supabase.from('schools').update(values).eq('id', editing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('schools').insert(values)
        if (error) throw error
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'schools'] })
      closeModal()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('schools').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'schools'] }),
  })

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setActiveTab('ko')
    setModalOpen(true)
  }

  const openEdit = (school) => {
    setEditing(school)
    setForm({
      name_ko: school.name_ko ?? '',
      name_ja: school.name_ja ?? '',
      name_en: school.name_en ?? '',
      country: school.country ?? 'KR',
      city: school.city ?? '',
      description_ko: school.description_ko ?? '',
      description_ja: school.description_ja ?? '',
      description_en: school.description_en ?? '',
      contact_name: school.contact_name ?? '',
      contact_email: school.contact_email ?? '',
      website_url: school.website_url ?? '',
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

  const handleDelete = (school) => {
    if (!window.confirm(`"${school.name_ko}" 학교를 삭제하시겠습니까?`)) return
    deleteMutation.mutate(school.id)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    upsertMutation.mutate(form)
  }

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  if (isLoading) return <Spinner className="py-20" />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">학교 관리</h1>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" />
          학교 추가
        </button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">학교명 (한)</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">국가</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">도시</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">담당자</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {schools?.map(school => (
              <tr key={school.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{school.name_ko}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    school.country === 'KR' ? 'bg-red-50 text-red-700' : 'bg-pink-50 text-pink-700'
                  }`}>
                    {school.country === 'KR' ? '한국' : '일본'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{school.city}</td>
                <td className="px-4 py-3 text-gray-600">{school.contact_name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => openEdit(school)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(school)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {schools?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">등록된 학교가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? '학교 수정' : '학교 추가'} size="lg">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">학교명 (한국어) *</label>
                  <input type="text" value={form.name_ko} onChange={set('name_ko')} required
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">학교 소개 (한국어)</label>
                  <textarea value={form.description_ko} onChange={set('description_ko')} rows={3}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
            )}
            {activeTab === 'ja' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">학교명 (일본어)</label>
                  <input type="text" value={form.name_ja} onChange={set('name_ja')}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">학교 소개 (일본어)</label>
                  <textarea value={form.description_ja} onChange={set('description_ja')} rows={3}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
            )}
            {activeTab === 'en' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Name (English)</label>
                  <input type="text" value={form.name_en} onChange={set('name_en')}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Description (English)</label>
                  <textarea value={form.description_en} onChange={set('description_en')} rows={3}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">국가 *</label>
              <select value={form.country} onChange={set('country')} required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="KR">한국</option>
                <option value="JP">일본</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">도시</label>
              <input type="text" value={form.city} onChange={set('city')}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">담당자 이름</label>
              <input type="text" value={form.contact_name} onChange={set('contact_name')}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">담당자 이메일</label>
              <input type="email" value={form.contact_email} onChange={set('contact_email')}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">웹사이트 URL</label>
            <input type="url" value={form.website_url} onChange={set('website_url')}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal}
              className="px-4 py-2 rounded-lg border text-sm font-medium text-gray-700 hover:bg-gray-50">
              취소
            </button>
            <button type="submit" disabled={upsertMutation.isPending}
              className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
              {upsertMutation.isPending ? '저장 중...' : editing ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
