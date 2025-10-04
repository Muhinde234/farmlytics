"use client"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Leaf, Mail, CheckCircle2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const t = useTranslations("forgotPassword")
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setEmailSent(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00A651]/5 via-white to-[#00A1DE]/5 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#00A651]/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-[#00A1DE]/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Back to Home Button */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-[#00A651] rounded-lg shadow-md hover:bg-[#00A651] hover:text-white transition-all duration-300 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("backToHome")}
      </Link>

      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden relative z-10">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Left Side - Branding */}
          <div className="lg:w-2/5 bg-gradient-to-br from-[#00A651] via-[#00A651] to-[#00A1DE] p-12 flex flex-col justify-center relative overflow-hidden">
            {/* Simplified animated background shapes */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse" />
              <div
                className="absolute bottom-20 right-10 w-40 h-40 bg-[#FCDC04]/20 rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
            </div>

            {/* Color accent bars */}
            <div className="absolute top-0 left-0 right-0 h-2 flex">
              <div className="flex-1 bg-[#00A651]" />
              <div className="flex-1 bg-[#FCDC04]" />
              <div className="flex-1 bg-[#00A1DE]" />
            </div>

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
          <div className="lg:w-3/5 p-12 flex items-center justify-center bg-white">
            <div className="w-full max-w-md">
              {!emailSent ? (
                <>
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#00A651]/10 to-[#00A1DE]/10 rounded-full flex items-center justify-center">
                      <Mail className="w-8 h-8 text-[#00A651]" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">{t("title")}</h2>
                  <p className="text-gray-600 mb-8 text-center">{t("subtitle")}</p>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">
                        {t("email.label")}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t("email.placeholder")}
                        {...register("email")}
                        className={`h-12 border-2 transition-all duration-300 ${
                          errors.email
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-200 focus:border-[#00A651] focus:ring-2 focus:ring-[#00A651]/20"
                        }`}
                      />
                      {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-[#00A651] hover:bg-[#00A651]/90 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {t("sending")}
                        </span>
                      ) : (
                        t("sendButton")
                      )}
                    </Button>
                  </form>

                  <p className="mt-6 text-center text-sm text-gray-600">
                    {t("rememberPassword")}{" "}
                    <Link
                      href="/login"
                      className="font-medium text-[#00A651] hover:text-[#00A651]/80 transition-colors"
                    >
                      {t("backToLogin")}
                    </Link>
                  </p>
                </>
              ) : (
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-[#00A651]/10 rounded-full flex items-center justify-center animate-pulse">
                      <CheckCircle2 className="w-8 h-8 text-[#00A651]" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{t("successTitle")}</h2>
                  <p className="text-gray-600 mb-8">{t("successMessage")}</p>
                  <Button
                    onClick={() => setEmailSent(false)}
                    variant="outline"
                    className="w-full h-12 border-2 border-[#00A651] text-[#00A651] hover:bg-[#00A651] hover:text-white transition-all duration-300"
                  >
                    {t("resendButton")}
                  </Button>
                  <p className="mt-6 text-center text-sm text-gray-600">
                    <Link
                      href="/login"
                      className="font-medium text-[#00A651] hover:text-[#00A651]/80 transition-colors"
                    >
                      {t("backToLogin")}
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
