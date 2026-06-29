import api from "../lib/api"

export type Company = {
  id: string
  name: string
  rnc: string
  logoUrl: string | null
  createdAt: string
  updatedAt: string
}

export async function fetchCompany(): Promise<Company | null> {
  const response = await api.get("/v1/settings/company")
  return response.data.data
}

export async function saveCompany(payload: {
  name: string
  rnc: string
  logo?: File | null
}): Promise<Company> {
  const body = new FormData()
  body.append("name", payload.name)
  body.append("rnc", payload.rnc)
  if (payload.logo) body.append("logo", payload.logo)

  const response = await api.put("/v1/settings/company", body)
  return response.data.data
}

export async function removeCompanyLogo(): Promise<Company> {
  const response = await api.delete("/v1/settings/company/logo")
  return response.data.data
}

export function companyAssetUrl(path?: string | null) {
  if (!path) return ""
  if (/^https?:\/\//.test(path)) return path
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8184"
  return `${apiUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`
}
