import { useAuthStore } from '../store/authStore'

export function useAuth() {
	const auth = useAuthStore()

	return {
		...auth,
		isEmployee: auth.role === 'employee',
		isEmployer: auth.role === 'employer',
		isProvider: auth.role === 'provider',
		isAuthenticated: Boolean(auth.token),
	}
}

