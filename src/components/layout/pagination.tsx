"use client"

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange?: (itemsPerPage: number) => void
  showItemsPerPage?: boolean
  itemsPerPageOptions?: number[]
  className?: string
}

export function usePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  itemsPerPageOptions = [5, 10, 25, 50, 100],
  className = "",
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
    }
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    if (onItemsPerPageChange) {
      onItemsPerPageChange(newItemsPerPage)
    }
  }

  if (totalPages <= 1 && !showItemsPerPage) {
    return null
  }

  return (
    <div className={`d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 ${className}`}>
      {/* Items per page selector */}
      {showItemsPerPage && onItemsPerPageChange && (
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted small">Mostrar:</span>
          <select
            className="form-select form-select-sm"
            style={{ width: "auto" }}
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="text-muted small">por página</span>
        </div>
      )}

      {/* Page info */}
      <div className="text-muted small">
        {totalItems > 0 ? (
          <>
            Mostrando {startItem} a {endItem} de {totalItems} resultados
          </>
        ) : (
          "No hay resultados"
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <nav aria-label="Navegación de páginas">
          <ul className="pagination pagination-sm mb-0">
            {/* Previous button */}
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Página anterior"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
            </li>

            {/* Page numbers */}
            {getVisiblePages().map((page, index) => {
              if (page === "...") {
                return (
                  <li key={`dots-${index}`} className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                )
              }

              const pageNumber = page as number
              return (
                <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? "active" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pageNumber)}
                    aria-label={`Página ${pageNumber}`}
                    aria-current={currentPage === pageNumber ? "page" : undefined}
                  >
                    {pageNumber}
                  </button>
                </li>
              )
            })}

            {/* Next button */}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Página siguiente"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  )
}
