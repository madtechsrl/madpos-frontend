import { useCart } from "../../contexts/cart-context"
import type { Product } from "../../contexts/product-context"
import { formatCurrency } from "../../lib/utils"

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const { name, price, bgColor = "bg-white", textColor = "text-dark", image } = product

  // Convert Tailwind classes to inline styles
  const cardStyle = {
    backgroundColor: bgColor.includes("bg-white")
      ? "white"
      : bgColor.includes("bg-slate-600")
        ? "#475569"
        : bgColor.includes("bg-yellow-100")
          ? "#fef9c3"
          : bgColor.includes("bg-gray-100")
            ? "#f3f4f6"
            : "white",
    color: textColor.includes("text-white") ? "white" : "#1e293b",
  }

  return (
    <button className="card product-card border-0 overflow-hidden" style={cardStyle} onClick={() => addToCart(product)}>
      {image && (
        <div className="d-flex align-items-center justify-content-center p-2 flex-grow-1">
          <img src={image || "/placeholder.svg"} width={10} height={100} alt={name} className="object-fit-contain" />
        </div>
      )}
      <div className="p-3 text-start">
        <div className="fw-medium">{name}</div>
        <div className="small">{formatCurrency(price)}</div>
      </div>
    </button>
  )
}
