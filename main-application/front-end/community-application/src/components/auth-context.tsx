import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// 1. Update the Interface to include your new profile fields
interface User {
  username: string;
  email: string;
  display_name?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string | null;
  avatar_url?: string | null;
  role?: "DEVELOPER" | "CREATOR" | "TEAM";
}

interface AuthContextType {
  user: User | null;
  setUser: (userData: User | null) => void; // 2. Add this to the type
  login: (token: string, userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    const savedUser = localStorage.getItem("user_data")
    if (token && savedUser) {
      try {
        setUserState(JSON.parse(savedUser))
      } catch (e) {
        console.error("Failed to parse user data", e)
      }
    }
    setLoading(false)
  }, [])

  // 3. Create a wrapper that persists to localStorage
  const setUser = (userData: User | null) => {
    if (userData) {
      localStorage.setItem("user_data", JSON.stringify(userData))
    } else {
      localStorage.removeItem("user_data")
    }
    setUserState(userData)
  }

  const login = (token: string, userData: User) => {
    localStorage.setItem("access_token", token)
    setUser(userData) // Uses the wrapper above
  }

  const logout = () => {
    localStorage.removeItem("access_token")
    setUser(null) // Clears state and localStorage
    window.location.href = "/login"
  }

  return (
    // 4. Pass the new setUser into the provider
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}