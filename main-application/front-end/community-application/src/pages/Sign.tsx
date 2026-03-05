import { SignupForm } from "@/components/signup-form"

function Sign() {
  return (
    // min-h-svh ensures the page doesn't "jump" or refresh awkwardly
    // flex items-center keeps the form centered even if the keyboard pops up on mobile
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignupForm />
      </div>
    </div>
  )
}

export default Sign