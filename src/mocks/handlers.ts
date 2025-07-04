// MSW handlers for API mocking
import { http, HttpResponse } from 'msw'
import type { SessionResponse, ExampleGetResponse, ExamplePostResponse } from '@/types/api'

// Mock session storage
const sessions = new Map<string, { createdAt: Date }>()

function generateSessionId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

interface SessionInfo {
  sessionId: string
  isNew: boolean
}

function getOrCreateSession(request: Request): SessionInfo {
  const cookieHeader = request.headers.get('cookie') || ''
  const sessionMatch = cookieHeader.match(/session_id=([^;]+)/)
  
  if (sessionMatch) {
    const sessionId = sessionMatch[1]
    if (sessions.has(sessionId)) {
      return { sessionId, isNew: false }
    }
  }
  
  const newSessionId = generateSessionId()
  sessions.set(newSessionId, { createdAt: new Date() })
  return { sessionId: newSessionId, isNew: true }
}

export const handlers = [
  // Session endpoint
  http.get('/api/session', ({ request }) => {
    const { sessionId, isNew } = getOrCreateSession(request)
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (isNew) {
      headers['Set-Cookie'] = `session_id=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`
    }
    
    const response: SessionResponse = {
      sessionId,
      isNew
    }
    
    return HttpResponse.json(response, { headers })
  }),

  // Example endpoint - GET
  http.get('/api/example', ({ request }) => {
    const { sessionId } = getOrCreateSession(request)
    
    const response: ExampleGetResponse = {
      message: 'GET request successful (mocked)',
      sessionId,
      timestamp: new Date().toISOString(),
      hasDatabase: false,
      isMocked: true
    }
    
    return HttpResponse.json(response)
  }),

  // Example endpoint - POST
  http.post('/api/example', async ({ request }) => {
    const { sessionId } = getOrCreateSession(request)
    const data = await request.json()
    
    const response: ExamplePostResponse = {
      success: true,
      message: 'Data received successfully (mocked)',
      sessionId,
      receivedData: data,
      hasDatabase: false,
      isMocked: true
    }
    
    return HttpResponse.json(response)
  }),

  // Preflight requests
  http.options('*', () => {
    return new HttpResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true'
      }
    })
  })
]