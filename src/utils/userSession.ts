// User session management utility
import type { SessionResponse } from '@/types/api'

/**
 * Get current session ID from the server
 * Server will automatically create a new session if none exists
 * @returns {Promise<string>} Session ID
 */
export async function getSessionId(): Promise<string> {
  try {
    const response = await fetch('/api/session', {
      method: 'GET',
      credentials: 'include', // Important: include cookies
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to get session')
    }
    
    const data: SessionResponse = await response.json()
    return data.sessionId
  } catch (error) {
    console.error('Error getting session:', error)
    throw error
  }
}

/**
 * Make an API request with credentials
 * @param {string} url - API endpoint URL
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<Response>} Fetch response
 */
export async function apiRequest(url: string, options: RequestInit = {}): Promise<Response> {
  return fetch(url, {
    ...options,
    credentials: 'include', // Always include cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  })
}