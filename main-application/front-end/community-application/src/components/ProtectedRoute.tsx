import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "./auth-context"
import { CircleNotch } from "@phosphor-icons/react"

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  // 1. SYSTEM_SYNC: Wait for auth-context to finish reading localStorage
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center font-mono bg-background text-primary uppercase text-xs tracking-[0.3em]">
        <CircleNotch size={32} className="animate-spin mr-3" />
        Verifying_Credentials...
      </div>
    )
  }

  // 2. ACCESS_DENIED: If no user, redirect to login but save the attempted location
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 3. ACCESS_GRANTED: Render the protected module
  return <>{children}</>
}