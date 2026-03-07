const SCHOOL_COLORS = [
  'bg-blue-100 text-blue-800 border-blue-200',
  'bg-rose-100 text-rose-800 border-rose-200',
  'bg-emerald-100 text-emerald-800 border-emerald-200',
  'bg-amber-100 text-amber-800 border-amber-200',
  'bg-violet-100 text-violet-800 border-violet-200',
]

export default function SchoolBadge({ name, index = 0 }) {
  const color = SCHOOL_COLORS[index % SCHOOL_COLORS.length]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${color}`}>
      {name}
    </span>
  )
}
