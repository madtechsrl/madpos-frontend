
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faChevronDown, faQrcode, faBolt, faBars, faPlus, faShoppingCart, faX, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { SidebarItem } from "./layout/sidebar-item"
import { ProductCard } from "../components/productos/product-card"
import { CartItem } from "./productos/cart-item"
import { useProducts } from "../contexts/product-context"
import { useCart } from "../contexts/cart-context"
import { useUser } from "../contexts/user-context"
import { formatCurrency } from "../lib/utils"

export default function Dashboard() {
  const {
    filteredProducts,
    categories,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useProducts()

  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, isCartOpen, setIsCartOpen } = useCart()

  const { customerName, userProfile } = useUser()

  // Process checkout
  const processCheckout = () => {
    if (cart.length === 0) return

    alert(`Procesando pago de ${formatCurrency(cartTotal)}`)
    // Here you would typically send the order to your backend
    clearCart()
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <aside className="w-16 bg-slate-800 flex flex-col items-center text-white text-xs">
        <div className="p-4">
          <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
        </div>
        <div className="flex flex-col items-center justify-center py-4 text-center border-l-2 border-white w-full">
          <div className="bg-white rounded-full p-2 mb-1">
            <span className="text-slate-800">✓</span>
          </div>
          <span>Vende</span>
        </div>
        <SidebarItem icon={<FontAwesomeIcon icon={faShoppingCart} />} label="Pedidos" />
        <SidebarItem
          icon={
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-2 h-2 bg-white"></div>
              <div className="w-2 h-2 bg-white"></div>
              <div className="w-2 h-2 bg-white"></div>
              <div className="w-2 h-2 bg-white"></div>
            </div>
          }
          label="Productos"
        />
        <SidebarItem
          icon={
            <div className="flex flex-col">
              <div className="w-5 h-1 bg-white mb-0.5"></div>
              <div className="w-5 h-1 bg-white mb-0.5"></div>
              <div className="w-5 h-1 bg-white"></div>
            </div>
          }
          label="Catálogo Online"
        />
        <SidebarItem
          icon={
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full border border-white mb-0.5"></div>
              <div className="w-4 h-1 bg-white"></div>
            </div>
          }
          label="Clientes"
        />
        <SidebarItem
          icon={
            <div className="flex flex-col items-center">
              <div className="w-4 h-1 bg-white mb-0.5"></div>
              <div className="w-4 h-1 bg-white mb-0.5"></div>
              <div className="w-4 h-1 bg-white"></div>
            </div>
          }
          label="Transacciones"
        />
        <SidebarItem
          icon={
            <div className="flex flex-col items-center">
              <div className="w-4 h-1 bg-white mb-0.5"></div>
              <div className="w-4 h-1 bg-white"></div>
            </div>
          }
          label="Finanzas"
        />
        <SidebarItem
          icon={
            <div className="flex flex-col items-center">
              <div className="w-1 h-3 bg-white"></div>
              <div className="w-2 h-4 bg-white ml-1"></div>
            </div>
          }
          label="Estadísticas"
        />
        <SidebarItem
          icon={
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full border border-white mb-0.5"></div>
              <div className="w-4 h-1 bg-white"></div>
            </div>
          }
          label="Usuarios"
        />
        <SidebarItem
          icon={
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full border border-white"></div>
              <div className="w-1 h-1 bg-white absolute mt-1 ml-2"></div>
            </div>
          }
          label="Configuraciones"
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Vender</h1>
          <div className="flex items-center gap-4">
            <button className="flex items-center text-gray-600 gap-1">
              <span className="text-sm">Ayuda</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-slate-700 text-white rounded-full w-10 h-10 flex items-center justify-center">
                {userProfile.avatar}
              </div>
              <div className="text-sm">
                <div className="font-medium">{userProfile.fullname}</div>
                <div className="text-gray-500 text-xs">{userProfile.email}</div>
              </div>
              <FontAwesomeIcon icon={faChevronDown}  className="text-gray-500" />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Products Section */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Search Bar */}
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Nombre o código"
                  className="w-full pl-4 pr-10 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-slate-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-2.5 text-gray-400" />
              </div>
              <div className="relative">
                <button
                  className="flex items-center gap-1 border rounded-md px-3 py-2 text-gray-700"
                  onClick={() => document.getElementById("categoryDropdown")?.classList.toggle("hidden")}
                >
                  <span>{selectedCategory || "Categorías"}</span>
                  <FontAwesomeIcon icon={faChevronDown} />
                </button>
                <div id="categoryDropdown" className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg hidden">
                  <div className="py-1">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setSelectedCategory(null)
                        document.getElementById("categoryDropdown")?.classList.add("hidden")
                      }}
                    >
                      Todas las categorías
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setSelectedCategory(category)
                          document.getElementById("categoryDropdown")?.classList.add("hidden")
                        }}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button className="border rounded-md p-2 text-gray-700">
                <FontAwesomeIcon icon={faQrcode} />
              </button>
              <button className="border rounded-md p-2 text-gray-700">
                <FontAwesomeIcon icon={faBolt} />
              </button>
              <button className="border rounded-md p-2 text-gray-700">
                <div className="flex flex-col">
                  <div className="w-4 h-0.5 bg-gray-700 mb-1"></div>
                  <div className="w-4 h-0.5 bg-gray-700 mb-1"></div>
                  <div className="w-4 h-0.5 bg-gray-700"></div>
                </div>
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="ml-2">Cargando productos...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
                <button
                  className="flex items-center justify-center bg-emerald-500 rounded-md p-4 text-white aspect-square hover:bg-emerald-600 transition-colors"
                  onClick={() => {
                    // This would typically open a modal to add a new product
                    alert("Añadir nuevo producto")
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            )}
          </div>

          {/* Cart Section */}
          <div className="w-80 bg-white border-l overflow-hidden flex flex-col">
            <div className="p-2 border-b flex justify-between items-center">
              <div className="text-sm font-medium">{customerName}</div>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsCartOpen(!isCartOpen)}>
                {isCartOpen ? <FontAwesomeIcon icon={faX} /> : <FontAwesomeIcon icon={faShoppingCart} />}
              </button>
            </div>

            {isCartOpen && (
              <>
                {cart.length > 0 ? (
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-4">
                      {cart.map((item) => (
                        <CartItem key={item.id} item={item} />
                      ))}
                    </div>
                    <div className="border-t p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">{formatCurrency(cartTotal)}</span>
                      </div>
                      <div className="flex justify-between mb-4">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-bold text-lg">{formatCurrency(cartTotal)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-gray-200 rounded-full p-6 mb-4">
                      <FontAwesomeIcon icon={faShoppingCart} className="text-gray-400" />
                    </div>
                    <h3 className="font-medium text-lg mb-1">Tu carrito está vacío.</h3>
                    <p className="text-gray-500 text-sm">Clica en los artículos para añadirlos a la venta.</p>
                  </div>
                )}
              </>
            )}

            <div className="p-4 border-t">
              <button
                className={`w-full py-2 px-4 rounded-md flex items-center justify-between ${
                  cart.length > 0
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                } transition-colors`}
                onClick={processCheckout}
                disabled={cart.length === 0}
              >
                <span> Ir al pago</span>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
