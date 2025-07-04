// API type definitions

export interface SessionResponse {
  sessionId: string
  isNew: boolean
}

export interface ExampleGetResponse {
  message: string
  sessionId: string
  timestamp: string
  hasDatabase: boolean
  isMocked?: boolean
}

export interface ExamplePostResponse {
  success: boolean
  message: string
  sessionId: string
  receivedData: any
  hasDatabase: boolean
  isMocked?: boolean
}

export interface ApiError {
  error: string
}

export type ApiResponse<T> = T | ApiError