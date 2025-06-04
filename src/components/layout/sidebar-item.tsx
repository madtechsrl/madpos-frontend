import { Link } from "react-router-dom"
import type { ReactNode } from "react"

export function SidebarItem({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <Link to="#" className="flex flex-col items-center py-3 w-full hover:bg-slate-700">
      <div className="mb-1">{icon}</div>
      <span className="text-xs">{label}</span>
    </Link>
  )
}
