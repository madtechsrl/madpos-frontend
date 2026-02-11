import {useState, useEffect} from "react"
import type { Product, Packaging } from "../../types/products"
import { fetchPackagingsByProduct, createPackaging, updatePackaging, deletePackaging } from "../../services/packaging-service"

interface PackagingManagementProps {
  product: Product
  onClose: () => void
}

export function PackagingManagement({ product, onClose }: PackagingManagementProps) {
  const [packagings, setPackagings] = useState<Packaging[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPackaging, setEditingPackaging] = useState<Packaging | null>(null)

  const [formData, setFormData] = useState({
    type: "",
    unitsPerPackage: 1,
    barcode: "",
    sku: "",
    cost: 0,
    price: 0,    
    minStock: 0,
    maxStock: 0,
    status: "Activo",
  })

  useEffect(() => {
    loadPackagings()
  }, [product.id])

  const loadPackagings = async () => {
    try {
      setLoading(true)
      const data = await fetchPackagingsByProduct(product.id)
      setPackagings(data)
    } catch (error) {
      console.error("Error loading packagings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingPackaging(null)
    setFormData({
      type: "",
      unitsPerPackage: 1,
      barcode: "",
      sku: "",
      cost: 0,
      price: 0,      
      minStock:0,
      maxStock: 0,
      status: "Activo",
    })
    setShowForm(true)
  }

  const handleEdit = (packaging: Packaging) => {
    setEditingPackaging(packaging)
    setFormData({
      type: packaging.productId,
      unitsPerPackage: packaging.quantityPerPack,
      barcode: packaging.barcode || "",
      sku: packaging.barcode || "",
      cost: packaging.costPrice,
      price: packaging.salePrice,
      minStock: packaging.minStock || 0,
      maxStock: packaging.maxStock || 0,
      status: packaging.status,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar esta presentación?")) {
      await deletePackaging(id)
      loadPackagings()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingPackaging) {
        await updatePackaging(editingPackaging.id, formData)
      } else {
        await createPackaging({
          ...formData,
          productId: product.id,
        })
      }
      loadPackagings()
      setShowForm(false)
    } catch (error) {
      console.error("Error saving packaging:", error)
    }
  }

  const getMargin = (cost: number, price: number) => {
    if (cost === 0) return 0
    return ((price - cost) / cost) * 100
  }

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h5 className="modal-title">Presentaciones del Producto</h5>
              <p className="text-muted small mb-0">
                {product.name} • {product.code}
              </p>
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {!showForm ? (
              <>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <p className="text-muted mb-0">{packagings.length} presentaciones configuradas</p>
                  <button className="btn btn-primary btn-sm" onClick={handleCreate}>
                    <Plus size={16} className="me-1" />
                    Nueva Presentación
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                  </div>
                ) : packagings.length === 0 ? (
                  <div className="text-center py-5">
                    <Package size={48} className="text-muted mb-3" />
                    <h5>No hay presentaciones configuradas</h5>
                    <p className="text-muted">
                      Crea diferentes presentaciones para este producto (unidad, six-pack, caja, etc.)
                    </p>
                    <button className="btn btn-primary" onClick={handleCreate}>
                      <Plus size={16} className="me-1" />
                      Crear Primera Presentación
                    </button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Tipo</th>
                          <th>Unidades</th>
                          <th>SKU</th>
                          <th>Código de Barras</th>
                          <th className="text-end">Costo</th>
                          <th className="text-end">Precio</th>
                          <th className="text-end">Margen</th>
                          <th>Estado</th>
                          <th className="text-end">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {packagings.map((pkg) => (
                          <tr key={pkg.id}>
                            <td>
                              <strong>{pkg.productId}</strong>
                            </td>
                            <td>
                              <span className="badge bg-secondary">{pkg.quantityPerPack}x</span>
                            </td>
                            <td>
                              <code className="small">{pkg.id}</code>
                            </td>
                            <td>
                              <code className="small">{pkg.barcode || "-"}</code>
                            </td>
                            <td className="text-end">${pkg.costPrice.toFixed(2)}</td>
                            <td className="text-end">
                              <strong>${pkg.salePrice.toFixed(2)}</strong>
                            </td>
                            <td className="text-end">
                              <span className="text-success">+{getMargin(pkg.costPrice, pkg.salePrice).toFixed(0)}%</span>
                            </td>
                            <td>
                              <span className={`badge ${pkg.status === "Activo" ? "bg-success" : "bg-secondary"}`}>
                                {pkg.status}
                              </span>
                            </td>
                            <td className="text-end">
                              <div className="btn-group btn-group-sm">
                                <button className="btn btn-outline-primary" onClick={() => handleEdit(pkg)}>
                                  <Edit size={14} />
                                </button>
                                <button className="btn btn-outline-danger" onClick={() => handleDelete(pkg.id)}>
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">{editingPackaging ? "Editar Presentación" : "Nueva Presentación"}</h6>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setShowForm(false)}
                      >
                        <X size={16} className="me-1" />
                        Cancelar
                      </button>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Tipo de Presentación <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      required
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Unidad">Unidad</option>
                      <option value="Six-Pack">Six-Pack</option>
                      <option value="Caja">Caja</option>
                      <option value="Pallet">Pallet</option>
                      <option value="Media Caja">Media Caja</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Unidades por Paquete <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.unitsPerPackage}
                      onChange={(e) => setFormData({ ...formData, unitsPerPackage: Number.parseInt(e.target.value) })}
                      min="1"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">SKU</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Código de Barras</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.barcode}
                      onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Costo <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.cost}
                        onChange={(e) => setFormData({ ...formData, cost: Number.parseFloat(e.target.value) })}
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Precio de Venta <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    {formData.cost > 0 && formData.price > 0 && (
                      <small className="text-success">
                        Margen: +{getMargin(formData.cost, formData.price).toFixed(2)}%
                      </small>
                    )}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Peso</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.minStock}
                      onChange={(e) => setFormData({ ...formData, minStock: Number.parseFloat(e.target.value) })}
                      step="0.01"
                      min="0"
                    />
                  </div>

                  {/* <div className="col-md-4">
                    <label className="form-label">Unidad de Peso</label>
                    <select
                      className="form-select"
                      value={formData.weightUnit}
                      onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value as "kg" | "g" | "lb" })}
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="lb">lb</option>
                    </select>
                  </div> */}

                  <div className="col-md-4">
                    <label className="form-label">Estado</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>

                  {/* <div className="col-12">
                    <label className="form-label">Dimensiones (largo x ancho x alto)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      placeholder="30 x 20 x 15 cm"
                    />
                  </div> */}

                  <div className="col-12">
                    <div className="d-flex gap-2 justify-content-end">
                      <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                        Cancelar
                      </button>
                      <button type="submit" className="btn btn-primary">
                        {editingPackaging ? "Actualizar" : "Crear"} Presentación
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
