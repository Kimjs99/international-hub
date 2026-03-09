import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import Spinner from '../../components/UI/Spinner'
import Modal from '../../components/UI/Modal'
import { Plus, Pencil, Trash2 } from 'lucide-react'

const CATEGORIES = ['academic', 'culture', 'activity', 'general']

const EMPTY_FORM = {
  title_ko: '', title_ja: '', title_en: '', category: 'academic',
  start_date: '', end_date: '', location_ko: '', location_ja: '', location_en: '',
  is_online: false, school_id: '',
}

export default function EventManager() {
  const { t } = useTranslation('admin')
  const qc = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [activeTab, setActiveTab] = useState('ko')
  const [formError, setFormError] = useState('')

  const CATEGORY_LABELS = {
    academic: t('event.catAcademic'),
    culture: t('event.catCulture'),
    activity: t('event.catActivity'),
    general: t('event.catGeneral'),
  }

  const { data: events, isLoading } = useQuery({
    queryKey: ['admin', 'events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*, schools(name_ko)')
        .order('start_date', { ascending: false })
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
      const payload = { ...values, school_id: values.school_id || null }
      if (editing) {
        const { error } = await supabase.from('events').update(payload).eq('id', editing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('events').insert(payload)
        if (error) throw error
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'events'] })
      qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
      closeModal()
    },
    onError: (err) => setFormError(err.message || '저장에 실패했습니다.'),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('events').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'events'] })
      qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
    },
  })

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setActiveTab('ko')
    setModalOpen(true)
  }

  const openEdit = (event) => {
    setEditing(event)
    setForm({
      title_ko: event.title_ko ?? '',
      title_ja: event.title_ja ?? '',
      title_en: event.title_en ?? '',
      category: event.category ?? 'academic',
      start_date: event.start_date ?? '',
      end_date: event.end_date ?? '',
      location_ko: event.location_ko ?? '',
      location_ja: event.location_ja ?? '',
      location_en: event.location_en ?? '',
      is_online: event.is_online ?? false,
      school_id: event.school_id ?? '',
    })
    setActiveTab('ko')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
    setForm(EMPTY_FORM)
    setActiveTab('ko')
    setFormError('')
  }

  const handleDelete = (event) => {
    if (!window.confirm(`"${event.title_ko}" ${t('event.confirmDelete')}`)) return
    deleteMutation.mutate(event.id)
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
        <h1 className="text-2xl font-bold text-gray-900">{t('event.title')}</h1>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" />
          {t('event.add')}
        </button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">{t('event.colTitle')}</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">{t('event.colCategory')}</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">{t('event.colStartDate')}</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">{t('event.colSchool')}</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {events?.map(event => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{event.title_ko}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                    {CATEGORY_LABELS[event.category] ?? event.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{event.start_date}</td>
                <td className="px-4 py-3 text-gray-600">{event.schools?.name_ko ?? '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => openEdit(event)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(event)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {events?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">{t('event.empty')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? t('event.edit') : t('event.add')} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex border-b mb-3">
              {[
                { id: 'ko', label: t('common.tabKo') },
                { id: 'ja', label: t('common.tabJa') },
                { id: 'en', label: t('common.tabEn') },
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('event.labelTitleKo')} *</label>
                  <input type="text" value={form.title_ko} onChange={set('title_ko')} required
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('event.labelLocationKo')}</label>
                  <input type="text" value={form.location_ko} onChange={set('location_ko')}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
            )}
            {activeTab === 'ja' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('event.labelTitleJa')}</label>
                  <input type="text" value={form.title_ja} onChange={set('title_ja')}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('event.labelLocationJa')}</label>
                  <input type="text" value={form.location_ja} onChange={set('location_ja')}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
            )}
            {activeTab === 'en' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('event.labelTitleEn')}</label>
                  <input type="text" value={form.title_en} onChange={set('title_en')}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('event.labelLocationEn')}</label>
                  <input type="text" value={form.location_en} onChange={set('location_en')}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('event.colCategory')} *</label>
              <select value={form.category} onChange={set('category')} required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('event.colSchool')}</label>
              <select value={form.school_id} onChange={set('school_id')}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">{t('common.all')}</option>
                {schools?.map(s => (
                  <option key={s.id} value={s.id}>{s.name_ko}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('event.labelStartDate')} *</label>
              <input type="date" value={form.start_date} onChange={set('start_date')} required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('event.labelEndDate')}</label>
              <input type="date" value={form.end_date} onChange={set('end_date')}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_online" checked={form.is_online} onChange={setCheck('is_online')}
              className="w-4 h-4 rounded border-gray-300 text-primary-500" />
            <label htmlFor="is_online" className="text-sm text-gray-700">{t('event.labelOnline')}</label>
          </div>
          {formError && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{formError}</p>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal}
              className="px-4 py-2 rounded-lg border text-sm font-medium text-gray-700 hover:bg-gray-50">
              {t('common.cancel')}
            </button>
            <button type="submit" disabled={upsertMutation.isPending}
              className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
              {upsertMutation.isPending ? t('common.saving') : editing ? t('common.edit') : t('common.add')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
