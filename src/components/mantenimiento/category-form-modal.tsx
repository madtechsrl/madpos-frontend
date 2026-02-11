import type React from "react"

import { useState, useEffect } from "react"
import type { Category } from "../../types/products"

interface CategoryFormModalProps {
  category: Category | null
  onSave: (data: Omit<Category, "id" | "createdAt" | "updatedAt">) => void
  onClose: () => void
}

export function CategoryFormModal({ category, onSave, onClose }: CategoryFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    order: 1,
    status: "Activo" as "Activo" | "Inactivo",
    parentId: "",
  })

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        icon: category.icon || "",
        order: category.order,
        status: category.status,
        parentId: category.parentId || "",
      })
    }
  }, [category])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      parentId: formData.parentId || undefined,
      icon: formData.icon || undefined,
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? Number.parseInt(value) || 1 : value,
    }))
  }

  return (
    <>
      <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{category ? "Editar Categoría" : "Nueva Categoría"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
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

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Descripción <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="icon" className="form-label">
                      Icono (emoji)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="icon"
                      name="icon"
                      value={formData.icon}
                      onChange={handleChange}
                      placeholder="🍺"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="order" className="form-label">
                      Orden <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="order"
                      name="order"
                      value={formData.order}
                      onChange={handleChange}
                      min="1"
                      required
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
                  {category ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
