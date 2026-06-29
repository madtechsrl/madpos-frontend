import { useEffect, useMemo, useState, type FormEvent } from "react"
import Sidebar from "../components/layout/sidebar"
import { Header } from "../components/layout/header"
import {
  adjustInventory,
  fetchInventory,
  fetchInventoryMovements,
  fetchWarehouses,
  type InventoryBalance,
  type InventoryMovement,
  type Warehouse,
} from "../services/inventory-service"

type AdjustmentMode = "IN" | "OUT" | "COUNT"

const movementLabel: Record<string, string> = {
  IN: "Entrada",
  OUT: "Salida",
  ADJUST_IN: "Ajuste de entrada",
  ADJUST_OUT: "Ajuste de salida",
  TRANSFER_IN: "Transferencia recibida",
  TRANSFER_OUT: "Transferencia enviada",
}

export default function InventarioPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [warehouseId, setWarehouseId] = useState("")
  const [inventory, setInventory] = useState<InventoryBalance[]>([])
  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [selected, setSelected] = useState<InventoryBalance | null>(null)
  const [operation, setOperation] = useState<AdjustmentMode>("IN")
  const [packagingId, setPackagingId] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [unitCostBase, setUnitCostBase] = useState("")
  const [notes, setNotes] = useState("")
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<"balances" | "movements">("balances")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadWarehouses = async () => {
      try {
        const records = await fetchWarehouses()
        setWarehouses(records)
        if (records.length) setWarehouseId(records[0].id)
      } catch (error: any) {
        setMessage(error.response?.data?.message || "No fue posible cargar los almacenes.")
      }
    }
    void loadWarehouses()
  }, [])

  const load = async (selectedWarehouseId = warehouseId) => {
    if (!selectedWarehouseId) return
    try {
      setLoading(true)
      const [balances, movementRecords] = await Promise.all([
        fetchInventory(selectedWarehouseId),
        fetchInventoryMovements(selectedWarehouseId),
      ])
      setInventory(balances)
      setMovements(movementRecords)
    } catch (error: any) {
      setMessage(error.response?.data?.message || "No fue posible cargar el inventario.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load(warehouseId)
  }, [warehouseId])

  const openAdjustment = (item: InventoryBalance) => {
    setSelected(item)
    setOperation("IN")
    setPackagingId(item.packagings[0]?.id || "")
    setQuantity(1)
    setUnitCostBase("")
    setNotes("")
  }

  const selectedPackaging = selected?.packagings.find((item) => item.id === packagingId)
  const convertedQuantity = quantity * (selectedPackaging?.factorBase || 1)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!selected) return
    try {
      await adjustInventory({
        warehouseId: selected.warehouseId,
        productId: selected.productId,
        packagingId: packagingId || undefined,
        direction: operation === "OUT" ? "OUT" : "IN",
        mode: operation === "COUNT" ? "COUNT" : "DELTA",
        quantity,
        unitCostBase:
          operation === "IN" && unitCostBase !== "" ? Number(unitCostBase) : undefined,
        notes,
      })
      setMessage(
        operation === "COUNT"
          ? "Conteo físico aplicado correctamente."
          : "Movimiento de inventario registrado correctamente.",
      )
      setSelected(null)
      await load()
    } catch (error: any) {
      setMessage(error.response?.data?.message || "No fue posible aplicar el movimiento.")
    }
  }

  const filtered = useMemo(
    () =>
      inventory.filter((item) =>
        `${item.productName} ${item.sku} ${item.brand || ""}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [inventory, search],
  )

  return (
    <div>
      <Header title="Inventario por almacén" />
      <div className="d-flex">
        <Sidebar />
        <main className="flex-grow-1 p-4" style={{ marginLeft: 70 }}>
          {message && <div className="alert alert-info">{message}</div>}

          <div className="card shadow-sm mb-4">
            <div className="card-body d-flex flex-column flex-md-row gap-3 align-items-md-end">
              <div style={{ minWidth: 280 }}>
                <label className="form-label">Almacén</label>
                <select
                  className="form-select"
                  value={warehouseId}
                  onChange={(event) => setWarehouseId(event.target.value)}
                >
                  {warehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex-grow-1">
                <label className="form-label">Buscar producto</label>
                <input
                  className="form-control"
                  placeholder="Nombre, SKU o marca"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <button className="btn btn-outline-secondary" onClick={() => void load()}>
                Actualizar
              </button>
            </div>
          </div>

          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "balances" ? "active" : ""}`}
                onClick={() => setActiveTab("balances")}
              >
                Existencias
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "movements" ? "active" : ""}`}
                onClick={() => setActiveTab("movements")}
              >
                Historial de movimientos
              </button>
            </li>
          </ul>

          {loading ? (
            <div className="py-5 text-center">Cargando inventario...</div>
          ) : activeTab === "balances" ? (
            <div className="card shadow-sm">
              <div className="card-body table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Existencia base</th>
                      <th>Equivalencias</th>
                      <th>Disponible</th>
                      <th>Actualizado</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.productName}</strong>
                          <div className="small text-muted">
                            {item.sku} · {item.brand || "Sin marca"} · {item.category || "Sin categoría"}
                          </div>
                        </td>
                        <td>
                          {item.quantity} {item.baseUom.toLowerCase()}(s)
                        </td>
                        <td>
                          {item.equivalents
                            .filter((equivalent) => equivalent.factorBase > 1)
                            .map((equivalent) => (
                              <span className="badge bg-light text-dark border me-1" key={equivalent.packagingId}>
                                {equivalent.completePackages} {equivalent.name}
                              </span>
                            ))}
                          {!item.equivalents.some((equivalent) => equivalent.factorBase > 1) && (
                            <span className="text-muted">Solo unidad base</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${item.available <= 0 ? "bg-danger" : item.available <= 5 ? "bg-warning text-dark" : "bg-success"}`}>
                            {item.available}
                          </span>
                        </td>
                        <td>{new Date(item.updatedAt).toLocaleString("es-DO")}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary" onClick={() => openAdjustment(item)}>
                            Registrar movimiento
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="card shadow-sm">
              <div className="card-body table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr><th>Fecha</th><th>Producto</th><th>Movimiento</th><th>Capturado</th><th>Unidades base</th><th>Motivo</th></tr>
                  </thead>
                  <tbody>
                    {movements.map((movement) => (
                      <tr key={movement.id}>
                        <td>{new Date(movement.createdAt).toLocaleString("es-DO")}</td>
                        <td><strong>{movement.product}</strong><div className="small text-muted">{movement.sku}</div></td>
                        <td>{movementLabel[movement.type] || movement.type}</td>
                        <td>
                          {movement.packageQuantity != null && movement.packaging
                            ? `${movement.packageQuantity} ${movement.packaging}`
                            : `${movement.quantity} ${movement.baseUom.toLowerCase()}(s)`}
                        </td>
                        <td>{movement.quantity}</td>
                        <td>{movement.notes || "—"}</td>
                      </tr>
                    ))}
                    {!movements.length && <tr><td colSpan={6} className="text-center py-5 text-muted">No hay movimientos registrados.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {selected && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,.45)" }}>
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={submit}>
              <div className="modal-header">
                <div>
                  <h5 className="modal-title">{selected.productName}</h5>
                  <div className="small text-muted">{selected.warehouseName}</div>
                </div>
                <button type="button" className="btn-close" onClick={() => setSelected(null)} />
              </div>
              <div className="modal-body">
                <div className="alert alert-light">
                  Existencia actual: <strong>{selected.quantity} {selected.baseUom.toLowerCase()}(s)</strong>
                </div>
                <label className="form-label">Operación</label>
                <select className="form-select mb-3" value={operation} onChange={(event) => setOperation(event.target.value as AdjustmentMode)}>
                  <option value="IN">Entrada</option>
                  <option value="OUT">Salida manual</option>
                  <option value="COUNT">Conteo físico final</option>
                </select>

                <label className="form-label">Presentación</label>
                <select className="form-select mb-3" required value={packagingId} onChange={(event) => setPackagingId(event.target.value)}>
                  {selected.packagings.map((packaging) => (
                    <option key={packaging.id} value={packaging.id}>
                      {packaging.name} — {packaging.factorBase} {selected.baseUom.toLowerCase()}(s)
                    </option>
                  ))}
                </select>

                <label className="form-label">
                  {operation === "COUNT" ? "Cantidad física contada" : "Cantidad"}
                </label>
                <input className="form-control" type="number" min="0.001" step="0.001" required value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} />
                <div className="form-text mb-3">
                  Equivale a <strong>{convertedQuantity}</strong> {selected.baseUom.toLowerCase()}(s).
                  {operation === "COUNT" && " Esta será la existencia final registrada."}
                </div>

                {operation === "IN" && (
                  <>
                    <label className="form-label">Costo por unidad base (opcional)</label>
                    <input className="form-control mb-3" type="number" min="0" step="0.0001" value={unitCostBase} onChange={(event) => setUnitCostBase(event.target.value)} />
                  </>
                )}

                <label className="form-label">Motivo</label>
                <textarea className="form-control" required value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Compra, rotura, conteo físico, entrada inicial..." />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelected(null)}>Cancelar</button>
                <button className="btn btn-primary">Aplicar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
