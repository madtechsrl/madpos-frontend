import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faDownload,
  faPlus,
  faStar,
  faTrash,
  faBoxOpen,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import { mockProducts, mockCategories } from "../../lib/data";
import type { Product } from "../../lib/index";

export default function ProductsPage() {
  const [products] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.includes(searchTerm);
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalValue = products.reduce((sum, product) => sum + product.price * product.stock, 0);
  const totalCost = products.reduce((sum, product) => sum + product.cost * product.stock, 0);
  const estimatedProfit = totalValue - totalCost;
  const lowStockCount = products.filter((product) => product.stock <= (product.minStock || 5)).length;
  const outOfStockCount = products.filter((product) => product.stock === 0).length;
  const inStockCount = products.filter((product) => product.stock > 0).length;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
    }).format(amount);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Productos</h2>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md">
          <div className="card p-3">
            <div className="h5 text-success">{formatCurrency(totalValue)}</div>
            <small>Valor en stock</small>
          </div>
        </div>
        <div className="col-md">
          <div className="card p-3">
            <div className="h5 text-primary">{formatCurrency(totalCost)}</div>
            <small>Costo de stock</small>
          </div>
        </div>
        <div className="col-md">
          <div className="card p-3">
            <div className="h5 text-purple">{formatCurrency(estimatedProfit)}</div>
            <small>Ganancia estimada</small>
          </div>
        </div>
        <div className="col-md">
          <div className="card p-3 d-flex align-items-center">
            <span className="badge bg-warning me-2">{lowStockCount}</span>
            <small>Stock bajo</small>
          </div>
        </div>
        <div className="col-md">
          <div className="card p-3 d-flex justify-content-between">
            <div>
              <span className="badge bg-danger me-2">{outOfStockCount}</span>
              <span className="badge bg-success">{inStockCount}</span>
            </div>
            <small>Sin stock / En stock</small>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-3">
        <div className="d-flex gap-3 flex-wrap">
          <div className="input-group">
            <span className="input-group-text">
              <FontAwesomeIcon icon={faSearch} />
            </span>
            <input
              className="form-control"
              placeholder="Artículo o código"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="dropdown">
            <button
              className="btn btn-outline-secondary dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              <FontAwesomeIcon icon={faFilter} className="me-2" />
              Filtro
            </button>
            <ul className="dropdown-menu">
              <li>
                <button className="dropdown-item" onClick={() => setSelectedCategory("")}>
                  Todas las categorías
                </button>
              </li>
              {mockCategories.map((cat) => (
                <li key={cat.id}>
                  <button className="dropdown-item" onClick={() => setSelectedCategory(cat.name)}>
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <button className="btn btn-outline-secondary">
            <FontAwesomeIcon icon={faDownload} className="me-2" />
            Exportar
          </button>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary">
            <FontAwesomeIcon icon={faBoxOpen} />
          </button>
          <a href="/productos/addProduct" className="btn btn-primary">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Producto
          </a>
        </div>
      </div>

      {/* Product Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th></th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Precio</th>
              <th>Catálogo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-light">
                    <FontAwesomeIcon icon={faStar} />
                  </button>
                </td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-light rounded-circle d-flex justify-content-center align-items-center" style={{ width: "40px", height: "40px" }}>
                      <FontAwesomeIcon icon={faBoxOpen} className="text-secondary" />
                    </div>
                    <div>
                      <div className="fw-medium">{product.name}</div>
                      <div className="text-muted small">{product.code}</div>
                    </div>
                  </div>
                </td>
                <td>{product.category}</td>
                <td>
                  <span className={`badge ${product.stock <= (product.minStock || 5) ? 'bg-danger' : 'bg-secondary'}`}>
                    {product.stock}
                  </span>
                </td>
                <td>{formatCurrency(product.price)}</td>
                <td>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" checked={product.isActive} readOnly />
                  </div>
                </td>
                <td>
                  <div className="dropdown">
                    <button className="btn btn-sm btn-light" data-bs-toggle="dropdown">
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </button>
                    <ul className="dropdown-menu">
                      <li><button className="dropdown-item">Editar</button></li>
                      <li><button className="dropdown-item">Duplicar</button></li>
                      <li><button className="dropdown-item text-danger"><FontAwesomeIcon icon={faTrash} className="me-2" />Eliminar</button></li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
