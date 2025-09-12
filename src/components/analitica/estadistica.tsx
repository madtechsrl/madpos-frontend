// StatsPage.tsx (Vite + Bootstrap + FontAwesome)
import { useState, useEffect } from "react";
import type { User } from "../../types/User";
import { useAuth } from "../../contexts/auth-context";
import  {RoleGuard} from "./role-guard";
import { useAnalytics } from "../../lib/use-analitycs";
import { fetchUsers } from "../../services/user-service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faUsers, faSync, faCircle } from "@fortawesome/free-solid-svg-icons";
import { UserRole } from "../../types/roles";

export default function StatsPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    fetchUsers().then(setUsers).catch((error) => console.error(error));
  }, []);
  const [selectedUserId, setSelectedUserId] = useState<string>("all");
  // const [selectedPeriod, setSelectedPeriod] = useState<"hour" | "day" | "week" | "month">("hour");
  const [currentDate, setCurrentDate] = useState(new Date());
 const currentUserRole = user?.role ? user.role : UserRole.ADMIN;
  const {
    analytics,
    topProducts,
    topCustomers,
    topSellers,
    hourlySales,
    loading,
    error,
    refetch,
  } = useAnalytics(selectedUserId === "all" ? undefined : selectedUserId);


  useEffect(()=>{
    fetchUsers().then(setUsers).catch(console.error)
  },[])
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
    }).format(amount);

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "long",
    }).format(date);

  const handleDateChange = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
    refetch(newDate);
  };

  // const chartData = hourlySales.map((item) => ({
  //   hour: `${item.hour}h`,
  //   revenue: item.billing,
  // }));

 if (loading) {
    return (
      <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}
      currentUserRole={currentUserRole}
      >
        <div className="d-flex justify-content-center align-items-center p-5">
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Cargando estadísticas...</span>
            </div>
            <p className="text-muted">Cargando estadísticas...</p>
          </div>
        </div>
      </RoleGuard>
    )
  }

  if (error) {
    return (
      <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}
      currentUserRole={currentUserRole}
      >
        <div className="alert alert-danger m-4">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <button className="btn btn-outline-danger" onClick={() => refetch(currentDate)}>
            Reintentar
          </button>
        </div>
      </RoleGuard>
    )
  }

  return (
    <RoleGuard
      allowedRoles={[ UserRole.ADMIN, UserRole.MANAGER]}
      currentUserRole={currentUserRole}
      fallbackMessage="No tienes permisos para acceder a esta sección."
    >
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-light" onClick={() => handleDateChange("prev")}> 
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <h5 className="mb-0">Hoy: {formatDate(currentDate)}</h5>
            <button className="btn btn-light" onClick={() => handleDateChange("next")}> 
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-light" onClick={() => handleDateChange("prev")}> 
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <h5 className="mb-0">Hoy: {formatDate(currentDate)}</h5>
          <button className="btn btn-light" onClick={() => handleDateChange("next")}> 
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>

        <div className="d-flex align-items-center gap-1">
          <FontAwesomeIcon icon={faUsers} />
          <select
            className="form-select"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="all">Todos los usuarios</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullname}
              </option>
            ))}
          </select>
          <button className="btn btn-outline-secondary" onClick={() => refetch(currentDate)}>
            <FontAwesomeIcon icon={faSync} />
          </button>
        </div>
      </div>

      {analytics && (
        <div className="text-end mb-3">
          {/* Export buttons or summary cards can go here */}
        </div>
      )}

      {/* Summary cards example */}
      {analytics && (
        <div className="row mb-4">
          <div className="col">
            <div className="card p-3">
              <h6>Ventas del día</h6>
              <h4>{formatCurrency(analytics.today?.billing || 0)}</h4>
            </div>
          </div>
        </div>
      )}

      {/* Hourly Sales Table */}
      <div className="card p-3">
        <h5>Ventas por hora</h5>
        <div className="table-responsive">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Hora</th>
                <th>Facturación</th>
                <th>Ventas</th>
                <th>Ticket Medio</th>
              </tr>
            </thead>
            <tbody>
              {hourlySales.filter(h => h.sales > 0).map(hour => (
                <tr key={hour.hour}>
                  <td>
                    <FontAwesomeIcon icon={faCircle} className={`me-2 ${hour.isBestHour ? 'text-success' : hour.isWorstHour ? 'text-danger' : 'text-muted'}`} />
                    {hour.hour}h
                  </td>
                  <td>{formatCurrency(hour.billing)}</td>
                  <td>{hour.sales}</td>
                  <td>{formatCurrency(hour.averageTicket)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {hourlySales.filter(h => h.sales > 0).length === 0 && (
            <p className="text-muted text-center">No hay ventas registradas para este día</p>
          )}
        </div>
      </div>
      {/* Top Products */}
      <div className="card p-3">
        <h5>Mejor Producto Vendido</h5>
        <div className="table-responsive">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Hora</th>
                <th>Facturación</th>
                <th>Ventas</th>
                <th>Ticket Medio</th>
              </tr>
            </thead>
            <tbody>
             {topProducts.map((product, index)=>(
              <div key={product.id} className="d-flex justify-content-between align-items-center mb-3">
                    <div className="flex-grow-1">
                      <div className="fw-medium">{product.name}</div>
                      <small className="text-muted">{product.category}</small>
                      <div className="progress mt-1" style={{ height: "4px" }}>
                        <div className="progress-bar bg-primary" style={{ width: `${product.percentage}%` }}></div>
                      </div>
                    </div>
                    <div className="text-end ms-3">
                      <div className="fw-bold">{product.quantity}</div>
                      <small className="text-muted">{formatCurrency(product.revenue)}</small>
                    </div>
                  </div>
             ))}
              
            </tbody>
          </table>
          {hourlySales.filter(h => h.sales > 0).length === 0 && (
            <p className="text-muted text-center">No hay ventas registradas para este día</p>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="d-flex justify-content-center gap-4 mt-3">
        <div className="d-flex align-items-center gap-2">
          <span className="bg-success rounded-circle d-inline-block" style={{ width: '10px', height: '10px' }}></span>
          <span>MEJOR HORA</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="bg-danger rounded-circle d-inline-block" style={{ width: '10px', height: '10px' }}></span>
          <span>PEOR HORA</span>
        </div>
      </div>
    </div>
  </RoleGuard>
  );
}
