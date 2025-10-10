"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import Logo from "@/components/common/logo"
import { ArrowLeft, CheckCircle2, Loader2, Mail, XCircle } from "lucide-react"

export default function VerifyEmailPage() {
  const t = useTranslations("verifyEmail")
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle")
  const [message, setMessage] = useState<string>("")

  // In a real application, you'd extract a token from the URL (e.g., query params)
  // and send it to your backend for verification.
  useEffect(() => {
    const verifyToken = async () => {
      setVerificationStatus("verifying")
      setMessage(t("verifyingMessage"))

      // Simulate API call for verification
      try {
        // const token = new URLSearchParams(window.location.search).get("token")
        // if (!token) {
        //   throw new Error("No verification token found.")
        // }

        // Simulate a delay and then a success or error
        await new Promise((resolve) => setTimeout(resolve, 2000))

        const success = Math.random() > 0.3; // Simulate 70% chance of success

        if (success) {
          setVerificationStatus("success")
          setMessage(t("successMessage"))
        } else {
          throw new Error(t("errorMessageDefault"))
        }
      } catch (err: any) {
        setVerificationStatus("error")
        setMessage(err.message || t("errorMessageDefault"))
      }
    }

    verifyToken()
  }, [t])

  const handleResendEmail = async () => {
    setVerificationStatus("verifying")
    setMessage(t("resendingMessage"))

    // Simulate API call to resend verification email
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      // Assuming resend is always successful in simulation
      setVerificationStatus("idle"); // Go back to idle to show message, user will need to refresh to re-verify or click the new link
      setMessage(t("resendSuccessMessage"));
    } catch (err) {
      setVerificationStatus("error");
      setMessage(t("resendErrorMessage"));
    }
  }

  const renderContent = () => {
    switch (verificationStatus) {
      case "verifying":
        return (
          <>
            <div className="flex justify-center mb-6">
              <Loader2 className="w-16 h-16 text-green-600 animate-spin" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t("verifyingTitle")}</h2>
            <p className="text-gray-600 mb-8">{message}</p>
          </>
        )
      case "success":
        return (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t("successTitle")}</h2>
            <p className="text-gray-600 mb-8">{message}</p>
            <Link href="/login">
              <Button className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold text-base rounded-md shadow-md hover:shadow-lg transition-all duration-300">
                {t("goToLogin")}
              </Button>
            </Link>
          </>
        )
      case "error":
        return (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t("errorTitle")}</h2>
            <p className="text-gray-600 mb-8">{message}</p>
            <Button
              onClick={handleResendEmail}
              className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold text-base rounded-md shadow-md hover:shadow-lg transition-all duration-300"
            >
              {t("resendVerification")}
            </Button>
            <p className="mt-6 text-center text-sm text-gray-600">
              {t("or")}{" "}
              <Link href="/login" className="font-bold text-green-600 hover:text-green-700 transition-colors">
                {t("backToLogin")}
              </Link>
            </p>
          </>
        )
      default: // idle state, for after resend typically
        return (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{t("initialTitle")}</h2>
              <p className="text-gray-600 mb-8">{message || t("initialMessage")}</p>
              <Button
                onClick={handleResendEmail}
                className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold text-base rounded-md shadow-md hover:shadow-lg transition-all duration-300"
              >
                {t("resendVerification")}
              </Button>
              <p className="mt-6 text-center text-sm text-gray-600">
              {t("or")}{" "}
              <Link href="/login" className="font-bold text-green-600 hover:text-green-700 transition-colors">
                {t("backToLogin")}
              </Link>
            </p>
            </>
        );
    }
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

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10 relative z-10 border border-gray-100 text-center">
        <div className="flex flex-col items-center mb-8">
          <Logo />
        </div>
        {renderContent()}
      </div>
    </div>
  )
}