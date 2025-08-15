"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Shield, Lock, Mail } from "lucide-react"
import Link from "next/link"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Sign in failed")
        return
      }

      if (data.success && data.redirectTo) {
        window.location.href = data.redirectTo
      }
    } catch (error) {
      console.error("Sign in error:", error)
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <span>Secure Access</span>
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-muted-foreground">
          Enter your credentials to access the ROC platform
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
          {error && (
            <div className="p-2 sm:p-3 text-xs sm:text-sm text-destructive-foreground bg-destructive/10 border border-destructive/30 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="email" className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2">
              <Mail className="w-3 h-3 text-primary" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 sm:h-11 text-sm sm:text-base"
              required
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label
              htmlFor="password"
              className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2"
            >
              <Lock className="w-3 h-3 text-primary" />
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 h-10 sm:h-11 text-sm sm:text-base"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-2 sm:px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                ) : (
                  <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              className="h-4 w-4"
            />
            <Label htmlFor="remember" className="text-xs sm:text-sm font-medium leading-none text-foreground">
              Remember me for 30 days
            </Label>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 sm:space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
          <Button type="submit" className="w-full font-medium h-10 sm:h-11 text-sm sm:text-base" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2"></div>
                Authenticating...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Access ROC Platform
              </>
            )}
          </Button>

          <div className="flex flex-col sm:flex-row items-center justify-between w-full text-xs sm:text-sm space-y-2 sm:space-y-0">
            <Link href="/forgot-password" className="text-primary hover:text-primary/80 transition-colors">
              Forgot password?
            </Link>
            <Link href="/signup" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Create account →
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
