import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import Sidebar from "../components/layout/sidebar"
import { Header } from "../components/layout/header"
import {
  createCustomer,
  deactivateCustomer,
  fetchCustomers,
  updateCustomer,
} from "../services/customer-service"
import type { Customer } from "../services/customer-service"

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  identificationNumber: "",
  fiscalCode: "",
}

export default function ClientesPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [message, setMessage] = useState("")

  const load = async () => {
    try {
      setCustomers(await fetchCustomers(search))
    } catch {
      setMessage("No fue posible cargar los clientes.")
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      if (editingId) await updateCustomer(editingId, form)
      else await createCustomer(form)
      setMessage(editingId ? "Cliente actualizado." : "Cliente creado.")
      setForm(emptyForm)
      setEditingId(null)
      await load()
    } catch {
      setMessage("No fue posible guardar el cliente. Verifique email e identificación.")
    }
  }

  const edit = (customer: Customer) => {
    setEditingId(customer.id)
    setForm({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
      identificationNumber: customer.identificationNumber || "",
      fiscalCode: customer.fiscalCode || "",
    })
  }

  return (
    <div>
      <Header title="Clientes" />
      <div className="d-flex">
        <Sidebar />
        <main className="flex-grow-1 p-4" style={{ marginLeft: 70 }}>
          {message && <div className="alert alert-info">{message}</div>}
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5>{editingId ? "Editar cliente" : "Nuevo cliente"}</h5>
                  <form onSubmit={submit} className="row g-3">
                    <div className="col-6"><input className="form-control" required placeholder="Nombre" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
                    <div className="col-6"><input className="form-control" required placeholder="Apellido" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
                    <div className="col-12"><input className="form-control" type="email" placeholder="Correo" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                    <div className="col-12"><input className="form-control" placeholder="Teléfono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                    <div className="col-6"><input className="form-control" placeholder="Cédula / RNC" value={form.identificationNumber} onChange={(e) => setForm({ ...form, identificationNumber: e.target.value })} /></div>
                    <div className="col-6"><input className="form-control" placeholder="Código fiscal" value={form.fiscalCode} onChange={(e) => setForm({ ...form, fiscalCode: e.target.value })} /></div>
                    <div className="col-12"><textarea className="form-control" placeholder="Dirección" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
                    <div className="col-12 d-flex gap-2">
                      <button className="btn btn-primary flex-grow-1">Guardar</button>
                      {editingId && <button type="button" className="btn btn-outline-secondary" onClick={() => { setEditingId(null); setForm(emptyForm) }}>Cancelar</button>}
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex gap-2 mb-3">
                    <input className="form-control" placeholder="Buscar por nombre o identificación" value={search} onChange={(e) => setSearch(e.target.value)} />
                    <button className="btn btn-outline-primary" onClick={() => void load()}>Buscar</button>
                  </div>
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead><tr><th>Cliente</th><th>Contacto</th><th>Identificación</th><th>Estado</th><th></th></tr></thead>
                      <tbody>
                        {customers.map((customer) => (
                          <tr key={customer.id}>
                            <td>{customer.firstName} {customer.lastName}</td>
                            <td><div>{customer.phone || "—"}</div><small className="text-muted">{customer.email || "—"}</small></td>
                            <td>{customer.identificationNumber || "—"}</td>
                            <td><span className={`badge ${customer.isActive ? "bg-success" : "bg-secondary"}`}>{customer.isActive ? "Activo" : "Inactivo"}</span></td>
                            <td className="text-end">
                              <button className="btn btn-sm btn-outline-primary me-2" onClick={() => edit(customer)}>Editar</button>
                              {customer.isActive && <button className="btn btn-sm btn-outline-danger" onClick={async () => { await deactivateCustomer(customer.id); await load() }}>Desactivar</button>}
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
