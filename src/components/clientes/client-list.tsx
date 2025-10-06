import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { type Client, type UpdateClientRequest } from "../../types/Client";
import { useAuth } from "../../contexts/auth-context";
import { fetchClients, deleteClient, updateClient } from "../../services/client-service";
import { ROLES } from "../../types/roles";
import { AxiosError } from "axios";
import ReactPaginate from "react-paginate";

interface ClientManagementProps {
  compact?: boolean;
  onClientSelect?: (client: Client) => void;
}

export default function ClientManagement({ compact = false }: ClientManagementProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated, hasPermission, token } = useAuth();

  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentClient, setCurrentClient] = useState<UpdateClientRequest | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const limit = 10;

  // 🔹 Cargar clientes (paginados + búsqueda backend)
  useEffect(() => {
    const loadClients = async () => {
      if (!isAuthenticated) {
        navigate("/");
        return;
      }

      if (!hasPermission(ROLES.ADMIN) && !hasPermission(ROLES.MANAGER)) {
        setError("Acceso denegado: requiere rol Admin o Manager");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetchClients(currentPage, limit, searchTerm);
        setClients(response.clients);
        setTotalPages(response.totalPages);
        setError(null);
      } catch (err) {
        console.error("Error al cargar clientes", err);
        setError("Error al cargar clientes");
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
  }, [currentPage, isAuthenticated, hasPermission, navigate, token, user, searchTerm]);

  // 🔹 Búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  // 🔹 Paginación
  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  // 🔹 Filtrado local adicional (UX instantáneo)
  const filteredClients = useMemo(() => {
    if (!searchTerm.trim()) return clients;
    const term = searchTerm.toLowerCase();
    return clients.filter(
      (client) =>
        client.firstName?.toLowerCase().includes(term) ||
        client.lastName?.toLowerCase().includes(term) ||
        client.email?.toLowerCase().includes(term) ||
        client.phone?.includes(term) ||
        client.address?.toLowerCase().includes(term)
    );
  }, [clients, searchTerm]);

  // 🔹 Editar cliente
  const handleEditClient = (c: Client) => {
    setCurrentClient({
      ...c,
      isActive: c.isActive ?? false,
    });
    setShowModal(true);
  };


  // 🧹 Limpiar búsqueda de clientes
const handleClearClientSearch = async () => {
  try {
    setSearchTerm("");       // limpia el campo del input
    setCurrentPage(0);       // vuelve a la primera página
    setIsLoading(true);      // muestra loader
    const response = await fetchClients(0, limit); // sin search
    setClients(response.clients);
    setTotalPages(response.totalPages);
    setError(null);
  } catch (err) {
    console.error("Error al limpiar búsqueda de clientes:", err);
    setError("Error al limpiar búsqueda de clientes.");
  } finally {
    setIsLoading(false);
  }
};

  // 🔹 Actualizar cliente (modal)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClient) return;
    try {
      const updatedClient = await updateClient(currentClient.id, currentClient);
      setClients((prev) =>
        prev.map((c) => (c.id === currentClient.id ? updatedClient : c))
      );
      setShowModal(false);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Error al actualizar cliente");
      } else {
        setError("Error desconocido al actualizar cliente");
      }
    }
  };

  // 🔹 Eliminar cliente
  const handleDeleteClient = async (id: string) => {
    if (!window.confirm("¿Estás seguro de eliminar este cliente?")) return;
    try {
      await deleteClient(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error al eliminar cliente", err);
      setError("No se pudo eliminar el cliente.");
    }
  };

  // 🔹 Manejar inputs del modal
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!currentClient) return;
    const { name, value } = e.target;

    setCurrentClient((prev) => ({
      ...prev!,
      [name]:
        name === "isActive"
          ? value === "true"
          : value,
    }));
  };

  // 🔹 Ir a registro de nuevo cliente
  const handleCreateClick = () => navigate("/client-registration");

  // 🔹 Loader
  if (isLoading && clients.length === 0) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2">Cargando clientes...</p>
      </div>
    );
  }

  return (
    <div className="container mt-3">
      {/* Header */}
      <div className="d-flex justify-content-end align-items-center mb-4">
        {/* <button className="btn btn-link text-dark p-0 me-3" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i>
        </button> */}
        <button className="btn btn-success" onClick={handleCreateClick}>
          <i className="fas fa-plus me-2" /> Nuevo Cliente
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {/* Búsqueda */}
      {!compact && (
        <div className="mb-3">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              placeholder="Buscar clientes..."
              className="form-control"
              value={searchTerm}
              onChange={handleSearchChange}
            />
 {searchTerm && (
    <button
      className="btn btn-outline-secondary"
      type="button"
      onClick={handleClearClientSearch}
    >
      <i className="fas fa-times"></i>
    </button>
  )}

          </div>
      </div>
      )}

      {/* Tabla */}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>ID Cliente</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>ID Fiscal</th>
              <th>Estado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id}>
                <td>{client.id.split("-")[0].toUpperCase()}</td>
                <td>
                  <div className="fw-semibold">{client.firstName}</div>
                  <small className="text-muted">{client.lastName}</small>
                </td>
                <td>{client.email}</td>
                <td>{client.address}</td>
                <td>{client.phone}</td>
                <td>{client.fiscalCode}</td>
                <td>
                  <span
                    className={`badge ${
                      client.isActive ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {client.isActive ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="text-end">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEditClient(client)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteClient(client.id)}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="d-flex justify-content-center mt-4">
        <ReactPaginate
        previousLabel={"← Anterior"}
        nextLabel={"Siguiente →"}
        breakLabel={"..."}
        pageCount={totalPages}
        onPageChange={handlePageClick}
        forcePage={currentPage} // 👈 mantiene sincronía
        containerClassName="pagination justify-content-center mt-4"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        activeClassName="active"
        />
      </div>

      {/* Modal edición */}
      {showModal && currentClient && (
        <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Cliente</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {[
                    { label: "Nombre", name: "firstName" },
                    { label: "Apellido", name: "lastName" },
                    { label: "Correo electrónico", name: "email" },
                    { label: "Teléfono", name: "phone" },
                    { label: "Dirección", name: "address" },
                    { label: "No. Identificación", name: "identificationNumber" },
                    { label: "Código Fiscal", name: "fiscalCode" },
                  ].map((field) => (
                    <div className="mb-3" key={field.name}>
                      <label htmlFor={field.name} className="form-label">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        id={field.name}
                        name={field.name}
                        className="form-control"
                        value={(currentClient as any)[field.name] || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  ))}

                  <div className="mb-3">
                    <label htmlFor="isActive" className="form-label">
                      Estado
                    </label>
                    <select
                      id="isActive"
                      name="isActive"
                      className="form-select"
                      value={currentClient.isActive ? "true" : "false"}
                      onChange={handleInputChange}
                    >
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success">
                    Actualizar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
