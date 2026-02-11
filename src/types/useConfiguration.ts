import { useState, useEffect } from "react"
import configurationService, {
  type BusinessConfiguration,
  type ConfigurationUpdateRequest,
} from "../services/configuration.service"

export function useConfiguration() {
  const [configuration, setConfiguration] = useState<BusinessConfiguration | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [currencies, setCurrencies] = useState<string[]>([])

  // Load configuration on mount
  useEffect(() => {
    loadConfiguration()
    loadCurrencies()
  }, [])

  const loadConfiguration = async () => {
    try {
      setLoading(true)
      setError(null)
      const config = await configurationService.getConfiguration()
      setConfiguration(config)
    } catch (err: unknown) {
      setError(
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: unknown }).message)
          : "Failed to load configuration"
      )
    } finally {
      setLoading(false)
    }
  }

  const loadCurrencies = async () => {
    try {
      const currencyList = await configurationService.getCurrencies()
      setCurrencies(currencyList)
    } catch (err: unknown) {
      console.error("Failed to load currencies:", err)
    }
  }

  const updateConfiguration = async (updates: ConfigurationUpdateRequest) => {
    try {
      setSaving(true)
      setError(null)
      const updatedConfig = await configurationService.updateConfiguration(updates)
      setConfiguration(updatedConfig)
      setSuccess("Configuración actualizada exitosamente")

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: unknown) {
      setError(
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: unknown }).message)
          : "Failed to update configuration"
      )
    } finally {
      setSaving(false)
    }
  }

  const uploadLogo = async (file: File): Promise<string> => {
    try {
      setUploading(true)
      setError(null)

      // Validate file
      if (!file.type.startsWith("image/")) {
        throw new Error("Please select a valid image file")
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        throw new Error("Image size must be less than 5MB")
      }

      const logoUrl = await configurationService.uploadLogo(file)

      // Update configuration with new logo
      if (configuration) {
        await updateConfiguration({ logo: logoUrl })
      }

      return logoUrl
    } catch (err: unknown) {
      setError(
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: unknown }).message)
          : "Failed to upload logo"
      )
      throw err
    } finally {
      setUploading(false)
    }
  }

  const resetConfiguration = () => {
    if (configuration) {
      // Reset to original values
      loadConfiguration()
    }
  }

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  return {
    configuration,
    loading,
    saving,
    uploading,
    error,
    success,
    currencies,
    updateConfiguration,
    uploadLogo,
    resetConfiguration,
    clearMessages,
    reload: loadConfiguration,
  }
}
