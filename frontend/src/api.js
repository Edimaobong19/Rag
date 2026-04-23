import axios from 'axios'
import { io } from 'socket.io-client'
import { API_URL } from './env'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Socket.IO connection
export const socket = io(API_URL, {
  transports: ['websocket', 'polling']
})

// API functions
export const checkUser = async (name) => {
  try {
    const response = await api.get(`/api/check-user/${encodeURIComponent(name)}`)
    return response.data
  } catch (error) {
    console.error('Error checking user:', error)
    throw error
  }
}

export const submitAssignment = async (name, group) => {
  try {
    const response = await api.post('/api/assign', { name, group })
    return response.data
  } catch (error) {
    console.error('Error submitting assignment:', error)
    throw error
  }
}

export const getAllGroups = async () => {
  try {
    const response = await api.get('/api/groups')
    return response.data
  } catch (error) {
    console.error('Error fetching groups:', error)
    throw error
  }
}

export default api
