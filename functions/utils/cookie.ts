/**
 * Cookie utilities for Cloudflare Workers
 */

interface CookieOptions {
  maxAge?: number
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
  path?: string
}

interface SessionInfo {
  sessionId: string
  isNew: boolean
}

/**
 * Parse cookies from request headers
 * @param {Request} request
 * @returns {Record<string, string>} Parsed cookies as key-value pairs
 */
export function parseCookies(request: Request): Record<string, string> {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return {};

  const cookies: Record<string, string> = {};
  cookieHeader.split(';').forEach(cookie => {
    const [key, value] = cookie.trim().split('=');
    if (key && value) {
      cookies[key] = decodeURIComponent(value);
    }
  });
  return cookies;
}

/**
 * Generate a secure session ID
 * @returns {string} UUID v4
 */
export function generateSessionId(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  
  // Set version (4) and variant bits
  array[6] = (array[6] & 0x0f) | 0x40;
  array[8] = (array[8] & 0x3f) | 0x80;
  
  const hex = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32)
  ].join('-');
}

/**
 * Create Set-Cookie header value
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {CookieOptions} options - Cookie options
 * @returns {string} Set-Cookie header value
 */
export function createSetCookieHeader(name: string, value: string, options: CookieOptions = {}): string {
  const {
    maxAge = 30 * 24 * 60 * 60, // 30 days default
    httpOnly = true,
    secure = true,
    sameSite = 'Lax',
    path = '/'
  } = options;

  let cookie = `${name}=${encodeURIComponent(value)}`;
  
  if (maxAge) cookie += `; Max-Age=${maxAge}`;
  if (httpOnly) cookie += '; HttpOnly';
  if (secure) cookie += '; Secure';
  if (sameSite) cookie += `; SameSite=${sameSite}`;
  if (path) cookie += `; Path=${path}`;

  return cookie;
}

/**
 * Get or create session ID from cookies
 * @param {Request} request
 * @returns {SessionInfo}
 */
export function getOrCreateSession(request: Request): SessionInfo {
  const cookies = parseCookies(request);
  const existingSessionId = cookies['session_id'];
  
  if (existingSessionId) {
    return { sessionId: existingSessionId, isNew: false };
  }
  
  return { sessionId: generateSessionId(), isNew: true };
}