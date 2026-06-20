// TODO: sidebar + topbar + <Outlet>; sets --role-color on root el
import { Outlet } from 'react-router-dom'
import './AppShell.css'
export function AppShell() {
  return <div className='app-shell'><Outlet /></div>
}

