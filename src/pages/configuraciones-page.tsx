import { useEffect, useMemo, useState, type FormEvent } from "react"
import { Header } from "../components/layout/header"
import Sidebar from "../components/layout/sidebar"
import {
  companyAssetUrl,
  fetchCompany,
  removeCompanyLogo,
  saveCompany,
} from "../services/company-service"

export default function ConfiguracionesPage() {
  const [name, setName] = useState("")
  const [rnc, setRnc] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [logo, setLogo] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const previewUrl = useMemo(
    () => (logo ? URL.createObjectURL(logo) : companyAssetUrl(logoUrl)),
    [logo, logoUrl],
  )

  useEffect(() => {
    return () => {
      if (logo && previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl)
    }
  }, [logo, previewUrl])

  useEffect(() => {
    void fetchCompany()
      .then((company) => {
        if (!company) return
        setName(company.name)
        setRnc(company.rnc)
        setLogoUrl(company.logoUrl || "")
      })
      .catch((requestError: any) => {
        setError(requestError.response?.data?.message || "No fue posible cargar la empresa.")
      })
      .finally(() => setLoading(false))
  }, [])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      setSaving(true)
      setError("")
      setMessage("")
      const company = await saveCompany({ name, rnc, logo })
      setName(company.name)
      setRnc(company.rnc)
      setLogoUrl(company.logoUrl || "")
      setLogo(null)
      setMessage("Datos de la empresa guardados correctamente.")
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "No fue posible guardar la empresa.")
    } finally {
      setSaving(false)
    }
  }

  const removeLogo = async () => {
    try {
      setSaving(true)
      setError("")
      const company = await removeCompanyLogo()
      setLogo(null)
      setLogoUrl(company.logoUrl || "")
      setMessage("Logo eliminado correctamente.")
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "No fue posible eliminar el logo.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <Header title="Configuraciones" />
      <div className="d-flex">
        <Sidebar />
        <main className="flex-grow-1 p-4">
          <div className="container-fluid" style={{ maxWidth: 1000 }}>
            <ul className="nav nav-tabs mb-4">
              <li className="nav-item">
                <button className="nav-link active" type="button">
                  <i className="fas fa-building me-2" />
                  Empresa
                </button>
              </li>
            </ul>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-1">Empresa propietaria</h5>
                <div className="small text-muted">
                  Estos datos identificarán el negocio propietario de este punto de venta.
                </div>
              </div>
              <div className="card-body p-4">
                {loading ? (
                  <div className="py-5 text-center">Cargando configuración...</div>
                ) : (
                  <form onSubmit={submit}>
                    <div className="row g-4">
                      <div className="col-lg-8">
                        <div className="mb-3">
                          <label className="form-label">Nombre de la empresa *</label>
                          <input
                            className="form-control"
                            required
                            maxLength={255}
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Ej. Distribuidora del Norte, SRL"
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">RNC o cédula *</label>
                          <input
                            className="form-control"
                            required
                            inputMode="numeric"
                            maxLength={13}
                            value={rnc}
                            onChange={(event) => setRnc(event.target.value)}
                            placeholder="9 u 11 dígitos"
                          />
                          <div className="form-text">
                            Puede escribirlo con guiones; el sistema almacenará solo los dígitos.
                          </div>
                        </div>

                        <div>
                          <label className="form-label">Logo de la empresa</label>
                          <input
                            className="form-control"
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/svg+xml"
                            onChange={(event) => setLogo(event.target.files?.[0] || null)}
                          />
                          <div className="form-text">Imagen opcional, máximo 5 MB.</div>
                        </div>
                      </div>

                      <div className="col-lg-4">
                        <div
                          className="border rounded d-flex align-items-center justify-content-center bg-light overflow-hidden"
                          style={{ minHeight: 220 }}
                        >
                          {previewUrl ? (
                            <img
                              src={previewUrl}
                              alt="Logo de la empresa"
                              style={{ maxWidth: "100%", maxHeight: 210, objectFit: "contain" }}
                            />
                          ) : (
                            <div className="text-center text-muted p-4">
                              <i className="fas fa-building fa-3x mb-3" />
                              <div>Sin logo</div>
                            </div>
                          )}
                        </div>
                        {(logoUrl || logo) && (
                          <button
                            className="btn btn-sm btn-outline-danger w-100 mt-2"
                            type="button"
                            disabled={saving}
                            onClick={() => {
                              if (logo) setLogo(null)
                              else void removeLogo()
                            }}
                          >
                            Quitar logo
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="d-flex justify-content-end mt-4">
                      <button className="btn btn-primary px-4" disabled={saving}>
                        {saving ? "Guardando..." : "Guardar empresa"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
