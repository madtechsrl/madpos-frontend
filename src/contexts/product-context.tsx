

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { fetchProducts } from "../services/product-service"
import { useAuth } from "./auth-context"

export type Product = {
  id: string
  name: string
  price: number
  basePrice?: number
  isc?: number
  itbis?: number
  taxTotal?: number
  totalPrice?: number
  category: string
  packagingId: string
  productId: string
  warehouseId: string
  stock: number
  sku: string
  image?: string
  bgColor?: string
  textColor?: string
}

export type Categories = {
  id: string
  name: string
}

export type costType = {
  cost: number
  unit: string
  currentStock: number  
}
type ProductContextType = {
  products: Product[]
  filteredProducts: Product[]
  categories: string[]
  loading: boolean
  error: string | null
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function ProductProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Fetch products from API
  useEffect(() => {
    if (!isAuthenticated) {
      setProducts([])
      setLoading(false)
      setError(null)
      return
    }

    const getProducts = async () => {
      try {
        setLoading(true)
        const data = await fetchProducts()
        setProducts(data)
        setError(null)
      } catch (err) {
        setError("No fue posible cargar el catálogo. Verifique que la API esté disponible.")
        console.error("Error fetching products:", err)
      } finally {
        setLoading(false)
      }
    }

    getProducts()
  }, [isAuthenticated])

  // Filter products based on search query and selected category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Extract unique categories from products
  const categories = Array.from(new Set(products.map((product) => product.category)))

  return (
    <ProductContext.Provider
      value={{
        products,
        filteredProducts,
        categories,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider")
  }
  return context
}
