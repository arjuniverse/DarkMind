import { useState } from 'react'

const MOODS = [
  { id: 'happy', emoji: '😊', label: 'Happy', colorClass: 'bg-accent-yellow border-accent-yellow' },
  { id: 'calm', emoji: '😌', label: 'Calm', colorClass: 'bg-accent-blue border-accent-blue' },
  { id: 'stressed', emoji: '😰', label: 'Stressed', colorClass: 'bg-accent-red border-accent-red' },
  { id: 'low', emoji: '😔', label: 'Low', colorClass: 'bg-accent-purple border-accent-purple' },
  { id: 'focused', emoji: '🧘', label: 'Focused', colorClass: 'bg-accent-green border-accent-green' },
]

function MoodEntry({ onSave }) {
  const [selectedMood, setSelectedMood] = useState(null)
  const [note, setNote] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedMood) {
      onSave({
        mood: selectedMood.id,
        emoji: selectedMood.emoji,
        label: selectedMood.label,
        note: note.trim(),
      })
      setSelectedMood(null)
      setNote('')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    }
  }

  return (
    <div className="glass rounded-2xl p-6 md:p-8 animate-scale-in">
      <h2 className="text-2xl font-semibold mb-6 text-center">How are you feeling?</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Mood Selection */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {MOODS.map((mood) => (
            <button
              key={mood.id}
              type="button"
              onClick={() => setSelectedMood(mood)}
              className={`glass rounded-xl p-4 md:p-6 transition-all duration-300 hover:scale-105 ${
                selectedMood?.id === mood.id
                  ? `${mood.colorClass} bg-opacity-20 scale-105`
                  : 'glass-hover'
              }`}
            >
              <div className="text-4xl md:text-5xl mb-2">{mood.emoji}</div>
              <div className="text-sm md:text-base font-medium">{mood.label}</div>
            </button>
          ))}
        </div>

        {/* Note Input */}
        <div className="mb-6">
          <label htmlFor="note" className="block text-sm text-gray-400 mb-2">
            Optional note (private)
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's on your mind?"
            maxLength={200}
            rows={3}
            className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-purple transition-colors resize-none"
          />
          <div className="text-xs text-gray-500 mt-1 text-right">{note.length}/200</div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedMood}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
            selectedMood
              ? 'bg-gradient-to-r from-accent-purple to-accent-blue hover:scale-105 active:scale-95'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          Save Mood
        </button>

        {/* Success Message */}
        {showSuccess && (
          <div className="mt-4 text-center text-accent-green animate-fade-in">
            ✓ Mood saved successfully!
          </div>
        )}
      </form>
    </div>
  )
}

export default MoodEntry
