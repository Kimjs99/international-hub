import { useLanguage } from '../../context/LanguageContext'

export default function LanguageToggle() {
  const { lang, switchLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
      <button
        onClick={() => switchLanguage('ko')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
          lang === 'ko' ? 'bg-white shadow text-primary-700 font-bold' : 'text-gray-500'
        }`}
      >
        한국어
      </button>
      <button
        onClick={() => switchLanguage('ja')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
          lang === 'ja' ? 'bg-white shadow text-primary-700 font-bold' : 'text-gray-500'
        }`}
      >
        日本語
      </button>
    </div>
  )
}
