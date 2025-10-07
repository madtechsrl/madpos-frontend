"use client"

import ReactPaginate from "react-paginate"
import "./pagination-react-paginate.css"

interface PaginationReactPaginateProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange?: (itemsPerPage: number) => void
  showItemsPerPage?: boolean
}

export function PaginationReactPaginate({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
}: PaginationReactPaginateProps) {
  const handlePageClick = (selectedItem: { selected: number }) => {
    onPageChange(selectedItem.selected + 1) // react-paginate usa índice basado en 0
  }

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  if (totalPages === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center py-3">
        <p className="text-muted mb-0">No hay elementos para mostrar</p>
      </div>
    )
  }

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 py-3">
      {/* Información de items */}
      <div className="text-muted small">
        Mostrando <strong>{startItem}</strong> a <strong>{endItem}</strong> de <strong>{totalItems}</strong> elementos
      </div>

      {/* Paginación */}
      <ReactPaginate
        breakLabel="..."
        nextLabel={
          <span className="d-flex align-items-center">
            Siguiente <ChevronRight size={16} className="ms-1" />
          </span>
        }
        previousLabel={
          <span className="d-flex align-items-center">
            <ChevronLeft size={16} className="me-1" /> Anterior
          </span>
        }
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        pageCount={totalPages}
        forcePage={currentPage - 1} // react-paginate usa índice basado en 0
        renderOnZeroPageCount={null}
        containerClassName="pagination mb-0"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        activeClassName="active"
        disabledClassName="disabled"
      />

      {/* Selector de items por página */}
      {showItemsPerPage && onItemsPerPageChange && (
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="itemsPerPage" className="text-muted small mb-0 text-nowrap">
            Items por página:
          </label>
          <select
            id="itemsPerPage"
            className="form-select form-select-sm"
            style={{ width: "auto" }}
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number.parseInt(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      )}
    </div>
  )
}
