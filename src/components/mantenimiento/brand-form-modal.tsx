import type React from "react"
import { useState, useEffect } from "react"
import type { Brand } from "../../types/products"

interface BrandFormModalProps {
  brand: Brand | null
  onSave: (data: Omit<Brand, "id" | "createdAt" | "updatedAt">) => void
  onClose: () => void
}

export function BrandFormModal({ brand, onSave, onClose }: BrandFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    country: "",
    website: "",
    status: "Activo" as "Activo" | "Inactivo",
  })

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name,
        description: brand.description || "",
        logo: brand.logo || "",
        country: brand.country || "",
        website: brand.website || "",
        status: brand.status,
      })
    }
  }, [brand])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      description: formData.description || undefined,
      logo: formData.logo || undefined,
      country: formData.country || undefined,
      website: formData.website || undefined,
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <>
      <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{brand ? "Editar Marca" : "Nueva Marca"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">
                      Nombre <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="country" className="form-label">
                      País
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="República Dominicana"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Descripción
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="logo" className="form-label">
                      URL del Logo
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      id="logo"
                      name="logo"
                      value={formData.logo}
                      onChange={handleChange}
                      placeholder="https://ejemplo.com/logo.png"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="website" className="form-label">
                      Sitio Web
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://ejemplo.com"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="status" className="form-label">
                    Estado
                  </label>
                  <select
                    className="form-select"
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {brand ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
