import configurationService from "./configuration.service"
import mockConfigurationService from "..mock-configuration.service"

// Determine which service to use based on environment
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true" || process.env.NODE_ENV === "development"

// Export the appropriate service
export const ConfigurationService = USE_MOCK_API ? mockConfigurationService : configurationService

// Re-export types
export type { BusinessConfiguration, ConfigurationUpdateRequest, ApiError } from "./configuration.service"

// Export individual services if needed
export { default as RealConfigurationService } from "./configuration.service"
export { default as MockConfigurationService } from "./mock-configuration.service"
