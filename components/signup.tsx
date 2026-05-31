'use client'
import { SignupSchema, SignupSchemaType } from "@/app/types/signupschema"
import { FC, useState } from "react"
import { signIn, signUp } from "@/lib/auth-client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from "./ui/input"
import { FadeText } from "./magicui/fade-text"
import { Button } from "./ui/button"
import { Icons } from "./icons"
import { Loader2, Clapperboard } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface SignupProps {
  url?: string
}

const Signup: FC<SignupProps> = () => {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<SignupSchemaType>({ resolver: zodResolver(SignupSchema) })

  const submit = async (data: SignupSchemaType) => {
    setLoading(true)
    const { error } = await signUp.email({
      email: data.email,
      password: data.password,
      name: data.username,
    })
    if (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
      setLoading(false)
    } else {
      router.push("/signin")
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
          <h1 className="font-display text-4xl tracking-wider text-white">Create Account</h1>
          <p className="text-white/40 text-sm mt-1">Join ForMovies and start watching</p>
        </div>

        <div className="formovies-card !bg-white/[0.03] !border-white/10 !backdrop-blur-sm p-6 md:p-8">
          <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-formovies-gold/50"
              />
              {errors.email && <FadeText text={errors.email.message!} className="text-formovies-rose font-semibold text-xs mt-1" />}
            </div>
            <div>
              <label htmlFor="username" className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                {...register('username')}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-formovies-gold/50"
              />
              {errors.username && <FadeText text={errors.username.message!} className="text-formovies-rose font-semibold text-xs mt-1" />}
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 8 characters"
                {...register('password')}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-formovies-gold/50"
              />
              {errors.password && <FadeText text={errors.password.message!} className="text-formovies-rose font-semibold text-xs mt-1" />}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                {...register('confirmPassword')}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-formovies-gold/50"
              />
              {errors.confirmPassword && <FadeText text={errors.confirmPassword.message!} className="text-formovies-rose font-semibold text-xs mt-1" />}
            </div>

            <Button
              type="submit"
              className="w-full bg-formovies-gold text-formovies-dark hover:bg-formovies-amber font-semibold"
              disabled={loading}
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              Create Account
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
            Sign up with Google
          </Button>

          <p className="text-center text-sm text-white/40 mt-6">
            Already have an account?{" "}
            <Link href="/signin" className="text-formovies-gold hover:text-formovies-amber font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
