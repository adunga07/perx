import { Outlet, useLocation } from 'react-router-dom'
import { Scene3D } from '../Scene3D'
import './AuthLayout.css'

export function AuthLayout() {
	const location = useLocation()
	const isOnboarding = location.pathname === '/onboarding'

	return (
		<div className={`auth-layout-root ${isOnboarding ? 'onboarding-mode' : 'login-mode'}`}>
			<Scene3D />
			<div className="auth-content">
				<Outlet />
			</div>
		</div>
	)
}

