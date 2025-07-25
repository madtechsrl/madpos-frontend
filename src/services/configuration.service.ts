import axios, { type AxiosInstance, type AxiosResponse } from "axios"

// Types
export interface BusinessConfiguration {
  id?: string
  businessName: string
  responsiblePerson: string
  idNumber: string
  phone: string
  whatsapp: string
  instagram: string
  email: string
  address: string
  complement: string
  logo: string
  businessInfo: string
  currency: string
  decimalPlaces: boolean
  showCancelledTransactions: boolean
  hideTransactions: boolean
  createdAt?: string
  updatedAt?: string
}

// Use Partial<BusinessConfiguration> directly instead of a redundant interface

export interface ApiError {
  message: string
  code?: string
  details?: string
}

// Mock JSON Data
const MOCK_CONFIGURATION: BusinessConfiguration = {
  id: "1",
  businessName: "MADTECH",
  responsiblePerson: "NCF-",
  idNumber: "RNC-110-273645",
  phone: "",
  whatsapp: "",
  instagram: "",
  email: "",
  address: "",
  complement: "",
  logo: "",
  businessInfo: "",
  currency: "DO - RD$",
  decimalPlaces: true,
  showCancelledTransactions: false,
  hideTransactions: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-20T10:30:00Z",
}

const MOCK_CURRENCIES = ["DO - RD$", "US - USD", "EU - EUR", "MX - MXN", "CO - COP"]

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.example.com"
const API_VERSION = "v1"

class ConfigurationService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/${API_VERSION}`,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("authToken")
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        const apiError: ApiError = {
          message: "An unexpected error occurred",
          code: "UNKNOWN_ERROR",
        }

        if (error.response) {
          apiError.message = error.response.data?.message || `Server error: ${error.response.status}`
          apiError.code = error.response.data?.code || `HTTP_${error.response.status}`
          apiError.details = error.response.data
        } else if (error.request) {
          apiError.message = "Network error - please check your connection"
          apiError.code = "NETWORK_ERROR"
        } else {
          apiError.message = error.message || "Request failed"
          apiError.code = "REQUEST_ERROR"
        }

        return Promise.reject(apiError)
      },
    )
  }

  // Get configuration
  async getConfiguration(): Promise<BusinessConfiguration> {
    try {
      // Uncomment for real API call
      // const response = await this.api.get<BusinessConfiguration>("/configuration")
      // return response.data

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 500))
      return MOCK_CONFIGURATION
    } catch (error) {
      console.error("Failed to get configuration:", error)
      throw error
    }
  }

  // Update configuration
  async updateConfiguration(configData: Partial<BusinessConfiguration>): Promise<BusinessConfiguration> {
    try {
      // Uncomment for real API call
      // const response = await this.api.put<BusinessConfiguration>("/configuration", configData)
      // return response.data

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const updatedConfig: BusinessConfiguration = {
        ...MOCK_CONFIGURATION,
        ...configData,
        updatedAt: new Date().toISOString(),
      }
      return updatedConfig
    } catch (error) {
      console.error("Failed to update configuration:", error)
      throw error
    }
  }

  // Upload logo
  async uploadLogo(_file: File): Promise<string> {
    try {
      // Uncomment for real API call
      // const formData = new FormData()
      // formData.append("logo", file)
      // const response = await this.api.post<{ url: string }>("/configuration/upload-logo", formData, {
      //   headers: { "Content-Type": "multipart/form-data" }
      // })
      // return response.data.url

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 2000))
      return `/placeholder.svg?height=120&width=120&query=business-logo`
    } catch (error) {
      console.error("Failed to upload logo:", error)
      throw error
    }
  }

  // Get available currencies
  async getCurrencies(): Promise<string[]> {
    try {
      // Uncomment for real API call
      // const response = await this.api.get<{ currencies: string[] }>("/configuration/currencies")
      // return response.data.currencies

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 200))
      return MOCK_CURRENCIES
    } catch (error) {
      console.error("Failed to get currencies:", error)
      throw error
    }
  }
}

// Export singleton instance
const configurationService = new ConfigurationService()
export default configurationService
