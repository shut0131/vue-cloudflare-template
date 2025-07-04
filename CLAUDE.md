# Claude Code Context for Vue + Cloudflare Workers Template

## Project Overview
This is a modern full-stack template combining Vue 3 frontend with Cloudflare Workers backend deployment. The template provides a production-ready foundation for building applications at the edge with integrated database support.

## Technology Stack

### Frontend
- **Vue 3** (Composition API) with TypeScript
- **Vite** - Fast build tool with HMR
- **TypeScript** - Strict type checking throughout
- **CSS Variables** - Theme system (dark/light mode)
- **HTTP-only Cookies** - Secure session management
- **MSW** - Mock Service Worker for API testing
- **Vitest** - Unit testing framework
- **Playwright** - E2E testing framework
- **pnpm** - Fast, disk space efficient package manager

### Backend
- **Cloudflare Workers** - Edge computing platform
- **Workers Sites** - Static asset hosting
- **Cloudflare D1** - SQLite database at the edge
- **Wrangler** - Cloudflare's CLI tool

### Key Features
- HTTP-only cookie-based session management
- Dark/Light theme with system preference detection
- API endpoints with CORS support and credentials
- Database integration (optional)
- Hot Module Replacement for development
- TypeScript ready (optional)

## Project Structure
```
vue-on-cloudflare-sample/
├── dist/                    # Built Vue app (git-ignored)
├── functions/              # Cloudflare Pages Functions (API endpoints)
│   ├── api/
│   │   ├── example.js      # Example API endpoint with D1 integration
│   │   └── session.js      # Session management endpoint
│   └── utils/
│       └── cookie.js       # Cookie utilities for HTTP-only cookies
├── migrations/             # D1 database migrations
│   └── 0001_create_documents_table.sql
├── public/                 # Static assets
├── src/
│   ├── components/         # Vue components
│   │   ├── HelloWorld.vue  # Example component
│   │   └── ApiExample.vue  # API integration example
│   ├── composables/        # Vue composables
│   │   └── useTheme.js     # Theme management
│   ├── mocks/              # MSW mock handlers
│   │   ├── browser.js      # MSW browser setup
│   │   └── handlers.js     # API mock handlers
│   ├── utils/
│   │   └── userSession.js  # Session management utilities
│   ├── App.vue            # Root component
│   ├── main.js            # Vue entry point with MSW initialization
│   ├── style.css          # Global styles with CSS variables
│   └── worker.js          # Cloudflare Workers entry point
├── .gitignore
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── README.md              # Comprehensive documentation
├── vite.config.js         # Vite configuration
└── wrangler.toml          # Cloudflare Workers configuration
```

## Key Files Explanation

### src/worker.js
Entry point for Cloudflare Workers. Handles:
- API routing (maps URLs to handler functions)
- Static asset serving via Workers Sites
- SPA fallback routing

### functions/api/example.js
Example API endpoint demonstrating:
- Request handling (GET/POST)
- Session validation via HTTP-only cookies
- D1 database integration (with graceful fallback)
- CORS configuration with credentials

### src/composables/useTheme.js
Theme management composable providing:
- Light/Dark/System theme modes
- Automatic system preference detection
- Theme persistence in localStorage
- CSS class toggling on document root

### src/utils/userSession.js
Session management utilities:
- Fetches session ID from server
- Handles API requests with credentials
- Automatic cookie inclusion

### src/mocks/handlers.js
MSW mock handlers for development:
- Simulates session management with cookies
- Mocks all API endpoints
- Maintains session state in memory
- Returns realistic response data

### wrangler.toml
Cloudflare Workers configuration:
- Worker name and entry point
- Static asset bucket configuration
- D1 database bindings
- Compatibility date settings

## Development Workflow

1. **Local Development**
   ```bash
   pnpm dev             # Vue dev server with MSW mocking (http://localhost:5173)
   pnpm worker:dev      # Workers dev server for real API testing
   ```
   
   MSW automatically mocks API calls in development mode, allowing you to develop without running the Workers backend.

2. **Testing**
   ```bash
   pnpm test            # Run unit tests with Vitest
   pnpm test:e2e        # Run E2E tests with Playwright
   ```

3. **Building**
   ```bash
   pnpm build           # Type check and build Vue app to dist/
   ```

4. **Deployment**
   ```bash
   pnpm worker:deploy   # Deploy to Cloudflare Workers
   ```

## API Development Pattern

New API endpoints follow this pattern:
1. Create handler in `functions/api/[endpoint].js`
2. Export `onRequest` function (and `onRequestOptions` for CORS)
3. Access D1 via `env.DB` (check if exists for graceful fallback)
4. Register route in `src/worker.js`

Example API handler structure:
```javascript
import { getOrCreateSession } from '../utils/cookie.js';

export async function onRequest(context) {
  const { request, env } = context;
  const { sessionId, isNew } = getOrCreateSession(request);
  
  // Handle request, access env.DB for database
  const responseHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
    'Access-Control-Allow-Credentials': 'true'
  };
  
  if (isNew) {
    responseHeaders['Set-Cookie'] = createSetCookieHeader('session_id', sessionId);
  }
  
  return new Response(JSON.stringify(data), { headers: responseHeaders });
}
```

## Theme System

CSS variables define the theme:
- `:root` - Light theme variables
- `:root.dark` - Dark theme overrides
- JavaScript applies `.dark` class to `<html>`
- System preference detected via `prefers-color-scheme`

## Database Integration

D1 (SQLite at edge) integration:
- Database binding in wrangler.toml
- Migrations in migrations/ directory
- Access via `env.DB` in Workers
- Graceful fallback when not configured

## Common Commands

```bash
# Development
pnpm install           # Install dependencies
pnpm dev               # Start Vue dev server
pnpm worker:dev        # Start Workers dev server

# Testing
pnpm test              # Run unit tests
pnpm test:e2e          # Run E2E tests

# Build & Deploy
pnpm build             # Build Vue app
pnpm worker:deploy     # Deploy to Workers

# Database
npx wrangler d1 create [db-name]  # Create new D1 database
npx wrangler d1 execute [db-name] --local --file=./migrations/[file].sql
npx wrangler d1 execute [db-name] --remote --file=./migrations/[file].sql

# Authentication
npx wrangler login     # Login to Cloudflare

# Git Workflow (IMPORTANT)
git checkout -b feature/your-feature-name  # Create new branch
# Make your changes
git add -A
git commit -m "feat: your feature description"
gh pr create --title "Your PR title" --body "Description"  # Create PR using gh command
```

## Environment Configuration

No `.env` files needed for basic setup. Configuration handled via:
- `wrangler.toml` for Workers settings
- `vite.config.js` for build settings
- CSS variables for theming

For secrets:
```bash
npx wrangler secret put SECRET_NAME
```

## Best Practices

1. **API Design**: Keep endpoints RESTful and stateless
2. **Error Handling**: Always return proper HTTP status codes
3. **CORS**: Configure with credentials support for cookie-based auth
4. **Database**: Use prepared statements, handle connection errors
5. **Sessions**: Use HTTP-only cookies for security
6. **Theme**: Use CSS variables for all color values
7. **Security**: Never expose sensitive data, use Wrangler secrets, HTTP-only cookies
8. **Version Control**: Always create a new branch for changes and use gh command to create pull requests

## Deployment Notes

- Workers deployment includes both API and static assets
- No separate hosting needed for frontend
- Global edge deployment automatically
- Zero cold starts for static assets
- D1 provides low-latency database access

## Customization Guide

1. **Remove D1**: Delete database configuration from wrangler.toml
2. **TypeScript**: Already configured with strict mode
3. **Change Theme**: Modify CSS variables in src/style.css
4. **Add Auth**: Implement in API handlers, store sessions in D1
5. **Add Routes**: Vue Router can be added for SPA routing

This template provides a solid foundation for building modern web applications with Vue.js frontend and Cloudflare's edge computing platform.