"use client"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, Mail, CheckCircle2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Logo from "@/components/common/logo" // Assuming Logo component is available

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 relative">
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-green-700 rounded-xl shadow-md hover:bg-green-700 hover:text-white transition-all duration-300 font-semibold text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("backToHome")}
      </Link>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10 relative z-10 border border-gray-100">
        {!emailSent ? (
          <>
            <div className="flex flex-col items-center mb-8">
              <Logo />
              <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">{t("title")}</h1>
              <p className="text-gray-500 text-center">{t("subtitle")}</p>
            </div>

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
                  className={`h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all duration-200 ${
                    errors.email ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                {errors.email && <p className="text-sm text-red-500 font-medium">{errors.email.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold text-base rounded-md shadow-md hover:shadow-lg transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("sending")}
                  </>
                ) : (
                  t("sendButton")
                )}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-600">
              {t("rememberPassword")}{" "}
              <Link href="/login" className="font-bold text-green-600 hover:text-green-700 transition-colors">
                {t("backToLogin")}
              </Link>
            </p>
          </>
        ) : (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t("successTitle")}</h2>
            <p className="text-gray-600 mb-8">{t("successMessage")}</p>
            <Button
              onClick={() => setEmailSent(false)}
              variant="outline"
              className="w-full h-11 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300 rounded-md"
            >
              {t("resendButton")}
            </Button>
            <p className="mt-6 text-center text-sm text-gray-600">
              <Link href="/login" className="font-bold text-green-600 hover:text-green-700 transition-colors">
                {t("backToLogin")}
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}