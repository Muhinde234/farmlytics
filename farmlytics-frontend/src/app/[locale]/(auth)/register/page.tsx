"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Leaf } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    district: z.string().min(2, "District is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, "You must accept the terms and conditions"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const t = useTranslations("register")
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("Registration data:", data)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#00A651]/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#00A1DE]/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Back to Home Button */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-[#00A651] rounded-lg shadow-md hover:bg-[#00A651] hover:text-white transition-all duration-300 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("backToHome")}
      </Link>

      <div className="w-full max-w-6xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden relative z-10">
        <div className="flex flex-col lg:flex-row min-h-[700px]">
          <div className="lg:w-2/5 bg-gradient-to-br from-[#00A651] via-[#00A651] to-[#00A1DE] p-12 flex flex-col justify-center relative overflow-hidden">
            {/* Simplified animated background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse" />
              <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#FCDC04]/20 rounded-2xl animate-pulse" />
            </div>

            {/* Color accent bars - green first */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00A651] via-[#FCDC04] to-[#00A1DE]" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <Leaf className="w-7 h-7 text-[#00A651]" />
                </div>
                <span className="text-2xl font-bold text-white">Farmlytics</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4 leading-tight">{t("welcomeTitle")}</h1>
              <p className="text-white/90 text-lg leading-relaxed">{t("welcomeSubtitle")}</p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:w-3/5 p-12 flex items-center justify-center">
            <div className="w-full max-w-md">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{t("pageTitle")}</h2>
              <p className="text-gray-600 mb-8">{t("pageSubtitle")}</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t("firstName.label")}</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder={t("firstName.placeholder")}
                      className="h-11 focus:ring-2 focus:ring-[#00A651] transition-all"
                      {...register("firstName")}
                    />
                    {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t("lastName.label")}</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder={t("lastName.placeholder")}
                      className="h-11 focus:ring-2 focus:ring-[#00A651] transition-all"
                      {...register("lastName")}
                    />
                    {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">{t("district.label")}</Label>
                  <Input
                    id="district"
                    type="text"
                    placeholder={t("district.placeholder")}
                    className="h-11 focus:ring-2 focus:ring-[#00A651] transition-all"
                    {...register("district")}
                  />
                  {errors.district && <p className="text-sm text-red-500">{errors.district.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t("email.label")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("email.placeholder")}
                    className="h-11 focus:ring-2 focus:ring-[#00A651] transition-all"
                    {...register("email")}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t("password.label")}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t("password.placeholder")}
                    className="h-11 focus:ring-2 focus:ring-[#00A651] transition-all"
                    {...register("password")}
                  />
                  {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t("confirmPassword.label")}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={t("confirmPassword.placeholder")}
                    className="h-11 focus:ring-2 focus:ring-[#00A651] transition-all"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox id="terms" {...register("terms")} className="mt-1" />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {t("termsLabel")}
                    </label>
                  </div>
                  {errors.terms && <p className="text-sm text-red-500">{errors.terms.message}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-[#00A651] hover:bg-[#008F45] text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {isLoading ? t("registering") : t("registerButton")}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600">
                {t("haveAccount")}{" "}
                <Link href="/login" className="font-medium text-[#00A651] hover:text-[#008F45] transition-colors">
                  {t("loginLink")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
