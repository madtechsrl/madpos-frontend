import { useEffect, useState, type FormEvent } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  createBrand,
  createCategory,
  createPackaging,
  createProduct,
  createSupplier,
  deactivatePackaging,
  fetchBrands,
  fetchCategories,
  fetchManagedProduct,
  fetchSuppliers,
  updatePackaging,
  updateProduct,
  type CatalogOption,
  type PackagingPayload,
} from "../../services/product-service"
import {
  adjustInventory,
  fetchWarehouses,
  type Warehouse,
} from "../../services/inventory-service"

type PackagingForm = PackagingPayload & {
  id?: string
  initialQuantity: number
}
type CatalogKind = "brand" | "category" | "supplier" | null

const emptyPackaging = (): PackagingForm => ({
  name: "Unidad",
  barcode: "",
  factorBase: 1,
  unitMeasure: "unit",
  contentQuantity: null,
  pricingMode: "FIXED_PRICE",
  fixedPrice: 0,
  minStock: null,
  maxStock: null,
  reorderPoint: null,
  status: 1,
  initialQuantity: 0,
})

export default function ProductFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editing = Boolean(id)
  const [loading, setLoading] = useState(editing)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [catalogKind, setCatalogKind] = useState<CatalogKind>(null)
  const [catalogSaving, setCatalogSaving] = useState(false)
  const [catalogForm, setCatalogForm] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    rnc: "",
    address: "",
  })
  const [brands, setBrands] = useState<CatalogOption[]>([])
  const [categories, setCategories] = useState<CatalogOption[]>([])
  const [suppliers, setSuppliers] = useState<CatalogOption[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [warehouseId, setWarehouseId] = useState("")
  const [form, setForm] = useState({
    sku: "",
    name: "",
    baseUom: "BOTELLA",
    description: "",
    categoryId: "",
    brandId: "",
    supplierId: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE" | "DISCONTINUED",
  })
  const [packagings, setPackagings] = useState<PackagingForm[]>([emptyPackaging()])
  const standardBaseUnits = ["BOTELLA", "LATA", "UNIDAD", "GALON", "LITRO", "BOLSA", "BARRIL", "PAQUETE"]
  const customBaseUnit = !standardBaseUnits.includes(form.baseUom)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [brandRecords, categoryRecords, supplierRecords, warehouseRecords] = await Promise.all([
          fetchBrands(),
          fetchCategories(),
          fetchSuppliers().catch(() => []),
          fetchWarehouses(),
        ])
        setBrands(brandRecords)
        setCategories(categoryRecords)
        setSuppliers(supplierRecords)
        setWarehouses(warehouseRecords)
        setWarehouseId((current) => current || warehouseRecords[0]?.id || "")

        if (id) {
          const product = await fetchManagedProduct(id)
          setForm({
            sku: product.sku,
            name: product.name,
            baseUom: product.baseUom,
            description: product.description || "",
            categoryId: product.category?.id || "",
            brandId: product.brand?.id || "",
            supplierId: product.supplier?.id || "",
            status: product.status,
          })
          setPackagings(
            product.packagings?.map((item) => ({
              id: item.id,
              name: item.name,
              barcode: item.barcode || "",
              factorBase: item.factorBase,
              unitMeasure: item.unitMeasure,
              contentQuantity: item.contentQuantity ?? null,
              pricingMode: "FIXED_PRICE",
              fixedPrice: item.fixedPrice || 0,
              minStock: item.minStock ?? null,
              maxStock: item.maxStock ?? null,
              reorderPoint: item.reorderPoint ?? null,
              status: item.status,
              initialQuantity: 0,
            })) || [],
          )
        }
      } catch (error: any) {
        setMessage(error.response?.data?.message || "No fue posible cargar el formulario.")
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [id])

  const updatePackage = <K extends keyof PackagingForm>(
    index: number,
    field: K,
    value: PackagingForm[K],
  ) => {
    setPackagings((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    )
  }

  const removePackage = async (index: number) => {
    const packaging = packagings[index]
    if (packaging.id && id) {
      if (!window.confirm(`¿Desactivar la presentación "${packaging.name}"?`)) return
      try {
        await deactivatePackaging(id, packaging.id)
        updatePackage(index, "status", 0)
        setMessage("Presentación desactivada.")
      } catch (error: any) {
        setMessage(error.response?.data?.message || "No fue posible desactivar la presentación.")
      }
      return
    }
    setPackagings((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  const openCatalog = (kind: Exclude<CatalogKind, null>) => {
    setCatalogKind(kind)
    setCatalogForm({
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
      rnc: "",
      address: "",
    })
  }

  const saveCatalog = async (event: FormEvent) => {
    event.preventDefault()
    if (!catalogKind || !catalogForm.name.trim()) return
    try {
      setCatalogSaving(true)
      if (catalogKind === "brand") {
        const created = await createBrand(catalogForm.name.trim())
        setBrands((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)))
        setForm((current) => ({ ...current, brandId: created.id }))
      } else if (catalogKind === "category") {
        const created = await createCategory(catalogForm.name.trim())
        setCategories((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)))
        setForm((current) => ({ ...current, categoryId: created.id }))
      } else {
        const created = await createSupplier({
          name: catalogForm.name.trim(),
          contactPerson: catalogForm.contactPerson.trim() || undefined,
          phone: catalogForm.phone.trim() || undefined,
          email: catalogForm.email.trim() || undefined,
          rnc: catalogForm.rnc.trim() || undefined,
          address: catalogForm.address.trim() || undefined,
          isActive: true,
        })
        setSuppliers((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)))
        setForm((current) => ({ ...current, supplierId: created.id }))
      }
      setCatalogKind(null)
      setMessage("Catálogo creado y seleccionado correctamente.")
    } catch (error: any) {
      setMessage(error.response?.data?.message || "No fue posible crear el registro.")
    } finally {
      setCatalogSaving(false)
    }
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!packagings.length) {
      setMessage("Agregue al menos una presentación.")
      return
    }
    if (packagings.some((item) => item.factorBase < 1 || item.fixedPrice < 0)) {
      setMessage("Revise los factores y precios de las presentaciones.")
      return
    }
    if (!editing && packagings.some((item) => item.initialQuantity < 0)) {
      setMessage("La existencia inicial no puede ser negativa.")
      return
    }
    if (!editing && packagings.some((item) => item.initialQuantity > 0) && !warehouseId) {
      setMessage("Seleccione un almacén para registrar la existencia inicial.")
      return
    }

    try {
      setSaving(true)
      setMessage("")
      if (!form.supplierId) {
        setMessage("Seleccione o cree un proveedor.")
        return
      }
      const payload = { ...form, supplierId: form.supplierId }
      const product = editing && id
        ? await updateProduct(id, payload)
        : await createProduct(payload)

      for (const packaging of packagings) {
        const {
          id: packagingId,
          initialQuantity,
          ...packagingPayload
        } = packaging
        let savedPackaging
        if (packagingId) {
          savedPackaging = await updatePackaging(product.id, packagingId, packagingPayload)
        } else {
          savedPackaging = await createPackaging(product.id, packagingPayload)
        }

        if (!editing && initialQuantity > 0) {
          await adjustInventory({
            warehouseId,
            productId: product.id,
            packagingId: savedPackaging.id,
            direction: "IN",
            mode: "DELTA",
            quantity: initialQuantity,
            notes: "Existencia inicial registrada al crear el producto",
          })
        }
      }

      navigate("/productos", {
        replace: true,
        state: { message: editing ? "Producto actualizado." : "Producto creado." },
      })
    } catch (error: any) {
      setMessage(error.response?.data?.message || "No fue posible guardar el producto.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-5 text-center">Cargando producto...</div>

  return (
    <div className="container py-4" style={{ maxWidth: 1100 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="mb-1">{editing ? "Editar producto" : "Nuevo producto"}</h2>
          <div className="text-muted">
            El inventario se controlará en la unidad base; las presentaciones son formas de venta.
          </div>
        </div>
        <Link to="/productos" className="btn btn-outline-secondary">Volver</Link>
      </div>

      {message && <div className="alert alert-warning">{message}</div>}

      <form onSubmit={submit}>
        <div className="card shadow-sm mb-4">
          <div className="card-header"><strong>Datos generales</strong></div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">SKU *</label>
                <input
                  className="form-control"
                  required
                  value={form.sku}
                  onChange={(event) => setForm({ ...form, sku: event.target.value })}
                />
              </div>
              <div className="col-md-8">
                <label className="form-label">Nombre *</label>
                <input
                  className="form-control"
                  required
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Unidad base *</label>
                <select
                  className="form-select"
                  value={customBaseUnit ? "OTRA" : form.baseUom}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      baseUom: event.target.value === "OTRA" ? "" : event.target.value,
                    })
                  }
                >
                  <option value="BOTELLA">Botella</option>
                  <option value="LATA">Lata</option>
                  <option value="UNIDAD">Unidad</option>
                  <option value="GALON">Galón</option>
                  <option value="LITRO">Litro</option>
                  <option value="BOLSA">Bolsa</option>
                  <option value="BARRIL">Barril</option>
                  <option value="PAQUETE">Paquete</option>
                  <option value="OTRA">Otra...</option>
                </select>
                {customBaseUnit && (
                  <input
                    className="form-control mt-2"
                    required
                    placeholder="Escriba la unidad base"
                    value={form.baseUom}
                    onChange={(event) =>
                      setForm({ ...form, baseUom: event.target.value.toUpperCase() })
                    }
                  />
                )}
              </div>
              <div className="col-md-4">
                <label className="form-label">Marca *</label>
                <div className="input-group">
                  <select
                    className="form-select"
                    required
                    value={form.brandId}
                    onChange={(event) => setForm({ ...form, brandId: event.target.value })}
                  >
                    <option value="">Seleccione</option>
                    {brands.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>
                  <button type="button" className="btn btn-outline-primary" onClick={() => openCatalog("brand")}>Nueva</button>
                </div>
              </div>
              <div className="col-md-4">
                <label className="form-label">Categoría *</label>
                <div className="input-group">
                  <select
                    className="form-select"
                    required
                    value={form.categoryId}
                    onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
                  >
                    <option value="">Seleccione</option>
                    {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>
                  <button type="button" className="btn btn-outline-primary" onClick={() => openCatalog("category")}>Nueva</button>
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label">Proveedor *</label>
                <div className="input-group">
                  <select
                    className="form-select"
                    required
                    value={form.supplierId}
                    onChange={(event) => setForm({ ...form, supplierId: event.target.value })}
                  >
                    <option value="">Seleccione</option>
                    {suppliers.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>
                  <button type="button" className="btn btn-outline-primary" onClick={() => openCatalog("supplier")}>Nuevo</button>
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label">Estado</label>
                <select
                  className="form-select"
                  value={form.status}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      status: event.target.value as typeof form.status,
                    })
                  }
                >
                  <option value="ACTIVE">Activo</option>
                  <option value="INACTIVE">Inactivo</option>
                  <option value="DISCONTINUED">Descontinuado</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <div>
              <strong>Presentaciones</strong>
              <div className="small text-muted">
                Ejemplo: botella ×1 y caja ×12. Cada una tiene su precio y código.
              </div>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={() => setPackagings((current) => [...current, emptyPackaging()])}
            >
              Agregar presentación
            </button>
          </div>
          <div className="card-body">
            {!editing && (
              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label">Almacén para la existencia inicial</label>
                  <select
                    className="form-select"
                    value={warehouseId}
                    onChange={(event) => setWarehouseId(event.target.value)}
                  >
                    {warehouses.map((warehouse) => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </option>
                    ))}
                  </select>
                  <div className="form-text">
                    Las cantidades iniciales se registrarán como entradas de inventario.
                  </div>
                </div>
              </div>
            )}
            {packagings.map((packaging, index) => (
              <div
                className={`border rounded p-3 mb-3 ${packaging.status === 0 ? "opacity-50" : ""}`}
                key={packaging.id || index}
              >
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label">Nombre *</label>
                    <input
                      className="form-control"
                      required
                      disabled={packaging.status === 0}
                      value={packaging.name}
                      onChange={(event) => updatePackage(index, "name", event.target.value)}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Unidades por presentación *</label>
                    <input
                      className="form-control"
                      type="number"
                      min={1}
                      step={1}
                      required
                      disabled={packaging.status === 0}
                      value={packaging.factorBase}
                      onChange={(event) =>
                        updatePackage(index, "factorBase", Number(event.target.value))
                      }
                    />
                    <div className="form-text">
                      Botella individual = 1; caja de 12 = 12.
                    </div>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Precio *</label>
                    <input
                      className="form-control"
                      type="number"
                      min={0}
                      step="0.01"
                      required
                      disabled={packaging.status === 0}
                      value={packaging.fixedPrice}
                      onChange={(event) =>
                        updatePackage(index, "fixedPrice", Number(event.target.value))
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Código de barras</label>
                    <input
                      className="form-control"
                      disabled={packaging.status === 0}
                      value={packaging.barcode || ""}
                      onChange={(event) => updatePackage(index, "barcode", event.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Forma comercial</label>
                    <select
                      className="form-select"
                      disabled={packaging.status === 0}
                      value={packaging.unitMeasure}
                      onChange={(event) =>
                        updatePackage(index, "unitMeasure", event.target.value)
                      }
                    >
                      <option value="unit">Unidad</option>
                      <option value="bottle">Botella</option>
                      <option value="can">Lata</option>
                      <option value="pack">Paquete</option>
                      <option value="box">Caja</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Stock mínimo</label>
                    <input
                      className="form-control"
                      type="number"
                      min={0}
                      disabled={packaging.status === 0}
                      value={packaging.minStock ?? ""}
                      onChange={(event) =>
                        updatePackage(
                          index,
                          "minStock",
                          event.target.value === "" ? null : Number(event.target.value),
                        )
                      }
                    />
                    <div className="form-text">Solo genera una alerta de reposición.</div>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Punto reposición</label>
                    <input
                      className="form-control"
                      type="number"
                      min={0}
                      disabled={packaging.status === 0}
                      value={packaging.reorderPoint ?? ""}
                      onChange={(event) =>
                        updatePackage(
                          index,
                          "reorderPoint",
                          event.target.value === "" ? null : Number(event.target.value),
                        )
                      }
                    />
                  </div>
                  <div className="col-md-5 d-flex align-items-end justify-content-end">
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      disabled={packaging.status === 0}
                      onClick={() => void removePackage(index)}
                    >
                      {packaging.id ? "Desactivar" : "Quitar"}
                    </button>
                  </div>
                  {!editing && (
                    <div className="col-md-3">
                      <label className="form-label">Existencia inicial</label>
                      <input
                        className="form-control"
                        type="number"
                        min={0}
                        step="0.001"
                        disabled={packaging.status === 0}
                        value={packaging.initialQuantity || ""}
                        placeholder="0"
                        onChange={(event) =>
                          updatePackage(
                            index,
                            "initialQuantity",
                            Math.max(0, Number(event.target.value) || 0),
                          )
                        }
                      />
                      <div className="form-text">
                        Cantidad física en esta presentación.
                      </div>
                    </div>
                  )}
                </div>
                <div className="small text-muted mt-2">
                  Vender 1 {packaging.name || "presentación"} descontará{" "}
                  <strong>{packaging.factorBase || 0}</strong> {form.baseUom.toLowerCase()}(s).
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <Link to="/productos" className="btn btn-secondary">Cancelar</Link>
          <button className="btn btn-primary" disabled={saving}>
            {saving ? "Guardando..." : "Guardar producto"}
          </button>
        </div>
      </form>
      {catalogKind && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,.45)" }}>
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={saveCatalog}>
              <div className="modal-header">
                <h5 className="modal-title">
                  {catalogKind === "brand"
                    ? "Nueva marca"
                    : catalogKind === "category"
                      ? "Nueva categoría"
                      : "Nuevo proveedor"}
                </h5>
                <button type="button" className="btn-close" onClick={() => setCatalogKind(null)} />
              </div>
              <div className="modal-body">
                <label className="form-label">Nombre *</label>
                <input
                  className="form-control mb-3"
                  required
                  autoFocus
                  value={catalogForm.name}
                  onChange={(event) => setCatalogForm({ ...catalogForm, name: event.target.value })}
                />
                {catalogKind === "supplier" && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Persona de contacto</label>
                      <input className="form-control" value={catalogForm.contactPerson} onChange={(event) => setCatalogForm({ ...catalogForm, contactPerson: event.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">RNC</label>
                      <input className="form-control" value={catalogForm.rnc} onChange={(event) => setCatalogForm({ ...catalogForm, rnc: event.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Teléfono</label>
                      <input className="form-control" value={catalogForm.phone} onChange={(event) => setCatalogForm({ ...catalogForm, phone: event.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Correo</label>
                      <input className="form-control" type="email" value={catalogForm.email} onChange={(event) => setCatalogForm({ ...catalogForm, email: event.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Dirección</label>
                      <textarea className="form-control" value={catalogForm.address} onChange={(event) => setCatalogForm({ ...catalogForm, address: event.target.value })} />
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setCatalogKind(null)}>Cancelar</button>
                <button className="btn btn-primary" disabled={catalogSaving}>
                  {catalogSaving ? "Guardando..." : "Crear y seleccionar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
