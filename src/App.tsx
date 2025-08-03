import { useEffect, useState } from 'react'
import './App.css'
import { Board } from './components/Board'
import Footer from './components/Footer'
import Header from './components/Header'

function App() {
  const [lightdark, setLightDark] = useState(false)

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
      setLightDark(true)
    } else {
      document.documentElement.classList.remove('dark')
      setLightDark(false)
    }
  }, [])

  function lightdarkmode() {
    if (
      !localStorage.theme ||
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
      setLightDark(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
      setLightDark(true)
    }
  }

  return (
     <div className="font-sans antialiased text-zinc-900 bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-100 scrollbar">
      <Header lightdark={lightdark} lightdarkmode={lightdarkmode} />
      <main className="container mx-auto p-4">
        <Board />
      </main>
      <Footer />
    </div>
  )
}

export default App
