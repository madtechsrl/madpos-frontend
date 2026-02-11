import type React from "react"
import { useState, useEffect } from "react"
import type { Product, Category, Brand, Supplier, Warehouse } from "../../types/products"
import { fetchCategories } from "../../services/category-service"
import { fetchBrands } from "../../services/brand-service"
import { fetchSuppliers } from "../../services/supplier-service"
import { fetchWarehouses } from "../../services/warehouse-service"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBarcode, faShuffle, faX } from "@fortawesome/free-solid-svg-icons"


interface ProductFormModalProps {
  product: Product | null
  onSave: (
    productData: Omit<Product, "id" | "createdAt" | "updatedAt">,
    packagingData: {
      packagingName: string
      barcode: string
      quantityPerPack: number
      unitMeasure: string
      costPrice: number
      salePrice: number
      minStock: number
      maxStock: number
      reorderPoint: number
    },
  ) => void
  onClose: () => void
}

export function ProductFormModal({ product, onSave, onClose }: ProductFormModalProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])

  // Datos del producto
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    categoryId: "",
    brandId: "",
    supplierId: "",
    imageUrl: "",
    status: "Activo" as "Activo" | "Inactivo",
    warehouseIds: [] as string[],
  })

  // Datos de la presentación por defecto
  const [packagingData, setPackagingData] = useState({
    packagingName: "Unidad",
    barcode: "",
    quantityPerPack: 1,
    unitMeasure: "Unidad",
    costPrice: 0,
    salePrice: 0,
    minStock: 10,
    maxStock: 100,
    reorderPoint: 20,
  })

  const [margin, setMargin] = useState(0)

  useEffect(() => {
    loadDropdownData()
  }, [])

  useEffect(() => {
    if (product) {
      setFormData({
        code: product.code,
        name: product.name,
        description: product.description || "",
        categoryId: product.categoryId,
        brandId: product.brandId || "",
        supplierId: product.supplierId || "",
        imageUrl: product.imageUrl || "",
        status: product.status,
        warehouseIds: product.warehouseIds,
      })
    } else {
      // Al crear nuevo producto, generar código automático
      generateProductCode()
      // Seleccionar todos los almacenes por defecto
      setFormData((prev) => ({
        ...prev,
        warehouseIds: warehouses.map((w) => w.id),
      }))
    }
  }, [product, warehouses])

  // Calcular margen automáticamente
  useEffect(() => {
    if (packagingData.costPrice > 0 && packagingData.salePrice > 0) {
      const calculatedMargin = ((packagingData.salePrice - packagingData.costPrice) / packagingData.costPrice) * 100
      setMargin(calculatedMargin)
    } else {
      setMargin(0)
    }
  }, [packagingData.costPrice, packagingData.salePrice])

  const loadDropdownData = async () => {
    const [categoriesData, brandsData, suppliersData, warehousesData] = await Promise.all([
      fetchCategories(),
      fetchBrands(),
      fetchSuppliers(),
      fetchWarehouses(),
    ])

    setCategories(categoriesData.filter((c) => c.status === "Activo"))
    setBrands(brandsData.filter((b) => b.status === "Activo"))
    setSuppliers(suppliersData.filter((s) => s.status === "Activo"))
    setWarehouses(warehousesData.filter((w) => w.status === "Activo"))
  }

  const generateProductCode = () => {
    const code = `PRD-${Date.now().toString().slice(-8)}`
    setFormData((prev) => ({ ...prev, code }))
  }

  const generateBarcode = () => {
    const random = Math.floor(Math.random() * 1000000000000)
    const barcode = random.toString().padStart(13, "0")
    setPackagingData((prev) => ({ ...prev, barcode }))
  }

  const handleWarehouseToggle = (warehouseId: string) => {
    setFormData((prev) => ({
      ...prev,
      warehouseIds: prev.warehouseIds.includes(warehouseId)
        ? prev.warehouseIds.filter((id) => id !== warehouseId)
        : [...prev.warehouseIds, warehouseId],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
 

    if (formData.warehouseIds.length === 0) {
      alert("Debes seleccionar al menos un almacén")
      return
    }

    // Si no hay código de barras, generar uno
    if (!packagingData.barcode) {
      generateBarcode()
    }

    onSave(formData, packagingData)
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
                {/* INFORMACIÓN BÁSICA DEL PRODUCTO */}
                <div className="col-12">
                  <h6 className="border-bottom pb-2 mb-3">
                    <i className="bi bi-box-seam me-2"></i>
                    Información Básica del Producto
                  </h6>
                </div>

                <div className="col-md-4">
                  <label className="form-label">
                    Código del Producto <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      required
                    />
                    {!product && (
                      <button type="button" className="btn btn-outline-secondary" onClick={generateProductCode}>
                        <FontAwesomeIcon icon={faShuffle}/>
                      </button>
                    )}
                  </div>
                </div>

                <div className="col-md-8">
                  <label className="form-label">
                    Nombre del Producto <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Cerveza Presidente 12oz"
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descripción detallada del producto"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">
                    Categoría <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Marca</label>
                  <select
                    className="form-select"
                    value={formData.brandId}
                    onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                  >
                    <option value="">Sin marca</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Suplidor</label>
                  <select
                    className="form-select"
                    value={formData.supplierId}
                    onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                  >
                    <option value="">Sin suplidor</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-8">
                  <label className="form-label">URL de Imagen</label>
                  <input
                    type="url"
                    className="form-control"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Estado</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "Activo" | "Inactivo" })}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>

                {/* ALMACENES */}
                <div className="col-12">
                  <h6 className="border-bottom pb-2 mb-3 mt-3">
                    <i className="bi bi-building me-2"></i>
                    Almacenes Disponibles <span className="text-danger">*</span>
                  </h6>
                </div>

                <div className="col-12">
                  <div className="row g-2">
                    {warehouses.map((warehouse) => (
                      <div key={warehouse.id} className="col-md-6">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`warehouse-${warehouse.id}`}
                            checked={formData.warehouseIds.includes(warehouse.id)}
                            onChange={() => handleWarehouseToggle(warehouse.id)}
                          />
                          <label className="form-check-label" htmlFor={`warehouse-${warehouse.id}`}>
                            <strong>{warehouse.code}</strong> - {warehouse.name}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  {formData.warehouseIds.length === 0 && (
                    <small className="text-danger">Debes seleccionar al menos un almacén</small>
                  )}
                </div>

                {/* PRESENTACIÓN POR DEFECTO */}
                <div className="col-12">
                  <h6 className="border-bottom pb-2 mb-3 mt-4">
                    <i className="bi bi-tag me-2"></i>
                    Presentación Principal {!product && <span className="text-danger">*</span>}
                  </h6>
                  {!product && (
                    <p className="text-muted small">
                      Configura la primera presentación del producto. Podrás agregar más presentaciones después.
                    </p>
                  )}
                </div>

                {!product && (
                  <>
                    <div className="col-md-6">
                      <label className="form-label">
                        Nombre de la Presentación <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={packagingData.packagingName}
                        onChange={(e) => setPackagingData({ ...packagingData, packagingName: e.target.value })}
                        placeholder="Ej: Unidad, Six-Pack, Caja 12"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Código de Barras <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          value={packagingData.barcode}
                          onChange={(e) => setPackagingData({ ...packagingData, barcode: e.target.value })}
                          placeholder="7501234567890"
                          required
                        />
                        <button type="button" className="btn btn-outline-secondary" onClick={generateBarcode}>
                          <FontAwesomeIcon icon={faBarcode}/>
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
                        value={packagingData.quantityPerPack}
                        onChange={(e) =>
                          setPackagingData({ ...packagingData, quantityPerPack: Number.parseInt(e.target.value) })
                        }
                        min="1"
                        required
                      />
                      <small className="text-muted">Unidades que contiene esta presentación</small>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Unidad de Medida <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={packagingData.unitMeasure}
                        onChange={(e) => setPackagingData({ ...packagingData, unitMeasure: e.target.value })}
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

                    <div className="col-md-4">
                      <label className="form-label">
                        Precio de Costo <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">RD$</span>
                        <input
                          type="number"
                          className="form-control"
                          value={packagingData.costPrice}
                          onChange={(e) =>
                            setPackagingData({ ...packagingData, costPrice: Number.parseFloat(e.target.value) })
                          }
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
                          value={packagingData.salePrice}
                          onChange={(e) =>
                            setPackagingData({ ...packagingData, salePrice: Number.parseFloat(e.target.value) })
                          }
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

                    <div className="col-md-4">
                      <label className="form-label">Stock Mínimo</label>
                      <input
                        type="number"
                        className="form-control"
                        value={packagingData.minStock}
                        onChange={(e) =>
                          setPackagingData({ ...packagingData, minStock: Number.parseInt(e.target.value) })
                        }
                        min="0"
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Stock Máximo</label>
                      <input
                        type="number"
                        className="form-control"
                        value={packagingData.maxStock}
                        onChange={(e) =>
                          setPackagingData({ ...packagingData, maxStock: Number.parseInt(e.target.value) })
                        }
                        min="0"
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Punto de Reorden</label>
                      <input
                        type="number"
                        className="form-control"
                        value={packagingData.reorderPoint}
                        onChange={(e) =>
                          setPackagingData({ ...packagingData, reorderPoint: Number.parseInt(e.target.value) })
                        }
                        min="0"
                      />
                    </div>

                    {/* <div className="col-12">
                      <div className="alert alert-info">
                        <strong>
                          <i className="bi bi-info-circle me-2"></i>
                          Resumen:
                        </strong>
                        <ul className="mb-0 mt-2">
                          <li>
                            Producto: <strong>{formData.name || "Sin nombre"}</strong>
                          </li>
                          <li>
                            Presentación: <strong>{packagingData.packagingName}</strong> de{" "}
                            <strong>{packagingData.quantityPerPack}</strong> {packagingData.unitMeasure}(s)
                          </li>
                          <li>
                            Precio unitario: RD${" "}
                            {packagingData.quantityPerPack > 0
                              ? (packagingData.salePrice / packagingData.quantityPerPack).toFixed(2)
                              : "0.00"}{" "}
                            por unidad
                          </li>
                          <li>
                            Ganancia: RD$ {(packagingData.salePrice - packagingData.costPrice).toFixed(2)} (
                            {margin.toFixed(1)}%)
                          </li>
                        </ul>
                      </div>
                    </div> */}
                  </>
                )}

                {product && (
                  <div className="col-12">
                    <div className="alert alert-warning">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Para modificar las presentaciones y precios, usa el botón "Gestionar Presentaciones" desde la
                      lista de productos.
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                <FontAwesomeIcon icon={faX} className="me-2" />
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                <i className="bi bi-save me-2"></i>
                {product ? "Actualizar Producto" : "Crear Producto y Presentación"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
