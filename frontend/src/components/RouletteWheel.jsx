import { useState, useEffect } from 'react'

function RouletteWheel({ onSpinComplete, disabled, forcedGroup, showResult }) {
  const [shuffling, setShuffling] = useState(false)
  const [displayGroup, setDisplayGroup] = useState('?')
  const [shuffleIndex, setShuffleIndex] = useState(0)

  const groups = ['North', 'East', 'South', 'West']
  const groupColors = {
    North: '#FFD700',  // Gold
    East: '#FFC000',   // Yellow-Gold
    South: '#FFA500',  // Orange-Gold
    West: '#DAA520'    // Dark Gold
  }

  // For result display
  const resultGroup = forcedGroup || displayGroup

  const shuffle = () => {
    if (shuffling || disabled) return

    setShuffling(true)
    setDisplayGroup('?')
    
    // Determine target group based on forcedGroup or pick random
    const targetGroup = forcedGroup || groups[Math.floor(Math.random() * groups.length)]
    
    // Shuffle animation - cycle through groups rapidly then slow down
    let count = 0
    const totalShuffles = 30 // How many times to cycle
    let speed = 50 // Initial speed in ms
    
    const doShuffle = () => {
      // Cycle through groups
      setDisplayGroup(groups[count % groups.length])
      setShuffleIndex(count)
      count++
      
      if (count < totalShuffles) {
        // Slow down as we approach the end
        if (count > totalShuffles - 10) {
          speed += 30
        } else if (count > totalShuffles - 5) {
          speed += 50
        }
        
        setTimeout(doShuffle, speed)
      } else {
        // Show final result
        setDisplayGroup(targetGroup)
        setShuffling(false)
        
        // Wait a moment then call complete
        setTimeout(() => {
          onSpinComplete(targetGroup)
        }, 500)
      }
    }
    
    doShuffle()
  }

  return (
    <div className="roulette-container">
      <div className="shuffler-wrapper">
        <div 
          className="shuffler-display"
          style={{ 
            backgroundColor: showResult && resultGroup !== '?' ? groupColors[resultGroup] : '#333',
            borderColor: showResult && resultGroup !== '?' ? groupColors[resultGroup] : '#666'
          }}
        >
          <div 
            className="shuffler-text"
            style={{
              color: resultGroup !== '?' ? '#fff' : '#999'
            }}
          >
            {showResult ? resultGroup : displayGroup}
          </div>
        </div>
      </div>

      {!showResult && (
        <button 
          className="btn-spin" 
          onClick={shuffle} 
          disabled={shuffling || disabled}
        >
          {shuffling ? 'Shuffling...' : 'SHUFFLE'}
        </button>
      )}
    </div>
  )
}

export default RouletteWheel
