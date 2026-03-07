import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useEvents({ category, schoolId } = {}) {
  return useQuery({
    queryKey: ['events', { category, schoolId }],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('*, schools(name_ko, name_ja)')
        .order('start_date')
      if (category) query = query.eq('category', category)
      if (schoolId) query = query.eq('school_id', schoolId)
      const { data, error } = await query
      if (error) throw error
      return data
    },
  })
}

export function useEvent(id) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*, schools(name_ko, name_ja)')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}
