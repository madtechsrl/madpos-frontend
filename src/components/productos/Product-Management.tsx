import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  deactivateProduct,
  fetchManagedProducts,
  type ManagedProduct,
} from "../../services/product-service"

const money = (value: number) =>
  new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP" }).format(value)

export default function ProductManagement() {
  const [products, setProducts] = useState<ManagedProduct[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  const load = async () => {
    try {
      setLoading(true)
      setProducts(await fetchManagedProducts())
    } catch (error: any) {
      setMessage(error.response?.data?.message || "No fue posible cargar los productos.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return products
    return products.filter((product) =>
      `${product.name} ${product.sku} ${product.brand?.name || ""} ${product.category?.name || ""}`
        .toLowerCase()
        .includes(term),
    )
  }, [products, search])

  const deactivate = async (product: ManagedProduct) => {
    if (!window.confirm(`¿Desactivar el producto "${product.name}"?`)) return
    try {
      await deactivateProduct(product.id)
      setMessage("Producto desactivado. Su historial permanece disponible.")
      await load()
    } catch (error: any) {
      setMessage(error.response?.data?.message || "No fue posible desactivar el producto.")
    }
  }

  return (
    <div className="container-fluid">
      {message && <div className="alert alert-info">{message}</div>}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
            <div>
              <h4 className="mb-1">Mantenimiento de productos</h4>
              <div className="text-muted">
                Cada producto puede venderse en una o varias presentaciones.
              </div>
            </div>
            <Link to="/productos/nuevo" className="btn btn-primary align-self-start">
              Nuevo producto
            </Link>
          </div>

          <input
            className="form-control mb-3"
            style={{ maxWidth: 460 }}
            placeholder="Buscar por nombre, SKU, marca o categoría"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          {loading ? (
            <div className="py-5 text-center">Cargando productos...</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Marca / categoría</th>
                    <th>Unidad base</th>
                    <th>Presentaciones</th>
                    <th>Precios</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <strong>{product.name}</strong>
                        <div className="small text-muted">{product.sku}</div>
                      </td>
                      <td>
                        {product.brand?.name || "Sin marca"}
                        <div className="small text-muted">
                          {product.category?.name || "Sin categoría"}
                        </div>
                      </td>
                      <td>{product.baseUom}</td>
                      <td>
                        {product.packagings?.length || 0}
                        <div className="small text-muted">
                          {product.packagings
                            ?.slice()
                            .sort((a, b) => a.factorBase - b.factorBase)
                            .map((item) => `${item.name} × ${item.factorBase}`)
                            .join(" · ") || "Sin presentaciones"}
                        </div>
                      </td>
                      <td>
                        {product.packagings
                          ?.filter((item) => item.fixedPrice != null)
                          .map((item) => `${item.name}: ${money(item.fixedPrice || 0)}`)
                          .join(" · ") || "Sin precios"}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            product.status === "ACTIVE" ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          {product.status === "ACTIVE" ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="text-nowrap">
                        <Link
                          to={`/productos/${product.id}/editar`}
                          className="btn btn-sm btn-outline-primary me-2"
                        >
                          Editar
                        </Link>
                        {product.status === "ACTIVE" && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => void deactivate(product)}
                          >
                            Desactivar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!filtered.length && (
                    <tr>
                      <td colSpan={7} className="py-5 text-center text-muted">
                        No se encontraron productos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
