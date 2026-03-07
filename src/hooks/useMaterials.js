import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useMaterials(filters = {}) {
  return useQuery({
    queryKey: ['materials', filters],
    queryFn: async () => {
      let query = supabase
        .from('materials')
        .select('*, schools(name_ko, name_ja)')
      if (filters.category) query = query.eq('category', filters.category)
      if (filters.schoolId) query = query.eq('school_id', filters.schoolId)
      if (filters.search) query = query.ilike('title_ko', `%${filters.search}%`)
      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
}
