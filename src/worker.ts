import { getAssetFromKV } from '@cloudflare/kv-asset-handler'
import manifestJSON from '__STATIC_CONTENT_MANIFEST'

// APIハンドラーのインポート
import { onRequest as handleExample, onRequestOptions as handleExampleOptions } from '../functions/api/example'
import { onRequest as handleSession, onRequestOptions as handleSessionOptions } from '../functions/api/session'

const assetManifest = JSON.parse(manifestJSON)

interface Env {
  __STATIC_CONTENT: KVNamespace
  DB?: D1Database
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)
    
    // APIルーティング
    if (url.pathname === '/api/example') {
      if (request.method === 'OPTIONS') {
        return handleExampleOptions({ request, env, ctx })
      }
      return handleExample({ request, env, ctx })
    }
    
    if (url.pathname === '/api/session') {
      if (request.method === 'OPTIONS') {
        return handleSessionOptions({ request, env, ctx })
      }
      return handleSession({ request, env, ctx })
    }
    
    // Add more API routes here as needed
    // if (url.pathname === '/api/your-endpoint') {
    //   return handleYourEndpoint({ request, env, ctx })
    // }
    
    // 静的アセットの処理
    try {
      // index.htmlへのフォールバック
      const pathname = url.pathname
      if (pathname === '/' || pathname === '') {
        url.pathname = '/index.html'
      }
      
      return await getAssetFromKV(
        {
          request: new Request(url.toString(), request),
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: assetManifest,
        }
      )
    } catch (e: any) {
      // アセットが見つからない場合は、index.htmlを返す（SPAのため）
      if (e.status === 404) {
        url.pathname = '/index.html'
        return await getAssetFromKV(
          {
            request: new Request(url.toString(), request),
            waitUntil: ctx.waitUntil.bind(ctx),
          },
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            ASSET_MANIFEST: assetManifest,
          }
        )
      }
      
      // その他のエラー
      return new Response('Internal Server Error', { status: 500 })
    }
  }
}