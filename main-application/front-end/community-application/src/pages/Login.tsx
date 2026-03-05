import { LoginForm } from "@/components/login-form"

function Login() {
  return (
    /**
     * min-h-svh: Ensures the container is always exactly the height of the mobile/desktop viewport.
     * flex items-center: Keeps the form physically locked in the center, preventing layout jumps.
     */
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-sm md:max-w-3xl">
        {/* Passing the className here allows the LoginForm to 
            inherit the layout without breaking the internal 
            Radius-0 shadow styling.
        */}
        <LoginForm />
      </div>
    </div>
  )
}

export default Login