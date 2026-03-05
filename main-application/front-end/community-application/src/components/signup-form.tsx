import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import api from "@/lib/api"
import { Loader2 } from "lucide-react" // For a better UX

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name")
    const email = formData.get("email")
    const password = formData.get("password")
    const confirmPassword = formData.get("confirm-password")

    // Simple Architecture Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      setLoading(false)
      return
    }

    try {
      // Endpoint matches our Django backend mapping: /api/accounts/auth/register/
      await api.post("accounts/auth/register/", {
        full_name: name,
        email: email,
        password: password,
      })

      // On success, redirect to login or dashboard
      navigate("/login?message=account_created")
    } catch (err: any) {
      const detail = err.response?.data?.detail || "Structural error during registration."
      setError(detail)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="rounded-none border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-black uppercase tracking-tighter">
            Join the Collective
          </CardTitle>
          <CardDescription className="font-mono text-xs">
            Register your developer profile to begin architecting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-4">
              {error && (
                <div className="bg-destructive/10 p-3 text-xs text-destructive border border-destructive/20 font-mono">
                  ERROR: {error}
                </div>
              )}
              
              <Field>
                <FieldLabel htmlFor="name">Username</FieldLabel>
                <Input name="name" id="name" type="text" placeholder="John" required className="rounded-none" />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="dev@urbantrends.dev"
                  required
                  className="rounded-none"
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input name="password" id="password" type="password" required className="rounded-none" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirm-password">Confirm</FieldLabel>
                  <Input name="confirm-password" id="confirm-password" type="password" required className="rounded-none" />
                </Field>
              </div>

              <Field className="pt-2">
                <Button type="submit" className="w-full rounded-none font-bold uppercase" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Initialize Profile"}
                </Button>
                <FieldDescription className="text-center pt-4">
                  Existing architect? <a href="/login" className="underline font-bold">Log in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-[10px] uppercase opacity-50">
        Protocol: Agree to <a href="#">Terms</a> & <a href="#">Privacy</a>.
      </FieldDescription>
    </div>
  )
}