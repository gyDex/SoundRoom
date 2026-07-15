'use client'

import { mobileMenuStore } from '@/shared/stores/mobile-menu.store'
import { useThemeMode } from 'antd-style'
import { observer } from 'mobx-react-lite'
import { FaMoon, FaSun } from 'react-icons/fa'

const SwitchTheme = observer(() => {
  const { themeMode, setThemeMode } = useThemeMode()

  const toggleTheme = () => {
    mobileMenuStore.changeActive(false);
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
})

export default SwitchTheme
