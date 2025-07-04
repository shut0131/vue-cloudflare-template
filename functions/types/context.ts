// Cloudflare Workers context types

export interface WorkerEnv {
  DB?: D1Database
  __STATIC_CONTENT?: KVNamespace
  [key: string]: any
}

export interface WorkerContext {
  request: Request
  env: WorkerEnv
  ctx: ExecutionContext
}