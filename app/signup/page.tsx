import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 roc-glow">
            <div className="w-8 h-8 rounded-full bg-primary"></div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">ROC</h1>
          <p className="text-muted-foreground">Response Operations Companion</p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
