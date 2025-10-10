// pages/login.tsx (or app/login/page.tsx)
"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft,  Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {useLogin} from "@/hooks/useAuth";
import {toast} from "sonner";
import Logo from "@/components/common/logo"
import { useRouter } from "next/navigation"

const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const t = useTranslations("login")
  const router = useRouter();
  // const [isLoading] = useState(false) // You can remove this if isPending from useLogin is sufficient
  const { mutate, isPending } = useLogin() // Use isPending from useLogin

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

  const onSubmit = (data:LoginFormData ) => {
    mutate(data, {
      onSuccess: (response) => {
        // user is already set in context by useLogin's onSuccess
        // For Pages Router, you might want to reload pageProps if navigating directly or using router.replace
        // For App Router, `router.push` is generally sufficient
        router.push("/admin");
        toast.success("Login successful");
      },
      onError: (error) => {
        toast.error(error.message || "Login failed. Please check your credentials.");
      }
    });
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
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

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">
              {t("password.label")}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={t("password.placeholder")}
              {...register("password")}
              className={`h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all duration-200 ${
                errors.password ? "border-red-500 focus:border-red-500" : ""
              }`}
            />
            {errors.password && <p className="text-sm text-red-500 font-medium">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" {...register("rememberMe")} className="text-green-600 focus:ring-green-500" />
              <label
                htmlFor="remember"
                className="text-sm font-medium text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("rememberMe")}
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
            >
              {t("forgotPassword")}
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isPending} // Use isPending from useLogin
            className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold text-base rounded-md shadow-md hover:shadow-lg transition-all duration-300"
          >
            {isPending ? ( // Use isPending from useLogin
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("loggingIn")}
              </>
            ) : (
              t("loginButton")
            )}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          {t("noAccount")}{" "}
          <Link href="/register" className="font-bold text-green-600 hover:text-green-700 transition-colors">
            {t("registerLink")}
          </Link>
        </p>
      </div>
    </div>
  )
}