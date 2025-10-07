"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Product, Category, Brand, Supplier, Warehouse } from "../../types/products"

interface ProductFormModalProps {
  product: Product | null
  categories: Category[]
  brands: Brand[]
  suppliers: Supplier[]
  warehouses: Warehouse[]
  onSave: (data: any) => void
  onClose: () => void
}

export function ProductFormModal({
  product,
  categories,
  brands,
  suppliers,
  warehouses,
  onSave,
  onClose,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    categoryId: "",
    brandId: "",
    supplierId: "",
    alcoholContent: 0,
    volume: 0,
    volumeUnit: "ml" as "ml" | "L" | "oz",
    container: "",
    featured: false,
    taxable: true,
    taxRate: 0.18,
    status: "Activo",
    tags: "",
    images: [] as string[],
  })

  useEffect(() => {
    if (product) {
      setFormData({
        code: product.code,
        name: product.name,
        description: product.description || "",
        categoryId: product.categoryId,
        brandId: product.brandId,
        supplierId: product.supplierId || "",
        alcoholContent: product.alcoholContent || 0,
        volume: product.volume || 0,
        volumeUnit: product.volumeUnit || "ml",
        container: product.container || "",
        featured: product.featured,
        taxable: product.taxable,
        taxRate: product.taxRate || 0.18,
        status: product.status,
        tags: product.tags?.join(", ") || "",
        images: product.images || [],
      })
    }
  }, [product])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const dataToSave = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    }

    onSave(dataToSave)
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{product ? "Editar Producto" : "Nuevo Producto"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                {/* Información Básica */}
                <div className="col-12">
                  <h6 className="border-bottom pb-2 mb-3">Información Básica</h6>
                </div>

                <div className="col-md-4">
                  <label className="form-label">
                    Código SKU <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.code}
                    onChange={(e) => handleChange("code", e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-8">
                  <label className="form-label">
                    Nombre del Producto <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                  />
                </div>

                {/* Clasificación */}
                <div className="col-12">
                  <h6 className="border-bottom pb-2 mb-3 mt-3">Clasificación</h6>
                </div>

                <div className="col-md-4">
                  <label className="form-label">
                    Categoría <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={formData.categoryId}
                    onChange={(e) => handleChange("categoryId", e.target.value)}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label">
                    Marca <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={formData.brandId}
                    onChange={(e) => handleChange("brandId", e.target.value)}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Suplidor Principal</label>
                  <select
                    className="form-select"
                    value={formData.supplierId}
                    onChange={(e) => handleChange("supplierId", e.target.value)}
                  >
                    <option value="">Seleccionar...</option>
                    {suppliers.map((sup) => (
                      <option key={sup.id} value={sup.id}>
                        {sup.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Características del Producto */}
                <div className="col-12">
                  <h6 className="border-bottom pb-2 mb-3 mt-3">Características</h6>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Volumen</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.volume}
                    onChange={(e) => handleChange("volume", Number.parseFloat(e.target.value))}
                    step="0.01"
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Unidad</label>
                  <select
                    className="form-select"
                    value={formData.volumeUnit}
                    onChange={(e) => handleChange("volumeUnit", e.target.value)}
                  >
                    <option value="ml">ml</option>
                    <option value="L">L</option>
                    <option value="oz">oz</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">% Alcohol</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.alcoholContent}
                    onChange={(e) => handleChange("alcoholContent", Number.parseFloat(e.target.value))}
                    step="0.1"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Tipo de Envase</label>
                  <select
                    className="form-select"
                    value={formData.container}
                    onChange={(e) => handleChange("container", e.target.value)}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Botella">Botella</option>
                    <option value="Lata">Lata</option>
                    <option value="Barril">Barril</option>
                    <option value="Caja">Caja</option>
                    <option value="Six-Pack">Six-Pack</option>
                  </select>
                </div>

                {/* Configuración Fiscal y Estado */}
                <div className="col-12">
                  <h6 className="border-bottom pb-2 mb-3 mt-3">Configuración</h6>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Estado</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                    <option value="Descontinuado">Descontinuado</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Tasa de Impuesto</label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      value={formData.taxRate * 100}
                      onChange={(e) => handleChange("taxRate", Number.parseFloat(e.target.value) / 100)}
                      step="0.01"
                      min="0"
                      max="100"
                      disabled={!formData.taxable}
                    />
                    <span className="input-group-text">%</span>
                  </div>
                </div>

                <div className="col-md-3">
                  <label className="form-label d-block">&nbsp;</label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="taxable"
                      checked={formData.taxable}
                      onChange={(e) => handleChange("taxable", e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="taxable">
                      Aplica impuesto
                    </label>
                  </div>
                </div>

                <div className="col-md-3">
                  <label className="form-label d-block">&nbsp;</label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => handleChange("featured", e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="featured">
                      Producto destacado
                    </label>
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label">Tags (separados por coma)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.tags}
                    onChange={(e) => handleChange("tags", e.target.value)}
                    placeholder="cerveza, importada, premium"
                  />
                </div>

                {/* Nota informativa */}
                <div className="col-12">
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>Nota:</strong> Las presentaciones (unidad, six-pack, caja, etc.) y sus precios se configuran
                    después de crear el producto, en la sección de "Packagings".
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                <i className="bi bi-save me-2"></i>
                {product ? "Actualizar" : "Crear"} Producto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
