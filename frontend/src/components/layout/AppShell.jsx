import { Outlet } from 'react-router-dom'
import './AppShell.css'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { MobileNav } from './MobileNav'
import { CartDrawer } from '../cart/CartDrawer'
import { useAuthStore } from '../../store/authStore'
import { useEffect } from 'react'

function getRoleColor(role) {
  switch (role) {
    case 'employer': return '#06b6d4'
    case 'provider': return '#f59e0b'
    case 'employee':
    default:
      return '#7c3aed'
  }
}

export function AppShell() {
  const role = useAuthStore((s) => s.role)

  useEffect(() => {
    const root = document.documentElement
    const color = getRoleColor(role)
    if (color) root.style.setProperty('--role-color', color)
  }, [role])

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
        <Topbar />
        <div className="app-content">
          <Outlet />
        </div>
      </div>

      <MobileNav />
      <CartDrawer />
    </div>
  )
}

