// API response types for pagination and data
export type ApiPaginatedResponse<T> = {
    status: string
    message: string
    data: {
      total: number
      totalPages: number
      page: number
      limit: number
      sortBy: string | null
      order: string | null
      records: T[]
    }
    error: string | null
  }
  
  // API user record type as returned from the API
  export type ApiUserRecord = {
    id: string
    email: string
    fullname: string
    role: string // This is a role ID in the API
    enabled: boolean
    createdAt: string
    username?: string
    lastLogin?: string
    avatar?: string
  }
  
  // Generic API response type
  export type ApiResponse<T> = {
    status: string
    message: string
    data: T
    error: string | null
  }
  
  // Login response type
  export type ApiLoginResponse = {
    status: string
    message: string
    data: {
      user: ApiUserRecord
      token: string
    }
    error: string | null
  }
  