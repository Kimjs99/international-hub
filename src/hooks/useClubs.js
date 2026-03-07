import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useClubs(filters = {}) {
  return useQuery({
    queryKey: ['club_groups', filters],
    queryFn: async () => {
      let query = supabase
        .from('club_groups')
        .select('*, schools(name_ko, name_ja)')
        .eq('is_active', true)
      if (filters.category) query = query.eq('category', filters.category)
      if (filters.schoolId) query = query.eq('school_id', filters.schoolId)
      const { data, error } = await query.order('name_ko')
      if (error) throw error
      return data ?? []
    },
  })
}
