import { useEffect, useState } from "react"
import type { BaseCatalog, Supplier } from "../../types/catalogs"

interface CatalogService<T> {
  fetchAll: () => Promise<T[]>
  create: (payload: Partial<T>) => Promise<void>
  update: (id: string, payload: Partial<T>) => Promise<void>
  remove: (id: string) => Promise<void>
}

interface CatalogPageProps<T extends BaseCatalog> {
  title: string
  type?: "default" | "supplier"
  service: CatalogService<T>
}

export function CatalogPage<T extends BaseCatalog>({
  title,
  type = "default",
  service,
}: CatalogPageProps<T>) {
  const [items, setItems] = useState<T[]>([])
  const [newItem, setNewItem] = useState<Partial<T>>({ name: "" as T["name"] })
  const [editingItem, setEditingItem] = useState<T | null>(null)

  const loadData = async (): Promise<void> => {
    const data = await service.fetchAll()
    setItems(data)
  }

  const handleCreate = async (): Promise<void> => {
    if (!newItem.name) return
    await service.create(newItem)
    setNewItem({ ...newItem, name: e.value.target as T["name"] })
    await loadData()
  }

  const handleUpdate = async (id: string, updates: Partial<T>): Promise<void> => {
    await service.update(id, updates)
    setEditingItem(null)
    await loadData()
  }

  const handleDelete = async (id: string): Promise<void> => {
    await service.remove(id)
    await loadData()
  }

  useEffect(() => {
    void loadData()
  }, [])

  const isSupplier = type === "supplier"

  return (
    <div className="container mt-4">
      <h4 className="mb-3">{title}</h4>

      {/* Formulario de creación */}
      <div className="card mb-4 p-3 shadow-sm">
        <div className="row g-2 align-items-end">
          <div className="col-md-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              value={String(newItem.name ?? "")}
              onChange={(e) =>
                setNewItem({ ...newItem, name: e.target.value as T["name"] })
              }
            />
          </div>

          {isSupplier && (
            <>
              <div className="col-md-3">
                <label className="form-label">Contacto</label>
                <input
                  type="text"
                  className="form-control"
                  value={(newItem as Supplier).contactPerson ?? ""}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      contactPerson: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Teléfono</label>
                <input
                  type="text"
                  className="form-control"
                  value={(newItem as Supplier).phone ?? ""}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      phone: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">RNC</label>
                <input
                  type="text"
                  className="form-control"
                  value={(newItem as Supplier).rnc ?? ""}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      rnc: e.target.value,
                    })
                  }
                />
              </div>
            </>
          )}

          <div className="col-md-2">
            <button className="btn btn-primary w-100" onClick={handleCreate}>
              <i className="fas fa-plus me-2"></i> Agregar
            </button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <table className="table table-striped table-hover">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            {isSupplier && (
              <>
                <th>Contacto</th>
                <th>Teléfono</th>
                <th>RNC</th>
                <th>Estado</th>
              </>
            )}
            <th>Creado</th>
            <th>Actualizado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const supplier = item as Supplier
            return (
              <tr key={item.id}>
                <td>
                  {editingItem?.id === item.id ? (
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={item.name}
                      onBlur={(e) =>
                        handleUpdate(item.id, { name: e.target.value as T["name"] })
                      }
                      autoFocus
                    />
                  ) : (
                    item.name
                  )}
                </td>

                {isSupplier && (
                  <>
                    <td>{supplier.contactPerson ?? "-"}</td>
                    <td>{supplier.phone ?? "-"}</td>
                    <td>{supplier.rnc ?? "-"}</td>
                    <td>
                      <span
                        className={`badge ${
                          supplier.isActive ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {supplier.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                  </>
                )}

                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => setEditingItem(item)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
