"use client"

import { Outlet } from "react-router-dom"
import { useState, useEffect } from "react"
import Sidebar from "../components/layout/sidebar"

export default function DashboardLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992)
    }

    // Set initial state
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="d-flex">
      <Sidebar />
      <div
        className={`main-content ${sidebarExpanded && !isMobile ? "expanded" : ""}`}
        style={{
          width: "100%",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Outlet />
      </div>
    </div>
  )
}
