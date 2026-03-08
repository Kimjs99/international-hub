import { useLanguage } from '../../context/LanguageContext'

const LANGS = [
  { id: 'ko', label: '한국어' },
  { id: 'ja', label: '日本語' },
  { id: 'en', label: 'English' },
]

export default function LanguageToggle() {
  const { lang, switchLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
      {LANGS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => switchLanguage(id)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
            lang === id ? 'bg-white shadow text-primary-700 font-bold' : 'text-gray-500'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
