import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initialState = {
	user: null,
	role: null,
	token: null,
	lang: 'en',
	onboardingCompleted: false,
	preferences: [],
}

export const useAuthStore = create(
	persist(
		(set) => ({
			...initialState,
			login: ({ user, role, token, lang }) =>
				set({
					user,
					role,
					token,
					lang: lang ?? 'en',
					onboardingCompleted: role !== 'employee',
				}),
			logout: () => set({ ...initialState }),
			setLang: (lang) => set({ lang }),
			completeOnboarding: (preferences = []) =>
				set({
					onboardingCompleted: true,
					preferences,
				}),
		}),
		{
			name: 'perx-auth',
			partialize: (state) => ({
				user: state.user,
				role: state.role,
				token: state.token,
				lang: state.lang,
				onboardingCompleted: state.onboardingCompleted,
				preferences: state.preferences,
			}),
		},
	),
)

