import { useState, useEffect } from 'react'
import MoodEntry from './components/MoodEntry'
import MoodHistory from './components/MoodHistory'
import WeeklyOverview from './components/WeeklyOverview'

function App() {
  const [moods, setMoods] = useState([])
  const [view, setView] = useState('entry') // 'entry', 'history', 'overview'

  useEffect(() => {
    // Load moods from localStorage
    const savedMoods = localStorage.getItem('darkmind-moods')
    if (savedMoods) {
      try {
        setMoods(JSON.parse(savedMoods))
      } catch (error) {
        console.error('Error loading moods:', error)
      }
    }
  }, [])

  const saveMood = (mood) => {
    const newMoods = [...moods, { ...mood, id: Date.now(), date: new Date().toISOString() }]
    setMoods(newMoods)
    localStorage.setItem('darkmind-moods', JSON.stringify(newMoods))
  }

  const deleteMood = (id) => {
    const newMoods = moods.filter(m => m.id !== id)
    setMoods(newMoods)
    localStorage.setItem('darkmind-moods', JSON.stringify(newMoods))
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="mb-8 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-accent-purple to-accent-blue bg-clip-text text-transparent">
            DarkMind
          </h1>
          <p className="text-gray-400 text-sm md:text-base">Track your mood, understand yourself</p>
        </header>

        {/* Navigation */}
        <nav className="flex justify-center gap-4 mb-8 animate-slide-up">
          <button
            onClick={() => setView('entry')}
            className={`px-6 py-2 rounded-lg glass glass-hover transition-all ${
              view === 'entry' ? 'bg-accent-purple bg-opacity-30 border-accent-purple' : ''
            }`}
          >
            Log Mood
          </button>
          <button
            onClick={() => setView('history')}
            className={`px-6 py-2 rounded-lg glass glass-hover transition-all ${
              view === 'history' ? 'bg-accent-purple bg-opacity-30 border-accent-purple' : ''
            }`}
          >
            History
          </button>
          <button
            onClick={() => setView('overview')}
            className={`px-6 py-2 rounded-lg glass glass-hover transition-all ${
              view === 'overview' ? 'bg-accent-purple bg-opacity-30 border-accent-purple' : ''
            }`}
          >
            Overview
          </button>
        </nav>

        {/* Main Content */}
        <main className="animate-fade-in">
          {view === 'entry' && <MoodEntry onSave={saveMood} />}
          {view === 'history' && <MoodHistory moods={moods} onDelete={deleteMood} />}
          {view === 'overview' && <WeeklyOverview moods={moods} />}
        </main>
      </div>
    </div>
  )
}

export default App
