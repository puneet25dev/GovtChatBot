// API Configuration
// Uses environment variable in production, localhost in development

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const apiEndpoints = {
  health: `${API_URL}/api/health`,
  portal: `${API_URL}/api/portal`,
  chat: `${API_URL}/api/chat`,
}

console.log('API Configuration:', { API_URL, endpoints: apiEndpoints })
