import { createContext, useContext, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation()
  const [lang, setLang] = useState(localStorage.getItem('language') || 'ko')

  const switchLanguage = (newLang) => {
    setLang(newLang)
    i18n.changeLanguage(newLang)
    localStorage.setItem('language', newLang)
    document.documentElement.lang = newLang
  }

  useEffect(() => {
    // i18n을 context lang에 맞춰 초기 동기화 (navigator 감지와의 불일치 방지)
    i18n.changeLanguage(lang)
    document.documentElement.lang = lang
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
