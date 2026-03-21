import { useState, useMemo } from 'react'

const MOOD_COLORS = {
  happy: 'bg-accent-yellow border-accent-yellow',
  calm: 'bg-accent-blue border-accent-blue',
  stressed: 'bg-accent-red border-accent-red',
  low: 'bg-accent-purple border-accent-purple',
  focused: 'bg-accent-green border-accent-green',
}

function MoodHistory({ moods, onDelete }) {
  const [filter, setFilter] = useState('all')

  const filteredMoods = useMemo(() => {
    if (filter === 'all') return moods
    return moods.filter(m => m.mood === filter)
  }, [moods, filter])

  const sortedMoods = useMemo(() => {
    return [...filteredMoods].sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [filteredMoods])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
        hour: '2-digit',
        minute: '2-digit',
      })
    }
  }

  if (moods.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 md:p-12 text-center animate-fade-in">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-2xl font-semibold mb-2">No moods logged yet</h2>
        <p className="text-gray-400">Start tracking your mood to see your history here</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Filter */}
      <div className="glass rounded-xl p-4 mb-6 flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm transition-all ${
            filter === 'all'
              ? 'bg-accent-purple bg-opacity-30 border border-accent-purple'
              : 'glass glass-hover'
          }`}
        >
          All
        </button>
        {Object.keys(MOOD_COLORS).map((mood) => (
          <button
            key={mood}
            onClick={() => setFilter(mood)}
            className={`px-4 py-2 rounded-lg text-sm transition-all capitalize ${
              filter === mood
                ? `${MOOD_COLORS[mood]} bg-opacity-30 border`
                : 'glass glass-hover'
            }`}
          >
            {mood}
          </button>
        ))}
      </div>

      {/* Mood List */}
      <div className="space-y-3">
        {sortedMoods.map((mood, index) => (
          <div
            key={mood.id}
            className="glass rounded-xl p-4 md:p-6 animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className={`text-3xl md:text-4xl p-2 rounded-lg ${MOOD_COLORS[mood.mood]} bg-opacity-20`}>
                  {mood.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-lg capitalize">{mood.label}</span>
                    <span className="text-xs text-gray-500">{formatDate(mood.date)}</span>
                  </div>
                  {mood.note && (
                    <p className="text-gray-300 text-sm md:text-base mt-2 break-words">{mood.note}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => onDelete(mood.id)}
                className="text-gray-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500 hover:bg-opacity-10 rounded-lg"
                aria-label="Delete mood"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {sortedMoods.length === 0 && (
        <div className="glass rounded-2xl p-8 text-center animate-fade-in">
          <p className="text-gray-400">No moods found for this filter</p>
        </div>
      )}
    </div>
  )
}

export default MoodHistory
