"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Leaf, Loader2, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Logo from "@/components/common/logo"

const registerSchema = z
  .object({
    firstName: z.string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be less than 50 characters"),
    lastName: z.string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be less than 50 characters"),
    district: z.string().min(2, "Please enter your district"),
    email: z.string()
      .email("Please enter a valid email address")
      .min(1, "Email is required"),
    password: z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.boolean().refine((val) => val === true, "You must accept the terms and conditions"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type RegisterFormData = z.infer<typeof registerSchema>

type PasswordRequirement = {
  text: string
  met: boolean
}

export default function RegisterPage() {
  const t = useTranslations("register")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirement[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const watchPassword = watch("password", "")
  const watchConfirmPassword = watch("confirmPassword", "")

  // Calculate password strength and requirements
  useEffect(() => {
    const requirements = [
      { text: "At least 8 characters", met: watchPassword.length >= 8 },
      { text: "One uppercase letter", met: /[A-Z]/.test(watchPassword) },
      { text: "One lowercase letter", met: /[a-z]/.test(watchPassword) },
      { text: "One number", met: /[0-9]/.test(watchPassword) },
      { text: "One special character", met: /[^A-Za-z0-9]/.test(watchPassword) },
    ]

    const metCount = requirements.filter(req => req.met).length
    setPasswordStrength((metCount / requirements.length) * 100)
    setPasswordRequirements(requirements)
  }, [watchPassword])

  // Real-time validation for confirm password
  useEffect(() => {
    if (watchConfirmPassword && watchPassword) {
      trigger("confirmPassword")
    }
  }, [watchPassword, watchConfirmPassword, trigger])

  const getStrengthColor = () => {
    if (passwordStrength < 40) return "bg-red-500"
    if (passwordStrength < 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getStrengthText = () => {
    if (passwordStrength < 40) return "Weak"
    if (passwordStrength < 70) return "Medium"
    return "Strong"
  }

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("Registration data:", data)
    setIsLoading(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 relative">
        <Link
          href="/"
          className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-green-700 rounded-xl shadow-md hover:bg-green-700 hover:text-white transition-all duration-300 font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToHome")}
        </Link>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10 relative z-10 border border-gray-100 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for registering with Farmlytics. Please check your email to verify your account.
          </p>
          <Link href="/login">
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 relative">
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-green-700 rounded-xl shadow-md hover:bg-green-700 hover:text-white transition-all duration-300 font-semibold text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("backToHome")}
      </Link>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10 relative z-10 border border-gray-100">
        <div className="flex flex-col items-center mb-8">
         <Logo/>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("pageTitle")}</h1>
          <p className="text-gray-500 text-center">{t("pageSubtitle")}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-700 font-medium">
                {t("firstName.label")}
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder={t("firstName.placeholder")}
                {...register("firstName")}
                className={`h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all duration-200 ${
                  errors.firstName ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-700 font-medium">
                {t("lastName.label")}
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder={t("lastName.placeholder")}
                {...register("lastName")}
                className={`h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all duration-200 ${
                  errors.lastName ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="district" className="text-gray-700 font-medium">
              {t("district.label")}
            </Label>
            <Input
              id="district"
              type="text"
              placeholder={t("district.placeholder")}
              {...register("district")}
              className={`h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all duration-200 ${
                errors.district ? "border-red-500 focus:border-red-500" : ""
              }`}
            />
            {errors.district && (
              <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                {errors.district.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">
              {t("email.label")}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={t("email.placeholder")}
              {...register("email")}
              className={`h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all duration-200 ${
                errors.email ? "border-red-500 focus:border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="password" className="text-gray-700 font-medium">
              {t("password.label")}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("password.placeholder")}
                {...register("password")}
                className={`h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all duration-200 pr-10 ${
                  errors.password ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Password Strength Meter */}
            {watchPassword && (
              <div className="space-y-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Password strength:</span>
                  <span className={`text-sm font-semibold ${
                    passwordStrength < 40 ? "text-red-500" : 
                    passwordStrength < 70 ? "text-yellow-500" : "text-green-500"
                  }`}>
                    {getStrengthText()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-1">
                      {req.met ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <XCircle className="w-3 h-3 text-gray-400" />
                      )}
                      <span className={req.met ? "text-green-600" : "text-gray-500"}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {errors.password && (
              <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
              {t("confirmPassword.label")}
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t("confirmPassword.placeholder")}
                {...register("confirmPassword")}
                className={`h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all duration-200 pr-10 ${
                  errors.confirmPassword ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="terms" 
                {...register("terms")} 
                className="mt-1 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-relaxed text-gray-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("termsLabel")}{" "}
                <Link href="/terms" className="text-green-600 hover:text-green-700 underline font-semibold">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-green-600 hover:text-green-700 underline font-semibold">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                {errors.terms.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold text-base rounded-md shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("registering")}
              </>
            ) : (
              t("registerButton")
            )}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          {t("haveAccount")}{" "}
          <Link href="/login" className="font-bold text-green-600 hover:text-green-700 transition-colors">
            {t("loginLink")}
          </Link>
        </p>
      </div>
    </div>
  )
}