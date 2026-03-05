import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "./components/theme-provider.tsx"
import { TooltipProvider } from "./components/ui/tooltip.tsx"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./components/auth-context.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
      <AuthProvider>
        <App />

      </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
    </TooltipProvider>
  </StrictMode>
)
