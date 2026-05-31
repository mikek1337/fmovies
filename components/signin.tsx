"use client"
import { signIn } from "@/lib/auth-client"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Icons } from "./icons"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Clapperboard } from "lucide-react"
import Link from "next/link"

const SignIn = () => {
  const { toast } = useToast()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn.email({
      email,
      password,
    })
    if (error) {
      toast({
        title: "Error",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      })
      setLoading(false)
    } else {
      router.push("/home/user")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-formovies-dark px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clapperboard className="size-8 text-formovies-gold" />
            <span className="font-display text-3xl tracking-widest text-white">ForMovies</span>
          </div>
          <h1 className="font-display text-4xl tracking-wider text-white">Welcome Back</h1>
          <p className="text-white/40 text-sm mt-1">Sign in to continue watching</p>
        </div>

        <div className="formovies-card !bg-white/[0.03] !border-white/10 !backdrop-blur-sm p-6 md:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <Input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-formovies-gold/50"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <Input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-formovies-gold/50"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-formovies-gold text-formovies-dark hover:bg-formovies-amber font-semibold"
              disabled={loading}
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              Sign In With Email
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-formovies-dark px-4 text-white/30">OR</span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => signIn.social({ provider: "google" })}
            className="w-full border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
          >
            <Icons.google className="size-4" />
            Sign in with Google
          </Button>

          <p className="text-center text-sm text-white/40 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-formovies-gold hover:text-formovies-amber font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignIn
