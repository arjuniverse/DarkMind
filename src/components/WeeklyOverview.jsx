import { useMemo } from 'react'

const MOOD_COLORS = {
  happy: 'accent-yellow',
  calm: 'accent-blue',
  stressed: 'accent-red',
  low: 'accent-purple',
  focused: 'accent-green',
}

const MOOD_VALUES = {
  happy: 5,
  calm: 4,
  focused: 4,
  stressed: 2,
  low: 1,
}

function WeeklyOverview({ moods }) {
  const weeklyData = useMemo(() => {
    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - 6)
    weekStart.setHours(0, 0, 0, 0)

    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const dayMoods = moods.filter(m => {
        const moodDate = new Date(m.date)
        moodDate.setHours(0, 0, 0, 0)
        return moodDate.getTime() === date.getTime()
      })

      const avgValue = dayMoods.length > 0
        ? dayMoods.reduce((sum, m) => sum + (MOOD_VALUES[m.mood] || 3), 0) / dayMoods.length
        : 0

      days.push({
        date,
        moods: dayMoods,
        avgValue,
        count: dayMoods.length,
      })
    }

    return days
  }, [moods])

  const maxValue = Math.max(...weeklyData.map(d => d.avgValue), 1)

  const formatDayLabel = (date) => {
    const today = new Date()
    const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  if (moods.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 md:p-12 text-center animate-fade-in">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-semibold mb-2">No data yet</h2>
        <p className="text-gray-400">Log some moods to see your weekly overview</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Weekly Bars */}
      <div className="glass rounded-2xl p-6 md:p-8 mb-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">Last 7 Days</h2>
        <div className="flex items-end justify-between gap-2 md:gap-4 h-48 md:h-64">
          {weeklyData.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="w-full flex flex-col items-center justify-end h-full mb-2">
                {day.avgValue > 0 ? (
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-accent-purple to-accent-blue transition-all duration-500 hover:opacity-80"
                    style={{
                      height: `${(day.avgValue / maxValue) * 100}%`,
                      minHeight: day.avgValue > 0 ? '8px' : '0',
                    }}
                    title={`${day.count} mood${day.count !== 1 ? 's' : ''} - Avg: ${day.avgValue.toFixed(1)}`}
                  />
                ) : (
                  <div className="w-full h-1 bg-dark-border rounded" />
                )}
              </div>
              <div className="text-xs md:text-sm text-gray-400 mt-2 text-center">
                {formatDayLabel(day.date)}
              </div>
              {day.count > 0 && (
                <div className="text-xs text-gray-500 mt-1">{day.count}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mood Dots Grid */}
      <div className="glass rounded-2xl p-6 md:p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Mood Dots</h2>
        <div className="grid grid-cols-7 gap-2 md:gap-4">
          {weeklyData.map((day, index) => (
            <div key={index} className="flex flex-col items-center animate-scale-in" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="text-xs text-gray-400 mb-2">{formatDayLabel(day.date)}</div>
              <div className="flex flex-wrap gap-1 justify-center min-h-[3rem]">
                {day.moods.length > 0 ? (
                  day.moods.map((mood, moodIndex) => (
                    <div
                      key={moodIndex}
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${MOOD_COLORS[mood.mood]} bg-opacity-30 border-2 flex items-center justify-center text-lg md:text-xl transition-transform hover:scale-110`}
                      title={`${mood.label}${mood.note ? `: ${mood.note}` : ''}`}
                    >
                      {mood.emoji}
                    </div>
                  ))
                ) : (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-dark-border flex items-center justify-center text-gray-600">
                    —
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="glass rounded-2xl p-6 md:p-8 mt-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">This Week</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-purple">{moods.length}</div>
            <div className="text-sm text-gray-400 mt-1">Total Entries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-blue">{weeklyData.filter(d => d.count > 0).length}</div>
            <div className="text-sm text-gray-400 mt-1">Days Tracked</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-green">
              {(() => {
                const daysWithData = weeklyData.filter(d => d.avgValue > 0)
                return daysWithData.length > 0 
                  ? (daysWithData.reduce((sum, d) => sum + d.avgValue, 0) / daysWithData.length).toFixed(1)
                  : '0.0'
              })()}
            </div>
            <div className="text-sm text-gray-400 mt-1">Avg Mood</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-yellow">
              {Math.max(...weeklyData.map(d => d.count), 0)}
            </div>
            <div className="text-sm text-gray-400 mt-1">Most/Day</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeeklyOverview
