import { useEffect, useMemo, useState, type FormEvent } from "react"
import { Header } from "../components/layout/header"
import Sidebar from "../components/layout/sidebar"
import {
  createSupplier,
  deactivateSupplier,
  fetchSupplierRecords,
  updateSupplier,
  type SupplierPayload,
  type SupplierRecord,
} from "../services/product-service"

const emptyForm: SupplierPayload = {
  name: "",
  contactPerson: "",
  email: "",
  phone: "",
  address: "",
  rnc: "",
  isActive: true,
}

export default function ProveedoresPage() {
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>([])
  const [form, setForm] = useState<SupplierPayload>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [message, setMessage] = useState("")

  const load = async () => {
    try {
      setSuppliers(await fetchSupplierRecords())
    } catch (error: any) {
      setMessage(error.response?.data?.message || "No fue posible cargar los proveedores.")
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const filtered = useMemo(() => {
    const term = search.toLowerCase()
    return suppliers.filter((supplier) =>
      `${supplier.name} ${supplier.rnc || ""} ${supplier.phone || ""} ${supplier.contactPerson || ""}`
        .toLowerCase()
        .includes(term),
    )
  }, [suppliers, search])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      if (editingId) await updateSupplier(editingId, form)
      else await createSupplier(form)
      setMessage(editingId ? "Proveedor actualizado." : "Proveedor creado.")
      setForm(emptyForm)
      setEditingId(null)
      await load()
    } catch (error: any) {
      setMessage(error.response?.data?.message || "No fue posible guardar el proveedor.")
    }
  }

  const edit = (supplier: SupplierRecord) => {
    setEditingId(supplier.id)
    setForm({
      name: supplier.name,
      contactPerson: supplier.contactPerson || "",
      email: supplier.email || "",
      phone: supplier.phone || "",
      address: supplier.address || "",
      rnc: supplier.rnc || "",
      isActive: supplier.isActive,
    })
  }

  const deactivate = async (supplier: SupplierRecord) => {
    if (!window.confirm(`¿Desactivar el proveedor "${supplier.name}"?`)) return
    try {
      await deactivateSupplier(supplier)
      setMessage("Proveedor desactivado.")
      await load()
    } catch (error: any) {
      setMessage(error.response?.data?.message || "No fue posible desactivar el proveedor.")
    }
  }

  return (
    <div>
      <Header title="Proveedores" />
      <div className="d-flex">
        <Sidebar />
        <main className="flex-grow-1 p-4" style={{ marginLeft: 70 }}>
          {message && <div className="alert alert-info">{message}</div>}
          <div className="row g-4">
            <div className="col-lg-4">
              <form className="card shadow-sm" onSubmit={submit}>
                <div className="card-body">
                  <h5>{editingId ? "Editar proveedor" : "Nuevo proveedor"}</h5>
                  <label className="form-label mt-2">Nombre *</label>
                  <input className="form-control" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                  <label className="form-label mt-3">Persona de contacto</label>
                  <input className="form-control" value={form.contactPerson} onChange={(event) => setForm({ ...form, contactPerson: event.target.value })} />
                  <div className="row">
                    <div className="col-md-6">
                      <label className="form-label mt-3">RNC</label>
                      <input className="form-control" value={form.rnc} onChange={(event) => setForm({ ...form, rnc: event.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label mt-3">Teléfono</label>
                      <input className="form-control" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
                    </div>
                  </div>
                  <label className="form-label mt-3">Correo</label>
                  <input className="form-control" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
                  <label className="form-label mt-3">Dirección</label>
                  <textarea className="form-control" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
                </div>
                <div className="card-footer d-flex gap-2 justify-content-end">
                  {editingId && (
                    <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setForm(emptyForm) }}>
                      Cancelar
                    </button>
                  )}
                  <button className="btn btn-primary">Guardar</button>
                </div>
              </form>
            </div>
            <div className="col-lg-8">
              <div className="card shadow-sm">
                <div className="card-body">
                  <input className="form-control mb-3" placeholder="Buscar por nombre, RNC, teléfono o contacto" value={search} onChange={(event) => setSearch(event.target.value)} />
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead><tr><th>Proveedor</th><th>Contacto</th><th>RNC</th><th>Estado</th><th></th></tr></thead>
                      <tbody>
                        {filtered.map((supplier) => (
                          <tr key={supplier.id}>
                            <td><strong>{supplier.name}</strong><div className="small text-muted">{supplier.email || "Sin correo"}</div></td>
                            <td>{supplier.contactPerson || "—"}<div className="small text-muted">{supplier.phone || ""}</div></td>
                            <td>{supplier.rnc || "—"}</td>
                            <td><span className={`badge ${supplier.isActive ? "bg-success" : "bg-secondary"}`}>{supplier.isActive ? "Activo" : "Inactivo"}</span></td>
                            <td className="text-nowrap">
                              <button className="btn btn-sm btn-outline-primary me-2" onClick={() => edit(supplier)}>Editar</button>
                              {supplier.isActive && <button className="btn btn-sm btn-outline-danger" onClick={() => void deactivate(supplier)}>Desactivar</button>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
