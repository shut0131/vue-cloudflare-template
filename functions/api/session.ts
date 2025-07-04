// Session management endpoint
import { getOrCreateSession, createSetCookieHeader } from '../utils/cookie'
import type { WorkerContext } from '../types/context'

export async function onRequest(context: WorkerContext): Promise<Response> {
  const { request } = context;
  
  // Get or create session from cookies
  const { sessionId, isNew } = getOrCreateSession(request);
  
  // Prepare response headers
  const responseHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
    'Access-Control-Allow-Credentials': 'true'
  };
  
  // Set cookie if new session
  if (isNew) {
    responseHeaders['Set-Cookie'] = createSetCookieHeader('session_id', sessionId);
  }

  // Return session information
  return new Response(JSON.stringify({
    sessionId: sessionId,
    isNew: isNew
  }), {
    headers: responseHeaders
  });
}

// Handle preflight requests
export async function onRequestOptions(context: WorkerContext): Promise<Response> {
  const { request } = context;
  
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true'
    }
  });
}