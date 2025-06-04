"use client"

import { useProducts } from "../../contexts/product-context"
import { useState } from "react"

export function SearchBar() {
  const { categories, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useProducts()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <div className="row g-2 mb-4 align-items-center">
      <div className="col">
        <div className="input-group">
          <input
            type="text"
            placeholder="Nombre o código"
            className="form-control"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="input-group-text bg-white">
            <i className="fas fa-search text-secondary"></i>
          </span>
        </div>
      </div>
      <div className="col-auto">
        <div className="dropdown">
          <button
            className="btn btn-outline-secondary d-flex align-items-center gap-1"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            type="button"
          >
            <span>{selectedCategory || "Categorías"}</span>
            <i className="fas fa-chevron-down small"></i>
          </button>
          <ul className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
            <li>
              <button
                className="dropdown-item"
                onClick={() => {
                  setSelectedCategory(null)
                  setDropdownOpen(false)
                }}
              >
                Todas las categorías
              </button>
            </li>
            {categories.map((category) => (
              <li key={category}>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedCategory(category)
                    setDropdownOpen(false)
                  }}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="col-auto">
        <button className="btn btn-outline-secondary">
          <i className="fas fa-qrcode"></i>
        </button>
      </div>
      <div className="col-auto">
        <button className="btn btn-outline-secondary">
          <i className="fas fa-bolt"></i>
        </button>
      </div>
      <div className="col-auto">
        <button className="btn btn-outline-secondary">
          <i className="fas fa-bars"></i>
        </button>
      </div>
    </div>
  )
}
