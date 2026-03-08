import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const SLIDES = [
  {
    titleKo: '국제교류 연구학교 허브',
    titleJa: '国際交流研究校ハブ',
    titleEn: 'International Exchange School Hub',
    subtitleKo: '한국과 일본 학교 간 배움과 문화를 함께 나누는 플랫폼',
    subtitleJa: '韓国と日本の学校が共に学び、文化を分かち合うプラットフォーム',
    subtitleEn: 'A platform for sharing learning and culture between Korean and Japanese schools',
    bg: 'from-primary-900 via-primary-700 to-primary-500',
    link: '/schools',
  },
  {
    titleKo: '학술교류 프로그램',
    titleJa: '学術交流プログラム',
    titleEn: 'Academic Exchange Program',
    subtitleKo: '공동 연구와 발표를 통해 지식의 경계를 넓힙니다',
    subtitleJa: '共同研究と発表を通じて知識の境界を広げます',
    subtitleEn: 'Expanding the boundaries of knowledge through joint research and presentations',
    bg: 'from-purple-900 via-purple-700 to-purple-500',
    link: '/academic/schedule',
  },
  {
    titleKo: '문화교류 행사',
    titleJa: '文化交流行事',
    titleEn: 'Cultural Exchange Events',
    subtitleKo: '서로의 문화를 이해하고 우정을 쌓는 특별한 시간',
    subtitleJa: 'お互いの文化を理解し、友情を育む特別な時間',
    subtitleEn: "Special moments to understand each other's culture and build lasting friendships",
    bg: 'from-rose-900 via-rose-700 to-pink-500',
    link: '/culture/programs',
  },
]

const getSlideText = (slide, lang) => ({
  title: lang === 'ja' ? slide.titleJa : lang === 'en' ? slide.titleEn : slide.titleKo,
  subtitle: lang === 'ja' ? slide.subtitleJa : lang === 'en' ? slide.subtitleEn : slide.subtitleKo,
})

export default function HeroBanner() {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 5000)
    return () => clearInterval(timer)
  }, [])

  const slide = SLIDES[current]
  const { title, subtitle } = getSlideText(slide, lang)

  return (
    <div className={`relative bg-gradient-to-br ${slide.bg} text-white overflow-hidden transition-all duration-700`}>
      <div className="max-w-7xl mx-auto px-4 py-24 sm:py-32 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          {title}
        </h1>
        <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <Link
          to={slide.link}
          className="inline-block bg-white text-primary-700 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
        >
          {t('action.viewMore')}
        </Link>
      </div>
      <button
        onClick={() => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
        aria-label="previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => setCurrent(c => (c + 1) % SLIDES.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
        aria-label="next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${i === current ? 'w-6 bg-white' : 'w-2 bg-white/40'}`}
            aria-label={`slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
