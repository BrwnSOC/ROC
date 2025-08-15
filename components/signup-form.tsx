"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Building, User, Mail, Lock, CheckCircle } from "lucide-react"
import Link from "next/link"

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    organization: "",
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.organization.trim()) {
      newErrors.organization = "Organization name is required"
    }

    if (!acceptTerms) {
      newErrors.terms = "You must accept the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ submit: data.error || "Failed to create account" })
        return
      }

      setIsSuccess(true)
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 2000)
    } catch (error) {
      console.error("Signup error:", error)
      setErrors({ submit: "Network error. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">Account Created Successfully!</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Welcome to ROC! Redirecting you to the dashboard...
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20">
            <Building className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <span>Create Account</span>
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-muted-foreground">
          Join the ROC platform and secure your organization
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
          {errors.submit && (
            <div className="p-2 sm:p-3 text-xs sm:text-sm text-destructive-foreground bg-destructive/10 border border-destructive/30 rounded-lg">
              {errors.submit}
            </div>
          )}

          <div className="space-y-1.5 sm:space-y-2">
            <Label
              htmlFor="fullName"
              className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2"
            >
              <User className="w-3 h-3 text-primary" />
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Alex Brown"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className="h-10 sm:h-11 text-sm sm:text-base"
              required
            />
            {errors.fullName && <p className="text-xs sm:text-sm text-destructive">{errors.fullName}</p>}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="email" className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2">
              <Mail className="w-3 h-3 text-primary" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="alex@rocplatform.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="h-10 sm:h-11 text-sm sm:text-base"
              required
            />
            {errors.email && <p className="text-xs sm:text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label
              htmlFor="organization"
              className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2"
            >
              <Building className="w-3 h-3 text-primary" />
              Organization Name
            </Label>
            <Input
              id="organization"
              type="text"
              placeholder="Acme Security"
              value={formData.organization}
              onChange={(e) => handleInputChange("organization", e.target.value)}
              className="h-10 sm:h-11 text-sm sm:text-base"
              required
            />
            {errors.organization && <p className="text-xs sm:text-sm text-destructive">{errors.organization}</p>}
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
                placeholder="Create a secure password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
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
            {errors.password && <p className="text-xs sm:text-sm text-destructive">{errors.password}</p>}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2"
            >
              <Lock className="w-3 h-3 text-primary" />
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className="pr-10 h-10 sm:h-11 text-sm sm:text-base"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-2 sm:px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                ) : (
                  <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && <p className="text-xs sm:text-sm text-destructive">{errors.confirmPassword}</p>}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                className="mt-0.5 sm:mt-1 h-4 w-4"
              />
              <Label htmlFor="terms" className="text-xs sm:text-sm leading-relaxed text-foreground">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:text-primary/80 underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:text-primary/80 underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
            {errors.terms && <p className="text-xs sm:text-sm text-destructive">{errors.terms}</p>}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 sm:space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
          <Button type="submit" className="w-full font-medium h-10 sm:h-11 text-sm sm:text-base" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2"></div>
                Creating Account...
              </>
            ) : (
              <>
                <Building className="w-4 h-4 mr-2" />
                Join ROC Platform
              </>
            )}
          </Button>

          <div className="text-center text-xs sm:text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/" className="text-primary hover:text-primary/80 transition-colors font-medium">
              Sign in →
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
