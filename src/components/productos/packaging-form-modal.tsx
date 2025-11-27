"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Packaging } from "../../types/products"

interface PackagingFormModalProps {
  packaging: Packaging | null
  productId: string
  productName: string
  onSave: (data: Omit<Packaging, "id" | "createdAt" | "updatedAt">) => void
  onClose: () => void
}

export function PackagingFormModal({ packaging, productId, productName, onSave, onClose }: PackagingFormModalProps) {
  const [formData, setFormData] = useState({
    packagingName: "",
    barcode: "",
    quantityPerPack: 1,
    unitMeasure: "Unidad",
    costPrice: 0,
    salePrice: 0,
    minStock: 0,
    maxStock: 0,
    reorderPoint: 0,
    status: "Activo" as "Activo" | "Inactivo",
  })

  const [margin, setMargin] = useState(0)

  useEffect(() => {
    if (packaging) {
      setFormData({
        packagingName: packaging.packagingName,
        barcode: packaging.barcode,
        quantityPerPack: packaging.quantityPerPack,
        unitMeasure: packaging.unitMeasure,
        costPrice: packaging.costPrice,
        salePrice: packaging.salePrice,
        minStock: packaging.minStock,
        maxStock: packaging.maxStock,
        reorderPoint: packaging.reorderPoint,
        status: packaging.status,
      })
    }
  }, [packaging])

  // Calcular margen automáticamente
  useEffect(() => {
    if (formData.costPrice > 0 && formData.salePrice > 0) {
      const calculatedMargin = ((formData.salePrice - formData.costPrice) / formData.costPrice) * 100
      setMargin(calculatedMargin)
    } else {
      setMargin(0)
    }
  }, [formData.costPrice, formData.salePrice])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSave({
      productId,
      ...formData,
    })
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateBarcode = () => {
    // Generar un código de barras EAN-13 simple (mock)
    const random = Math.floor(Math.random() * 1000000000000)
    const barcode = random.toString().padStart(13, "0")
    handleChange("barcode", barcode)
  }

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {packaging ? "Editar Presentación" : "Nueva Presentación"} - {productName}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                {/* Información de la Presentación */}
                <div className="col-12">
                  <h6 className="border-bottom pb-2 mb-3">Información de la Presentación</h6>
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Nombre de la Presentación <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.packagingName}
                    onChange={(e) => handleChange("packagingName", e.target.value)}
                    placeholder="Ej: Unidad, Six-Pack, Caja 12, Caja 24"
                    required
                  />
                  <small className="text-muted">Cómo se vende esta presentación</small>
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Código de Barras <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={formData.barcode}
                      onChange={(e) => handleChange("barcode", e.target.value)}
                      placeholder="7501234567890"
                      required
                    />
                    <button type="button" className="btn btn-outline-secondary" onClick={generateBarcode}>
                      <i className="bi bi-upc-scan"></i> Generar
                    </button>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Cantidad por Paquete <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.quantityPerPack}
                    onChange={(e) => handleChange("quantityPerPack", Number.parseInt(e.target.value))}
                    min="1"
                    required
                  />
                  <small className="text-muted">Cuántas unidades base contiene</small>
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Unidad de Medida <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={formData.unitMeasure}
                    onChange={(e) => handleChange("unitMeasure", e.target.value)}
                    required
                  >
                    <option value="Unidad">Unidad</option>
                    <option value="Paquete">Paquete</option>
                    <option value="Caja">Caja</option>
                    <option value="Six-Pack">Six-Pack</option>
                    <option value="Docena">Docena</option>
                    <option value="Barril">Barril</option>
                  </select>
                </div>

                {/* Precios */}
                <div className="col-12">
                  <h6 className="border-bottom pb-2 mb-3 mt-3">Precios</h6>
                </div>

                <div className="col-md-4">
                  <label className="form-label">
                    Precio de Costo <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">RD$</span>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.costPrice}
                      onChange={(e) => handleChange("costPrice", Number.parseFloat(e.target.value))}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label">
                    Precio de Venta <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">RD$</span>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.salePrice}
                      onChange={(e) => handleChange("salePrice", Number.parseFloat(e.target.value))}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Margen de Ganancia</label>
                  <div className="input-group">
                    <input type="text" className="form-control" value={margin.toFixed(2)} readOnly disabled />
                    <span className="input-group-text">%</span>
                  </div>
                  <small className={`${margin < 20 ? "text-danger" : "text-success"}`}>
                    {margin < 20 ? "Margen bajo" : "Margen saludable"}
                  </small>
                </div>

                {/* Control de Inventario */}
                <div className="col-12">
                  <h6 className="border-bottom pb-2 mb-3 mt-3">Control de Inventario</h6>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Stock Mínimo</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.minStock}
                    onChange={(e) => handleChange("minStock", Number.parseInt(e.target.value))}
                    min="0"
                  />
                  <small className="text-muted">Nivel mínimo aceptable</small>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Stock Máximo</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.maxStock}
                    onChange={(e) => handleChange("maxStock", Number.parseInt(e.target.value))}
                    min="0"
                  />
                  <small className="text-muted">Capacidad máxima</small>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Punto de Reorden</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.reorderPoint}
                    onChange={(e) => handleChange("reorderPoint", Number.parseInt(e.target.value))}
                    min="0"
                  />
                  <small className="text-muted">Cuando alertar</small>
                </div>

                {/* Estado */}
                <div className="col-12">
                  <h6 className="border-bottom pb-2 mb-3 mt-3">Estado</h6>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Estado de la Presentación</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>

                {/* Resumen */}
                <div className="col-12">
                  <div className="alert alert-info">
                    <strong>Resumen:</strong>
                    <ul className="mb-0 mt-2">
                      <li>
                        <strong>{formData.quantityPerPack}</strong> {formData.unitMeasure}(s) por{" "}
                        <strong>{formData.packagingName}</strong>
                      </li>
                      <li>
                        Precio unitario: RD$ {(formData.salePrice / formData.quantityPerPack).toFixed(2)} por unidad
                      </li>
                      <li>
                        Ganancia por {formData.packagingName}: RD${" "}
                        {(formData.salePrice - formData.costPrice).toFixed(2)}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                <i className="bi bi-x-circle me-2"></i>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                <i className="bi bi-save me-2"></i>
                {packaging ? "Actualizar" : "Crear"} Presentación
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
