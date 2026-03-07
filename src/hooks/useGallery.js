import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useAlbums(filters = {}) {
  return useQuery({
    queryKey: ['gallery_albums', filters],
    queryFn: async () => {
      let query = supabase
        .from('gallery_albums')
        .select('*, schools(name_ko, name_ja)')
        .eq('is_public', true)
      if (filters.schoolId) query = query.eq('school_id', filters.schoolId)
      const { data } = await query.order('taken_date', { ascending: false })
      return data ?? []
    },
  })
}

export function useAlbumPhotos(albumId) {
  return useQuery({
    queryKey: ['gallery_photos', albumId],
    queryFn: async () => {
      const { data } = await supabase
        .from('gallery_photos')
        .select('*')
        .eq('album_id', albumId)
        .order('order_index')
      return data ?? []
    },
    enabled: !!albumId,
  })
}
