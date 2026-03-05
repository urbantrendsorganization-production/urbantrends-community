import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
// Note: Ensure these Field components exist in your UI folder or use standard divs
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import api from "@/lib/api"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "./auth-context"
 // 1. IMPORT AUTH CONTEXT

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const { login } = useAuth() // 2. GRAB LOGIN FUNCTION
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const successMessage = searchParams.get("message") === "account_created"

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
      toast.error("Credentials incomplete.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("INIT: Handshake with unity.urbantrends.dev");
      
      const res = await api.post("accounts/auth/login/", {
        username,
        password,
      });

      // 3. UPDATE CONTEXT & LOCALSTORAGE
      // Assuming your API returns { access, refresh, user: { username, email } }
      // If it only returns tokens, you might need a separate call to get user data
      const userData = res.data.user || { username, email: "" }; 
      
      login(res.data.access, userData);
      localStorage.setItem("refresh_token", res.data.refresh);
      
      toast.success("Identity Verified.");
      navigate("/");
    } catch (err: any) {
      console.error("FAIL: Protocol error", err);
      const apiError = err.response?.data?.detail || "Authentication Rejected.";
      setError(apiError);
      toast.error(apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 max-w-md mx-auto w-full pt-10", className)} {...props}>
      <Card className="rounded-none border-4 border-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-background">
        <CardHeader className="text-center border-b-2 border-primary pb-6">
          <CardTitle className="text-3xl font-black uppercase tracking-tighter italic">
            Community User_Auth
          </CardTitle>
          <CardDescription className="font-mono text-[10px] uppercase font-bold text-primary/60">
            {successMessage 
              ? "Status: Account_Created. Initialize_Session." 
              : "Status: Awaiting_Credentials..."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-6">
              {error && (
                <div className="bg-destructive text-destructive-foreground p-3 text-[10px] font-black uppercase border-2 border-black animate-shake">
                  Error_Report: {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button" className="rounded-none border-2 border-black font-bold uppercase text-[10px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                  <AppleIcon className="mr-2 h-4 w-4" /> Apple_ID
                </Button>
                <Button variant="outline" type="button" className="rounded-none border-2 border-black font-bold uppercase text-[10px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                  <GoogleIcon className="mr-2 h-4 w-4" /> Google_ID
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t-2 border-black/10"></span></div>
                <div className="relative flex justify-center text-[10px] uppercase font-black">
                  <span className="bg-background px-2 text-muted-foreground">Manual_Input</span>
                </div>
              </div>

              <div className="space-y-2">
                <FieldLabel className="text-[11px] font-black uppercase tracking-widest">Login_ID</FieldLabel>
                <Input
                  name="username"
                  placeholder="USERNAME_HERE"
                  required
                  className="rounded-none border-2 border-black focus-visible:ring-0 focus-visible:border-primary font-bold placeholder:opacity-20 h-12"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <FieldLabel className="text-[11px] font-black uppercase tracking-widest">Access_Key</FieldLabel>
                  <a href="#" className="text-[9px] font-black uppercase underline underline-offset-4 hover:text-primary">Lost_Key?</a>
                </div>
                <Input 
                  name="password" 
                  type="password" 
                  required 
                  className="rounded-none border-2 border-black focus-visible:ring-0 focus-visible:border-primary h-12" 
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full rounded-none font-black uppercase py-7 text-xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all bg-primary" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" /> 
                      Verifying...
                    </>
                  ) : "Initialize_Session"}
                </Button>
                <div className="text-center pt-6 font-mono text-[10px] font-bold uppercase tracking-widest opacity-60">
                  No_Registry? <a href="/sign" className="underline text-primary">Create_Account</a>
                </div>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      
      {/* Footer Branding */}
      <div className="text-center text-[10px] font-black uppercase opacity-20 tracking-[0.5em]">
        Urban_Trends_Logic_Gate
      </div>
    </div>
  )
}

// Icons remain the same...
const AppleIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" /></svg>
)

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" /></svg>
)