"use client"

import ReactPaginate from "react-paginate"
import "./pagination-react-paginate.css"

interface PaginationReactPaginateProps {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (itemsPerPage: number) => void
}

export function PaginationReactPaginate({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
}: PaginationReactPaginateProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mt-4">
      <div className="d-flex align-items-center gap-2">
        <label className="text-muted small mb-0">Mostrar:</label>
        <select
          className="form-select form-select-sm"
          style={{ width: "auto" }}
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-muted small">
          Mostrando {startItem} - {endItem} de {totalItems}
        </span>
      </div>

      {totalPages > 1 && (
        <ReactPaginate
          previousLabel={
            <>
              <i className="bi bi-chevron-left"></i> Anterior
            </>
          }
          nextLabel={
            <>
              Siguiente <i className="bi bi-chevron-right"></i>
            </>
          }
          breakLabel="..."
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={({ selected }) => onPageChange(selected + 1)}
          containerClassName="pagination-custom"
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
          forcePage={currentPage - 1}
        />
      )}
    </div>
  )
}
