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
  addressComplement: string
  businessDescription: string
  businessInfo: string
  logo: string
  currency: string
  decimalPlaces: boolean
  showCancelledTransactions: boolean
  hideTransactions: boolean
  createdAt?: string
  updatedAt?: string
}

export type ConfigurationUpdateRequest = Partial<BusinessConfiguration>

export interface ApiError {
  message: string
  code?: string
  details?: string 
}

// Currency options
export const CURRENCY_OPTIONS = [
  { value: "DO - RD$", label: "DO - RD$" },
  { value: "US - USD", label: "US - USD" },
  { value: "EU - EUR", label: "EU - EUR" },
  { value: "MX - MXN", label: "MX - MXN" },
  { value: "CO - COP", label: "CO - COP" },
  { value: "AR - ARS", label: "AR - ARS" },
]

// Mock configuration data
const MOCK_CONFIGURATION: BusinessConfiguration = {
  id: "1",
  businessName: "MADTECH",
  responsiblePerson: "Miguel Santana",
  idNumber: "RNC-110-273645",
  phone: "+1-809-555-0123",
  whatsapp: "+1-809-555-0124",
  instagram: "@madtech_store",
  email: "info@madtech.com",
  address: "Av. Principal 123, Santo Domingo",
  addressComplement: "Edificio Comercial, Local 5",
  businessDescription: "Tienda especializada en tecnología y electrónicos",
  businessInfo: "Horarios: Lun-Vie 9:00-18:00, Sáb 9:00-14:00. Aceptamos todas las tarjetas de crédito.",
  logo: "/placeholder.svg?height=120&width=120",
  currency: "DO - RD$",
  decimalPlaces: true,
  showCancelledTransactions: false,
  hideTransactions: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-20T10:30:00Z",
}

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

  // Get current configuration
  async getConfiguration(): Promise<BusinessConfiguration> {
    try {
      // Uncomment for real API call
      // const response = await this.api.get<BusinessConfiguration>("/configuration")
      // return response.data

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 500))
      return { ...MOCK_CONFIGURATION }
    } catch (error) {
      console.error("Failed to get configuration:", error)
      throw error
    }
  }

  // Update configuration
  async updateConfiguration(data: ConfigurationUpdateRequest): Promise<BusinessConfiguration> {
    try {
      // Uncomment for real API call
      // const response = await this.api.put<BusinessConfiguration>("/configuration", data)
      // return response.data

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const updatedConfig: BusinessConfiguration = {
        ...MOCK_CONFIGURATION,
        ...data,
        updatedAt: new Date().toISOString(),
      }
      return updatedConfig
    } catch (error) {
      console.error("Failed to update configuration:", error)
      throw error
    }
  }

  // Upload logo file
  async uploadLogo(file: File): Promise<string> {
    try {
      // Validate file
      if (!file.type.startsWith("image/")) {
        throw new Error("Please select a valid image file")
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        throw new Error("Image size must be less than 5MB")
      }

      // Uncomment for real API call
      // const formData = new FormData()
      // formData.append("logo", file)
      // const response = await this.api.post<{ url: string }>("/configuration/upload-logo", formData, {
      //   headers: { "Content-Type": "multipart/form-data" }
      // })
      // return response.data.url

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 2000))
      return `/placeholder.svg?height=120&width=120&query=${file.name}-logo`
    } catch (error) {
      console.error("Failed to upload logo:", error)
      throw error
    }
  }

  // Upload base64 logo
  async uploadBase64Logo(base64Data: string): Promise<string> {
    try {
      // Uncomment for real API call
      // const response = await this.api.post<{ url: string }>("/configuration/upload-base64-logo", {
      //   image: base64Data,
      // })
      // return response.data.url

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 1500))
      return `/placeholder.svg?height=120&width=120&query=base64-logo`
    } catch (error) {
      console.error("Failed to upload base64 logo:", error)
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
      await new Promise((resolve) => setTimeout(resolve, 300))
      return CURRENCY_OPTIONS.map((option) => option.value)
    } catch (error) {
      console.error("Failed to get currencies:", error)
      throw error
    }
  }

  // Get available countries
  async getCountries(): Promise<Array<{ code: string; name: string; dialCode: string }>> {
    try {
      // Uncomment for real API call
      // const response = await this.api.get<{ countries: Array<{ code: string; name: string; dialCode: string }> }>("/configuration/countries")
      // return response.data.countries

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 300))
      return [
        { code: "DO", name: "República Dominicana", dialCode: "+1-809" },
        { code: "US", name: "Estados Unidos", dialCode: "+1" },
        { code: "MX", name: "México", dialCode: "+52" },
        { code: "CO", name: "Colombia", dialCode: "+57" },
        { code: "AR", name: "Argentina", dialCode: "+54" },
        { code: "ES", name: "España", dialCode: "+34" },
      ]
    } catch (error) {
      console.error("Failed to get countries:", error)
      throw error
    }
  }

  // Reset configuration to defaults
  async resetConfiguration(): Promise<BusinessConfiguration> {
    try {
      // Uncomment for real API call
      // const response = await this.api.post<BusinessConfiguration>("/configuration/reset")
      // return response.data

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const resetConfig: BusinessConfiguration = {
        id: "1",
        businessName: "",
        responsiblePerson: "",
        idNumber: "",
        phone: "",
        whatsapp: "",
        instagram: "",
        email: "",
        address: "",
        addressComplement: "",
        businessDescription: "",
        businessInfo: "",
        logo: "",
        currency: "DO - RD$",
        decimalPlaces: true,
        showCancelledTransactions: false,
        hideTransactions: true,
        updatedAt: new Date().toISOString(),
      }
      return resetConfig
    } catch (error) {
      console.error("Failed to reset configuration:", error)
      throw error
    }
  }

  // Export configuration
  async exportConfiguration(): Promise<Blob> {
    try {
      // Uncomment for real API call
      // const response = await this.api.get("/configuration/export", {
      //   responseType: "blob",
      // })
      // return response.data

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const configData = JSON.stringify(MOCK_CONFIGURATION, null, 2)
      return new Blob([configData], { type: "application/json" })
    } catch (error) {
      console.error("Failed to export configuration:", error)
      throw error
    }
  }

  // Import configuration
  async importConfiguration(file: File): Promise<BusinessConfiguration> {
    try {
      // Validate file
      if (file.type !== "application/json") {
        throw new Error("Please select a valid JSON file")
      }

      // Uncomment for real API call
      // const formData = new FormData()
      // formData.append("file", file)
      // const response = await this.api.post<BusinessConfiguration>("/configuration/import", formData, {
      //   headers: { "Content-Type": "multipart/form-data" }
      // })
      // return response.data

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Read file content
      const fileContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = () => reject(new Error("Failed to read file"))
        reader.readAsText(file)
      })

      // Parse JSON
      const importedConfig = JSON.parse(fileContent)

      // Validate imported data
      if (!importedConfig.businessName && !importedConfig.email) {
        throw new Error("Invalid configuration file format")
      }

      const updatedConfig: BusinessConfiguration = {
        ...MOCK_CONFIGURATION,
        ...importedConfig,
        id: MOCK_CONFIGURATION.id, // Keep original ID
        updatedAt: new Date().toISOString(),
      }

      return updatedConfig
    } catch (error) {
      console.error("Failed to import configuration:", error)
      throw error
    }
  }

  // Backup configuration
  async backupConfiguration(): Promise<Blob> {
    try {
      // Uncomment for real API call
      // const response = await this.api.get("/configuration/backup", {
      //   responseType: "blob",
      // })
      // return response.data

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 800))
      const backupData = {
        configuration: MOCK_CONFIGURATION,
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      }
      const backupContent = JSON.stringify(backupData, null, 2)
      return new Blob([backupContent], { type: "application/json" })
    } catch (error) {
      console.error("Failed to backup configuration:", error)
      throw error
    }
  }

  // Restore configuration from backup
  async restoreConfiguration(file: File): Promise<BusinessConfiguration> {
    try {
      // Validate file
      if (file.type !== "application/json") {
        throw new Error("Please select a valid backup file")
      }

      // Uncomment for real API call
      // const formData = new FormData()
      // formData.append("backup", file)
      // const response = await this.api.post<BusinessConfiguration>("/configuration/restore", formData, {
      //   headers: { "Content-Type": "multipart/form-data" }
      // })
      // return response.data

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Read file content
      const fileContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = () => reject(new Error("Failed to read backup file"))
        reader.readAsText(file)
      })

      // Parse JSON
      const backupData = JSON.parse(fileContent)

      // Validate backup data
      if (!backupData.configuration || !backupData.timestamp) {
        throw new Error("Invalid backup file format")
      }

      const restoredConfig: BusinessConfiguration = {
        ...MOCK_CONFIGURATION,
        ...backupData.configuration,
        id: MOCK_CONFIGURATION.id, // Keep original ID
        updatedAt: new Date().toISOString(),
      }

      return restoredConfig
    } catch (error) {
      console.error("Failed to restore configuration:", error)
      throw error
    }
  }
}

// Export singleton instance
const configurationService = new ConfigurationService()
export default configurationService
