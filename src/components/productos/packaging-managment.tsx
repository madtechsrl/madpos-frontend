import { useState, useEffect } from "react"
import type { Packaging } from "../../types/products"
import {
  fetchPackagingsByProduct,
  createPackaging,
  updatePackaging,
  deletePackaging,
} from "../../services/packaging-service"
import { PackagingFormModal } from "./packaging-form-modal"

interface PackagingManagementProps {
  productId: string
  productName: string
}

export function PackagingManagement({ productId, productName }: PackagingManagementProps) {
  const [packagings, setPackagings] = useState<Packaging[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedPackaging, setSelectedPackaging] = useState<Packaging | null>(null)

  useEffect(() => {
    loadPackagings()
  }, [productId])

  const loadPackagings = async () => {
    setLoading(true)
    try {
      const data = await fetchPackagingsByProduct(productId)
      setPackagings(data)
    } catch (error) {
      console.error("Error loading packagings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedPackaging(null)
    setShowModal(true)
  }

  const handleEdit = (packaging: Packaging) => {
    setSelectedPackaging(packaging)
    setShowModal(true)
  }

  const handleSave = async (data: Omit<Packaging, "id" | "createdAt" | "updatedAt">) => {
    try {
      if (selectedPackaging) {
        await updatePackaging(selectedPackaging.id, data)
      } else {
        await createPackaging(data)
      }
      await loadPackagings()
      setShowModal(false)
      setSelectedPackaging(null)
    } catch (error) {
      console.error("Error saving packaging:", error)
      alert("Error al guardar la presentación")
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar la presentación "${name}"?`)) {
      try {
        await deletePackaging(id)
        await loadPackagings()
      } catch (error) {
        console.error("Error deleting packaging:", error)
        alert("Error al eliminar la presentación")
      }
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="bi bi-box-seam me-2"></i>
          Presentaciones de: {productName}
        </h5>
        <button className="btn btn-primary btn-sm" onClick={handleCreate}>
          <i className="bi bi-plus-circle me-2"></i>
          Nueva Presentación
        </button>
      </div>

      <div className="card-body">
        {packagings.length === 0 ? (
          <div className="alert alert-warning">
            <i className="bi bi-exclamation-triangle me-2"></i>
            No hay presentaciones configuradas para este producto. Crea la primera presentación para poder venderlo.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Presentación</th>
                  <th>Código de Barras</th>
                  <th className="text-center">Cantidad</th>
                  <th className="text-end">Costo</th>
                  <th className="text-end">Precio</th>
                  <th className="text-end">Margen</th>
                  <th className="text-center">Stock</th>
                  <th className="text-center">Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {packagings.map((packaging) => {
                  const margin =
                    packaging.costPrice > 0
                      ? ((packaging.salePrice - packaging.costPrice) / packaging.costPrice) * 100
                      : 0

                  return (
                    <tr key={packaging.id}>
                      <td>
                        <strong>{packaging.packagingName}</strong>
                        <br />
                        <small className="text-muted">{packaging.unitMeasure}</small>
                      </td>
                      <td>
                        <code>{packaging.barcode}</code>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-secondary">{packaging.quantityPerPack}</span>
                      </td>
                      <td className="text-end">RD$ {packaging.costPrice.toFixed(2)}</td>
                      <td className="text-end">
                        <strong>RD$ {packaging.salePrice.toFixed(2)}</strong>
                      </td>
                      <td className="text-end">
                        <span
                          className={`badge ${margin >= 30 ? "bg-success" : margin >= 20 ? "bg-warning" : "bg-danger"}`}
                        >
                          {margin.toFixed(1)}%
                        </span>
                      </td>
                      <td className="text-center">
                        <small className="text-muted">
                          Min: {packaging.minStock} / Max: {packaging.maxStock}
                          <br />
                          Reorden: {packaging.reorderPoint}
                        </small>
                      </td>
                      <td className="text-center">
                        <span className={`badge ${packaging.status === "Activo" ? "bg-success" : "bg-secondary"}`}>
                          {packaging.status}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleEdit(packaging)}
                            title="Editar"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(packaging.id, packaging.packagingName)}
                            title="Eliminar"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <PackagingFormModal
          packaging={selectedPackaging}
          productId={productId}
          productName={productName}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false)
            setSelectedPackaging(null)
          }}
        />
      )}
    </div>
  )
}
