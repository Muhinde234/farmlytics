"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Leaf, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const t = useTranslations("login")
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] right-[10%] w-96 h-96 bg-[#FCDC04]/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[20%] left-[15%] w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-150" />
      </div>

      <Link
        href="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm text-[#00A651] rounded-xl shadow-lg hover:bg-[#00A651] hover:text-white transition-all duration-300 font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("backToHome")}
      </Link>

      <div className="w-full max-w-6xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden relative z-10">
        <div className="flex flex-col lg:flex-row min-h-[650px]">
          <div className="lg:w-2/5 bg-gradient-to-br from-[#00A651] via-[#00A651]/95 to-[#00A1DE] p-12 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 right-10 w-40 h-40 bg-[#FCDC04]/20 rounded-full animate-pulse" />
              <div className="absolute bottom-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse delay-150" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8 animate-fade-in">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <Leaf className="w-8 h-8 text-[#00A651]" />
                </div>
                <span className="text-3xl font-bold text-white drop-shadow-lg">Farmlytics</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg animate-fade-in delay-100">
                {t("welcomeTitle")}
              </h1>
              <p className="text-white/95 text-lg leading-relaxed animate-fade-in delay-200">{t("welcomeSubtitle")}</p>

              <div className="mt-12 flex gap-3">
                <div className="w-20 h-2 bg-[#00A651] rounded-full" />
               
              </div>
            </div>
          </div>

          <div className="lg:w-3/5 p-12 flex items-center justify-center">
            <div className="w-full max-w-md">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h2>
              <p className="text-gray-600 mb-8">{t("subtitle")}</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-semibold">
                    {t("email.label")}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("email.placeholder")}
                    {...register("email")}
                    className={`h-12 border-2 transition-all duration-300 ${
                      errors.email ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-[#00A651]"
                    }`}
                  />
                  {errors.email && <p className="text-sm text-red-500 font-medium">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-semibold">
                    {t("password.label")}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t("password.placeholder")}
                    {...register("password")}
                    className={`h-12 border-2 transition-all duration-300 ${
                      errors.password ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-[#00A651]"
                    }`}
                  />
                  {errors.password && <p className="text-sm text-red-500 font-medium">{errors.password.message}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" {...register("rememberMe")} />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {t("rememberMe")}
                    </label>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-semibold text-[#00A651] hover:text-[#00A1DE] transition-colors"
                  >
                    {t("forgotPassword")}
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-[#00A651] hover:bg-[#00A651]/90 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t("loggingIn")}
                    </>
                  ) : (
                    t("loginButton")
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600">
                {t("noAccount")}{" "}
                <Link href="/register" className="font-bold text-[#00A651] hover:text-[#00A1DE] transition-colors">
                  {t("registerLink")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
