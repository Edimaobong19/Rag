// Frontend environment variables for production
// These will be replaced at build time

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export { API_URL }
