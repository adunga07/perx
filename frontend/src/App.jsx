import { RouterProvider } from 'react-router-dom'
import { router } from './router/index.jsx'
import { ToastContainer } from './components/ui/Toast'
import { useNotificationStore } from './store/notificationStore'

function ToastLayer() {
  const toasts       = useNotificationStore(s => s.toasts)
  const dismissToast = useNotificationStore(s => s.dismissToast)
  return <ToastContainer toasts={toasts} onDismiss={dismissToast} />
}

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastLayer />
    </>
  )
}

export default App
