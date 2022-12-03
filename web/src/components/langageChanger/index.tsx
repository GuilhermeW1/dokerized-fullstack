import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/auth-provider'

export default function ChangeLanguage() {
  const { changeLanguage } = useAuth()
  const { i18n } = useTranslation()

  const handleChange = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const target = event.target as HTMLInputElement
      i18n.changeLanguage(target.value)
      changeLanguage(target.value)
    },
    []
  )

  return (
    <div className="flex flex-row gap-2">
      <button
        className="bg-blackCustom-400 p-2 rounded "
        value="en"
        onClick={handleChange}
      >
        English
      </button>
      <button
        className="bg-blackCustom-400 p-2 rounded gap-2"
        value="ptBR"
        onClick={handleChange}
      >
        Portugues
      </button>
    </div>
  )
}
