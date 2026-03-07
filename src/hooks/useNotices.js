import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useNotices({ schoolId } = {}) {
  return useQuery({
    queryKey: ['notices', { schoolId }],
    queryFn: async () => {
      let query = supabase
        .from('notices')
        .select('*, schools(name_ko, name_ja)')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
      if (schoolId) query = query.eq('target_school_id', schoolId)
      const { data, error } = await query
      if (error) throw error
      return data
    },
  })
}

export function useNotice(id) {
  return useQuery({
    queryKey: ['notices', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notices')
        .select('*, schools(name_ko, name_ja)')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}
