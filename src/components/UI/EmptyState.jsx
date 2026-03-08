import { Inbox } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function EmptyState({ title, description = '', icon: Icon = Inbox }) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <Icon className="w-12 h-12 mb-4 opacity-40" />
      <p className="text-lg font-medium text-gray-500">{title ?? t('status.empty')}</p>
      {description && <p className="mt-1 text-sm">{description}</p>}
    </div>
  )
}
