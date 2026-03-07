import { useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function LightboxViewer({ photos, currentIndex, onClose, onPrev, onNext, lang = 'ko' }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') onPrev?.()
      if (e.key === 'ArrowRight') onNext?.()
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onPrev, onNext, onClose])

  const photo = photos[currentIndex]
  if (!photo) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      <button onClick={onClose} className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full">
        <X className="w-6 h-6" />
      </button>
      <button onClick={onPrev} disabled={currentIndex === 0}
        className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-full disabled:opacity-30">
        <ChevronLeft className="w-8 h-8" />
      </button>
      <div className="max-w-5xl max-h-screen p-16 flex flex-col items-center gap-4">
        <img src={photo.photo_url} alt="" className="max-h-[80vh] object-contain rounded-lg" />
        {(photo.caption_ko || photo.caption_ja) && (
          <p className="text-white/80 text-sm text-center">
            {lang === 'ko' ? photo.caption_ko : photo.caption_ja}
          </p>
        )}
        <p className="text-white/40 text-xs">{currentIndex + 1} / {photos.length}</p>
      </div>
      <button onClick={onNext} disabled={currentIndex === photos.length - 1}
        className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-full disabled:opacity-30">
        <ChevronRight className="w-8 h-8" />
      </button>
    </div>
  )
}
