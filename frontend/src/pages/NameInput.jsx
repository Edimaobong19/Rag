import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkUser } from '../api'
import GroupTable from '../components/GroupTable'

function NameInput({ groups }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!name.trim()) {
      setError('Please enter a name')
      return
    }

    setLoading(true)
    try {
      const result = await checkUser(name)
      if (result.exists) {
        setError('This person has already been assigned!')
        setLoading(false)
        return
      }
      
      // Navigate to spin page with name
      navigate('/spin', { state: { name: name.trim() } })
    } catch (err) {
      setError('Error checking name. Please try again.')
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <div className="name-input-container">
      <div className="card">
        <h2>Enter Your Name</h2>
        <form onSubmit={handleSubmit} className="name-form">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type your name..."
            className="name-input"
            autoFocus
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Checking...' : 'Shuffle →'}
          </button>
        </form>
      </div>

      {Object.values(groups).some(arr => arr.length > 0) && (
        <div className="groups-preview">
          <h3>Current Group Assignments</h3>
          <GroupTable groups={groups} />
        </div>
      )}
    </div>
  )
}

export default NameInput
