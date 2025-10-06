import { useEffect, useState } from "react";
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
// import { mockProducts, mockCategories } from "../../lib/data";
import type { Product } from "../../lib/index";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProduct";

export default function ProductsPage() {
  const {products, filteredProducts, categories, loading, error, searchQuery, setSelectedCategory, setSearchQuery, selectedCategory, reloadProducts} = useProducts()
  // const [products] = useState<Product[]>(mockProducts);
  // const [searchTerm, setSearchTerm] = useState("");
  // const [selectedCategory, setSelectedCategory] = useState<string>("");
  const navigate = useNavigate();
  // const filterProducts = Product.filter((product) => {
  //   const matchesSearch =
  //     product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     product.code.includes(searchTerm);
  //   const matchesCategory = !selectedCategory || product.category === selectedCategory;
  //   return matchesSearch && matchesCategory;
  // });

  const totalValue = products.reduce((sum, p) => sum + (p.price || 0) * (p.stock || 0), 0);
  const totalCost = products.reduce((sum, p) => sum + (p.cost || 0) * (p.stock || 0), 0);
  const estimatedProfit = totalValue - totalCost;
  const lowStockCount = products.filter((p) => (p.stock || 0) <= (p.minStock || 5)).length;
  const outOfStockCount = products.filter((product) => product.stock === 0).length;
  const inStockSummary = products.reduce((sum, p)=> sum + ((p.stock || 0)> 0 ? p.stock! : 0), 0)
  const inStockItems = products.filter((p) => (p.stock || 0) > 0).length;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
    }).format(amount);


    useEffect(()=>{
      reloadProducts()
    }, [] )

    const handleEditClick=(productId : string)=>{
      navigate(`/productos/${productId}/editar`);
    }

    const handleDeleteClick = () =>{}

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
          <div className="card p-3 d-flex align-items-center">
            <span className="badge bg-warning me-2">{inStockItems}</span>
            <small>Cant de Productos</small>
          </div>
        </div>
        <div className="col-md">
          <div className="card p-3 d-flex justify-content-between">
            <div>
              <span className="badge bg-danger me-2">{outOfStockCount}</span>
              <span className="badge bg-success">{inStockSummary}</span>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                <button className="dropdown-item" onClick={() => setSelectedCategory(null)}>
                  Todas las categorías
                </button>
              </li>
              {categories.map((category) => (
                <li key={category}>
                  <button className={`dropdown-item ${selectedCategory === category ? "active" : ""}` }
                  onClick={() => setSelectedCategory(category)}>
                    {category}
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
          <button className="btn btn-primary" style={{textSizeAdjust:"10px"}}
          onClick={()=> navigate("/productos/addProduct")}>
            <FontAwesomeIcon icon={faBoxOpen} className="me-3" />             
               <span className="fs-5 fw-semibold">Producto</span>       
          </button>
            
           
          
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
                      <div className="text-muted small">{product.sku}</div>
                    </div>
                  </div>
                </td>
                <td>{product.category?.name}</td>
                <td>
                  <span className={`badge ${product.stock! <= (product.minStock || 5) ? 'bg-danger' : 'bg-secondary'}`}>
                    {product.stock}
                  </span>
                </td>
                <td>{formatCurrency(product.price)}</td>
                <td>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" checked={true} readOnly />
                  </div>
                </td>
                <td>
                  <div className="dropdown">
                    <button className="btn btn-sm btn-light" data-bs-toggle="dropdown">
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </button>
                    <ul className="dropdown-menu">
                      <li><button className="dropdown-item" onClick={()=>handleEditClick(product.id)}>Editar</button></li>
                      {/* <li><button className="dropdown-item">Duplicar</button></li> */}
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
