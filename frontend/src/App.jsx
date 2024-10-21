import { Navigate, Route, Routes } from "react-router-dom"
import FloatingShape from "./components/FloatingShape"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SighUpPage"
import EmailVerificationPage from "./pages/EmailVerificationPage"

import { Toaster } from 'react-hot-toast'
import { useAuthStore } from "./store/authStore"
import DashBoardPage from "./pages/DashBoardPage"
import { useEffect } from "react"
import LoadingSpinner from "./components/LoadingSpinner"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"

// protect routes that require authenticated users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }
  if (!user.isVerified) {
    return <Navigate to='/verifyEmail' replace />
  }
  return children
}

// redirect authenticated users to home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore()

  if (isAuthenticated && user.isVerified) {
    return <Navigate to='/' replace />
  }
  return children
}

function App() {

  const { isCheckingAuth, checkAuth, } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth) return <LoadingSpinner />

  return (
    <div>
      <h1 className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-900
       to-emerald-900 flex items-center justify-center relative overflow-hidden ' >

        <FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
        <FloatingShape color='bg-green-800' size='w-64 h-64' top='5%' right='20%' delay={1} />
        <FloatingShape color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
        <FloatingShape color='bg-lime-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />

        <Routes>
          <Route path='/' element={<ProtectedRoute><DashBoardPage /></ProtectedRoute>} />
          <Route path='/signup' element={<RedirectAuthenticatedUser><SignUpPage /></RedirectAuthenticatedUser>} />
          <Route path='/login' element={<RedirectAuthenticatedUser><LoginPage /></RedirectAuthenticatedUser>} />
          <Route path='/verifyEmail' element={<EmailVerificationPage />} />
          <Route path='/forgotPassword' element={<RedirectAuthenticatedUser><ForgotPasswordPage/></RedirectAuthenticatedUser>} />
        </Routes>
        <Toaster />
      </h1>
    </div>
  )
}

export default App
