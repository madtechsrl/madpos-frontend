import { createContext, useState, useEffect, type ReactNode } from "react"
import { fetchProducts } from "../services/product-service"

export type Product = {
  id: string
  name: string
  price: number
  category: string
  image?: string
  bgColor?: string
  textColor?: string
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
  refreshProducts: () => Promise<void>
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Fetch products function
  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await fetchProducts()
      setProducts(data)
      console.log("Products loaded successfully:", data.length)
    } catch (err) {
      console.error("Error loading products:", err)
      setError("Error al cargar productos. Por favor, intenta de nuevo.")
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Refresh products function
  const refreshProducts = async () => {
    await loadProducts()
  }

  // Load products on mount
  useEffect(() => {
    loadProducts()
  }, [])

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
        refreshProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

// export function useProducts() {
//   const context = useContext(ProductContext)
//   if (context === undefined) {
//     throw new Error("useProducts must be used within a ProductProvider")
//   }
//   return context
// }

export {ProductContext};