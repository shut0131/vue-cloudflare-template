// Example API endpoint demonstrating D1 database integration
import { getOrCreateSession, createSetCookieHeader } from '../utils/cookie'
import type { WorkerContext } from '../types/context'

export async function onRequest(context: WorkerContext): Promise<Response> {
  const { request, env } = context;
  
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

  // Handle GET requests
  if (request.method === 'GET') {
    try {
      // Example: Fetch data from D1
      if (env.DB) {
        // If D1 is configured, you can query the database
        // const result = await env.DB.prepare('SELECT * FROM your_table WHERE user_id = ?').bind(userId).first();
        
        return new Response(JSON.stringify({
          message: 'GET request successful',
          sessionId: sessionId,
          timestamp: new Date().toISOString(),
          hasDatabase: true
        }), {
          headers: responseHeaders
        });
      }

      // If D1 is not configured
      return new Response(JSON.stringify({
        message: 'GET request successful',
        sessionId: sessionId,
        timestamp: new Date().toISOString(),
        hasDatabase: false
      }), {
        headers: responseHeaders
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: (error as Error).message }), {
        status: 500,
        headers: responseHeaders
      });
    }
  }

  // Handle POST requests
  if (request.method === 'POST') {
    try {
      const data = await request.json();
      
      // Example: Save data to D1
      if (env.DB) {
        // If D1 is configured, you can insert/update data
        // const result = await env.DB.prepare('INSERT INTO your_table (user_id, data) VALUES (?, ?)').bind(userId, JSON.stringify(data)).run();
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Data saved successfully',
          sessionId: sessionId,
          receivedData: data,
          hasDatabase: true
        }), {
          headers: responseHeaders
        });
      }

      // If D1 is not configured
      return new Response(JSON.stringify({
        success: true,
        message: 'Data received (not persisted)',
        sessionId: sessionId,
        receivedData: data,
        hasDatabase: false
      }), {
        headers: responseHeaders
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: (error as Error).message }), {
        status: 500,
        headers: responseHeaders
      });
    }
  }

  // Method not allowed
  return new Response('Method not allowed', { status: 405 });
}

// Handle preflight requests
export async function onRequestOptions(context: WorkerContext): Promise<Response> {
  const { request } = context;
  
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true'
    }
  });
}