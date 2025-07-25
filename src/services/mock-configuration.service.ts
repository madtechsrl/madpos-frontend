import type { BusinessConfiguration, ConfigurationUpdateRequest } from "./configuration.service"

// Mock data
const mockConfiguration: BusinessConfiguration = {
  id: "1",
  businessName: "MADTECH",
  responsiblePerson: "NCF-",
  idNumber: "RNC-110-273645",
  phone: "",
  whatsapp: "",
  instagram: "",
  email: "",
  address: "",
  addressComplement: "",
  logo: "",
  currency: "DO-RD$",
  decimalPlaces: true,
  showCancelledTransactions: false,
  hideTransactions: true,
  extraInformation:
    "En este campo puede colocar la dirección de su negocio, horarios de funcionamiento y cualquier otra información.",
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z",
}

const mockCurrencies = [
  { code: "DO-RD$", name: "Dominican Peso", symbol: "RD$" },
  { code: "US-USD", name: "US Dollar", symbol: "$" },
  { code: "EU-EUR", name: "Euro", symbol: "€" },
  { code: "MX-MXN", name: "Mexican Peso", symbol: "$" },
  { code: "CO-COP", name: "Colombian Peso", symbol: "$" },
]

const mockCountries = [
  { code: "DO", name: "Dominican Republic", dialCode: "+1-809" },
  { code: "US", name: "United States", dialCode: "+1" },
  { code: "MX", name: "Mexico", dialCode: "+52" },
  { code: "CO", name: "Colombia", dialCode: "+57" },
  { code: "ES", name: "Spain", dialCode: "+34" },
]

// Utility function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

class MockConfigurationService {
  private configuration: BusinessConfiguration = { ...mockConfiguration }

  // Get business configuration
  async getConfiguration(): Promise<BusinessConfiguration> {
    await delay(500)
    return { ...this.configuration }
  }

  // Update business configuration
  async updateConfiguration(configData: ConfigurationUpdateRequest): Promise<BusinessConfiguration> {
    await delay(800)

    this.configuration = {
      ...this.configuration,
      ...configData,
      updatedAt: new Date().toISOString(),
    }

    return { ...this.configuration }
  }

  // Upload logo
  async uploadLogo(file: File): Promise<string> {
    await delay(1200)
    // Return a placeholder URL for the uploaded logo
    return `/placeholder.svg?height=120&width=120&text=${encodeURIComponent(file.name)}`
  }

  // Upload base64 logo
  async uploadBase64Logo(base64Data: string): Promise<string> {
    await delay(1000)
    // Return the base64 data itself for preview
    return base64Data
  }

  // Get available currencies
  async getCurrencies(): Promise<Array<{ code: string; name: string; symbol: string }>> {
    await delay(300)
    return [...mockCurrencies]
  }

  // Get available countries
  async getCountries(): Promise<Array<{ code: string; name: string; dialCode: string }>> {
    await delay(300)
    return [...mockCountries]
  }
}

// Export singleton instance
const mockConfigurationService = new MockConfigurationService()
export default mockConfigurationService
