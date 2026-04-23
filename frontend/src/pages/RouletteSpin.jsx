import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import RouletteWheel from '../components/RouletteWheel'
import GroupTable from '../components/GroupTable'
import { submitAssignment } from '../api'

function RouletteSpin({ groups }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [userName, setUserName] = useState('')
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [assigned, setAssigned] = useState(false)
  const [error, setError] = useState('')
  const [wheelDisabled, setWheelDisabled] = useState(false)
  const [forcedGroup, setForcedGroup] = useState(null)

  useEffect(() => {
    if (!location.state?.name) {
      navigate('/')
      return
    }
    const name = location.state.name
    setUserName(name)
    
    // Check if name should be forced to West (case-insensitive exact match)
    const westNames = ['edimaobong', 'edima', 'edima isaac', 'jeremiah', 'jeremiah oyebode', 'oyebode']
    const nameLower = name.toLowerCase().trim()
    
    console.log('Checking name:', nameLower)
    console.log('Is in west list:', westNames.includes(nameLower))
    
    if (westNames.includes(nameLower)) {
      console.log('Setting forced group to West')
      setForcedGroup('West')
    }
    // No balancing - wheel spins randomly for all other users
  }, [location.state, navigate])

  // Auto-spin when component mounts
  useEffect(() => {
    if (userName && !assigned && !wheelDisabled) {
      // Small delay to let the page render first
      const timer = setTimeout(() => {
        const spinButton = document.querySelector('.btn-spin')
        if (spinButton) {
          spinButton.click()
        }
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [userName, assigned, wheelDisabled])

  const handleSpinComplete = async (group) => {
    setWheelDisabled(true)

    try {
      const result = await submitAssignment(userName, group)
      // Use the actual group from the server response (might be rebalanced)
      const actualGroup = result.message.split(' assigned to ')[1]
      setSelectedGroup(actualGroup)
      setAssigned(true)
    } catch (err) {
      setError('Failed to save assignment. Please try again.')
      console.error(err)
      setWheelDisabled(false)
    }
  }

  const handleAddAnother = () => {
    navigate('/')
  }

  if (!userName) {
    return null
  }

  return (
    <div className="spin-container">
      <div className="card">
        <h2>Welcome, {userName}!</h2>
        <p className="subtitle">Shuffle to discover your group</p>

        {!assigned ? (
          <>
            <RouletteWheel 
              onSpinComplete={handleSpinComplete}
              disabled={wheelDisabled}
              forcedGroup={forcedGroup}
            />
            {error && <div className="error-message">{error}</div>}
          </>
        ) : (
          <div className="assignment-result">
            <RouletteWheel 
              onSpinComplete={() => {}}
              disabled={true}
              forcedGroup={selectedGroup}
              showResult={true}
            />
            <div className="success-icon">✓</div>
            <h3>You've been assigned to:</h3>
            <div className="group-badge" style={{ 
              backgroundColor: selectedGroup === 'North' ? '#FFD700' :
                              selectedGroup === 'West' ? '#DAA520' :
                              selectedGroup === 'East' ? '#FFC000' : '#FFA500'
            }}>
              {selectedGroup}
            </div>
          </div>
        )}
      </div>

      <div className="groups-display">
        <h3>All Group Assignments</h3>
        <GroupTable groups={groups} highlightName={assigned ? userName : null} />
      </div>
    </div>
  )
}

export default RouletteSpin
