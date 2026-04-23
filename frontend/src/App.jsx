import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import NameInput from './pages/NameInput'
import RouletteSpin from './pages/RouletteSpin'
import { socket } from './api'
import './App.css'

function App() {
  const [groups, setGroups] = useState({
    North: [],
    West: [],
    East: [],
    South: []
  })

  useEffect(() => {
    // Listen for current groups on connection
    socket.on('current_groups', (data) => {
      setGroups(data)
    })

    // Listen for real-time updates
    socket.on('assignment_update', (data) => {
      setGroups(data.groups)
    })

    // Cleanup on unmount
    return () => {
      socket.off('current_groups')
      socket.off('assignment_update')
    }
  }, [])

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Group Assignment Shuffler</h1>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<NameInput groups={groups} />} />
            <Route path="/spin" element={<RouletteSpin groups={groups} />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
