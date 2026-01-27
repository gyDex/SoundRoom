'use client'

import { useThemeMode } from 'antd-style'
import { FaMoon, FaSun } from 'react-icons/fa'

const SwitchTheme = () => {
  const { themeMode, setThemeMode } = useThemeMode()

  const toggleTheme = () => {
    setThemeMode(themeMode === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"

      className='sidebar__profile-btn p-[5px] rounded-xl'
    >
      {themeMode === 'dark' ? <FaSun color='currentColor' size={20} /> : <FaMoon color='currentColor' size={20} />}
    </button>
  )
}

export default SwitchTheme
