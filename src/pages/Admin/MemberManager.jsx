import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import Spinner from '../../components/UI/Spinner'
import { Users, Info } from 'lucide-react'

const ROLES = ['admin', 'manager', 'member']

export default function MemberManager() {
  const { t } = useTranslation('admin')
  const qc = useQueryClient()
  const [showInviteInfo, setShowInviteInfo] = useState(false)

  const ROLE_LABELS = {
    admin: t('member.roleAdmin'),
    manager: t('member.roleManager'),
    member: t('member.roleMember'),
  }

  const { data: members, isLoading } = useQuery({
    queryKey: ['admin', 'members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_school_roles')
        .select('*, schools(name_ko)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      const { error } = await supabase
        .from('user_school_roles')
        .update({ role })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'members'] }),
  })

  if (isLoading) return <Spinner className="py-20" />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('member.title')}</h1>
        <button
          onClick={() => setShowInviteInfo(!showInviteInfo)}
          className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          <Users className="w-4 h-4" />
          {t('member.invite')}
        </button>
      </div>

      {showInviteInfo && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">{t('member.inviteNotice')}</p>
            <p className="text-sm text-blue-700 mt-1">{t('member.inviteDesc')}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">{t('member.colUserId')}</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">{t('member.colSchool')}</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">{t('member.colRole')}</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">{t('member.colDate')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members?.map(member => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-600">{member.user_id}</td>
                <td className="px-4 py-3 text-gray-700">{member.schools?.name_ko ?? '-'}</td>
                <td className="px-4 py-3">
                  <select
                    value={member.role}
                    onChange={(e) => updateRoleMutation.mutate({ id: member.id, role: e.target.value })}
                    className="border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500">
                    {ROLES.map(r => (
                      <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {member.created_at ? new Date(member.created_at).toLocaleDateString('ko-KR') : '-'}
                </td>
              </tr>
            ))}
            {members?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">{t('member.empty')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
