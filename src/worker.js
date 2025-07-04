import { getAssetFromKV } from '@cloudflare/kv-asset-handler'
import manifestJSON from '__STATIC_CONTENT_MANIFEST'

// APIハンドラーのインポート
import { onRequest as handleSave, onRequestOptions as handleSaveOptions } from '../functions/api/save.js'
import { onRequest as handleLoad, onRequestOptions as handleLoadOptions } from '../functions/api/load.js'

const assetManifest = JSON.parse(manifestJSON)

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    
    // APIルーティング
    if (url.pathname === '/api/save') {
      if (request.method === 'OPTIONS') {
        return handleSaveOptions({ request, env, ctx })
      }
      return handleSave({ request, env, ctx })
    }
    
    if (url.pathname === '/api/load') {
      if (request.method === 'OPTIONS') {
        return handleLoadOptions({ request, env, ctx })
      }
      return handleLoad({ request, env, ctx })
    }
    
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
    } catch (e) {
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