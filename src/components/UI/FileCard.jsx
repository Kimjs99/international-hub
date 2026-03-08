import { Download } from 'lucide-react'
import Badge from './Badge'

const FILE_ICONS = {
  pdf:   '📄',
  pptx:  '📊',
  docx:  '📝',
  image: '🖼️',
  other: '📎',
}

function formatFileSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

export default function FileCard({ material, lang = 'ko', onDownload }) {
  const title = lang === 'ja' ? (material.title_ja || material.title_ko) : lang === 'en' ? (material.title_en || material.title_ko) : material.title_ko
  const description = lang === 'ja' ? (material.description_ja || material.description_ko) : lang === 'en' ? (material.description_en || material.description_ko) : material.description_ko

  return (
    <div className="bg-white border rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <span className="text-3xl">{FILE_ICONS[material.file_type] ?? '📎'}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
          {description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{description}</p>}
          <div className="flex items-center gap-2 mt-2">
            <Badge label={material.category} type={material.category} />
            {material.file_size && (
              <span className="text-xs text-gray-400">{formatFileSize(material.file_size)}</span>
            )}
            <span className="text-xs text-gray-400">
              <Download className="w-3 h-3 inline mr-0.5" />{material.download_count}
            </span>
          </div>
        </div>
        <button
          onClick={() => onDownload?.(material)}
          className="shrink-0 flex items-center gap-1 px-3 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
