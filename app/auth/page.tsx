import { AuthForm } from "@/components/auth/auth-form"

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">HealthTrack</h1>
          <p className="text-muted-foreground">Your personal health monitoring assistant</p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}
