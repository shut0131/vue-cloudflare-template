import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getSessionId, apiRequest } from './userSession'

// Mock fetch globally
global.fetch = vi.fn()

describe('userSession', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getSessionId', () => {
    it('returns session ID from successful response', async () => {
      const mockSessionId = 'test-session-123'
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ sessionId: mockSessionId, isNew: false })
      }
      
      vi.mocked(global.fetch).mockResolvedValue(mockResponse as any)
      
      const sessionId = await getSessionId()
      
      expect(sessionId).toBe(mockSessionId)
      expect(global.fetch).toHaveBeenCalledWith('/api/session', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    })

    it('throws error when response is not ok', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn()
      }
      
      vi.mocked(global.fetch).mockResolvedValue(mockResponse as any)
      
      await expect(getSessionId()).rejects.toThrow('Failed to get session')
    })

    it('handles network errors', async () => {
      vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'))
      
      await expect(getSessionId()).rejects.toThrow('Network error')
    })
  })

  describe('apiRequest', () => {
    it('includes credentials and content-type by default', async () => {
      const mockResponse = { ok: true }
      vi.mocked(global.fetch).mockResolvedValue(mockResponse as any)
      
      await apiRequest('/api/test')
      
      expect(global.fetch).toHaveBeenCalledWith('/api/test', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    })

    it('merges custom options', async () => {
      const mockResponse = { ok: true }
      vi.mocked(global.fetch).mockResolvedValue(mockResponse as any)
      
      await apiRequest('/api/test', {
        method: 'POST',
        body: JSON.stringify({ data: 'test' }),
        headers: {
          'X-Custom-Header': 'value'
        }
      })
      
      expect(global.fetch).toHaveBeenCalledWith('/api/test', {
        method: 'POST',
        body: JSON.stringify({ data: 'test' }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Custom-Header': 'value'
        }
      })
    })
  })
})