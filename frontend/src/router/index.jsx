/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { AuthLayout } from '../components/layout/AuthLayout'
import { AppShell } from '../components/layout/AppShell'
import { LoginPage } from '../components/LoginPage'
import { OnboardingWizard } from '../components/onboarding/OnboardingWizard'
import { EmployeeDashboard } from '../pages/employee/EmployeeDashboard'
import { Marketplace } from '../pages/employee/Marketplace'
import { MyBenefits } from '../pages/employee/MyBenefits'
import { PerkDetail } from '../pages/employee/PerkDetail'
import { EmployeeProfile } from '../pages/employee/EmployeeProfile'
import { EmployerDashboard } from '../pages/employer/EmployerDashboard'
import { ApprovalQueue } from '../pages/employer/ApprovalQueue'
import { BudgetSettings } from '../pages/employer/BudgetSettings'
import { EmployeeManagement } from '../pages/employer/EmployeeManagement'
import { Insights } from '../pages/employer/Insights'
import { ProviderDashboard } from '../pages/provider/ProviderDashboard'
import { OfferListings } from '../pages/provider/OfferListings'
import { AddEditPerk } from '../pages/provider/AddEditPerk'
import { ProviderProfile } from '../pages/provider/ProviderProfile'

function ProtectedRoute({ allowedRoles }) {
	const role = useAuthStore((state) => state.role)

	if (!role) {
		return <Navigate to="/login" replace />
	}

	if (allowedRoles && !allowedRoles.includes(role)) {
		return <Navigate to={`/${role}`} replace />
	}

	return <Outlet />
}

function RootRedirect() {
	const role = useAuthStore((state) => state.role)

	if (role) {
		return <Navigate to={`/${role}`} replace />
	}

	return <Navigate to="/login" replace />
}

export const router = createBrowserRouter([
	{
		path: '/',
		element: <RootRedirect />,
	},
	{
		element: <AuthLayout />,
		children: [
			{
				path: '/login',
				element: <LoginPage />,
			},
			{
				path: '/onboarding',
				element: <OnboardingWizard />,
			},
		],
	},
	{
		element: <ProtectedRoute allowedRoles={['employee']} />,
		children: [
			{
				element: <AppShell />,
				children: [
					{
						path: '/employee',
						element: <EmployeeDashboard />,
					},
					{
						path: '/employee/marketplace',
						element: <Marketplace />,
					},
					{
						path: '/employee/benefits',
						element: <MyBenefits />,
					},
					{
						path: '/employee/perks/:perkId',
						element: <PerkDetail />,
					},
					{
						path: '/employee/profile',
						element: <EmployeeProfile />,
					},
				],
			},
		],
	},
	{
		element: <ProtectedRoute allowedRoles={['employer']} />,
		children: [
			{
				element: <AppShell />,
				children: [
					{
						path: '/employer',
						element: <EmployerDashboard />,
					},
					{
						path: '/employer/approvals',
						element: <ApprovalQueue />,
					},
					{
						path: '/employer/budget',
						element: <BudgetSettings />,
					},
					{
						path: '/employer/employees',
						element: <EmployeeManagement />,
					},
					{
						path: '/employer/insights',
						element: <Insights />,
					},
				],
			},
		],
	},
	{
		element: <ProtectedRoute allowedRoles={['provider']} />,
		children: [
			{
				element: <AppShell />,
				children: [
					{
						path: '/provider',
						element: <ProviderDashboard />,
					},
					{
						path: '/provider/offers',
						element: <OfferListings />,
					},
					{
						path: '/provider/offers/new',
						element: <AddEditPerk />,
					},
					{
						path: '/provider/profile',
						element: <ProviderProfile />,
					},
				],
			},
		],
	},
])

