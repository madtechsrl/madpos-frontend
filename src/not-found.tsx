import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-medium text-gray-600 mb-6">Página no encontrada</h2>
      <p className="text-gray-500 mb-8">Lo sentimos, la página que estás buscando no existe.</p>
      <Link to="/" className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors">
        Volver al inicio
      </Link>
    </div>
  )
}
