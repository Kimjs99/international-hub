import { useState } from 'react'
import LightboxViewer from './LightboxViewer'

export default function PhotoGrid({ photos = [], lang = 'ko' }) {
  const [lightboxIndex, setLightboxIndex] = useState(null)

  if (photos.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setLightboxIndex(i)}
            className="aspect-square overflow-hidden rounded-lg bg-gray-100 hover:opacity-90 transition-opacity"
          >
            <img
              src={photo.photo_url}
              alt={lang === 'ko' ? photo.caption_ko : photo.caption_ja}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <LightboxViewer
          photos={photos}
          currentIndex={lightboxIndex}
          lang={lang}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex(i => Math.max(0, i - 1))}
          onNext={() => setLightboxIndex(i => Math.min(photos.length - 1, i + 1))}
        />
      )}
    </>
  )
}
