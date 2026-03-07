import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useSchools() {
  return useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('country')
      if (error) throw error
      return data
    },
  })
}

export function useSchool(id) {
  return useQuery({
    queryKey: ['schools', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schools')
        .select('*, events(*), materials(*), gallery_albums(*)')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}
