import { Inbox } from 'lucide-react'

export default function EmptyState({ title = '데이터가 없습니다', description = '', icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <Icon className="w-12 h-12 mb-4 opacity-40" />
      <p className="text-lg font-medium text-gray-500">{title}</p>
      {description && <p className="mt-1 text-sm">{description}</p>}
    </div>
  )
}
