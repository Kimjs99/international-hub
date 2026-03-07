import clsx from 'clsx'

const variants = {
  academic: 'bg-blue-100 text-blue-800',
  culture:  'bg-purple-100 text-purple-800',
  activity: 'bg-green-100 text-green-800',
  general:  'bg-gray-100 text-gray-700',
  pinned:   'bg-red-100 text-red-700',
}

export default function Badge({ label, type = 'general', className }) {
  return (
    <span className={clsx(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      variants[type] ?? variants.general,
      className
    )}>
      {label}
    </span>
  )
}
