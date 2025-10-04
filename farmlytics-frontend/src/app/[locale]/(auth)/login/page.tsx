"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Link } from "@/i18n/routing"
import Logo from "@/components/common/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

// --------------------------
// Define schema
const loginSchema = z.object({
  email: z.string().min(1, { message: "email.required" }).email({ message: "email.invalid" }),
  password: z.string().min(8, { message: "password.min" }),
  rememberMe: z.boolean(),
})

type LoginFormInputs = z.infer<typeof loginSchema>

export default function LoginPage() {
  const t = useTranslations("login")
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormInputs) => {
    setIsPending(true)
    try {
      console.log("Login data:", data)
      toast.success(t("success"))
    } catch (error: any) {
      toast.error(error.message || t("error"))
    } finally {
      setIsPending(false)
    }
  }

  const getTranslatedError = (error?: { message?: string }) => {
    if (!error?.message) return ""
    return t(error.message as any)
  }

  return (
    <div className="min-h-screen w-full bg-[#EBF0E6] flex items-center justify-center p-4 md:p-8 font-sans antialiased">
      <Link
        href="/"
        className="fixed top-4 left-4 md:top-6 md:left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white text-[#4F8B52] rounded-lg shadow-md hover:shadow-lg hover:bg-[#4F8B52] hover:text-white transition-all duration-300 font-medium text-sm border border-[#DCE4D6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F8B52] focus-visible:ring-offset-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      {/* Main container */}
      <div className="w-full max-w-[900px] mx-auto bg-white rounded-[20px] shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[550px] border border-[#DCE4D6]">
        {/* Left side - Branding with professional abstract background */}
        <div className="lg:w-2/5 bg-[#4F8B52] relative overflow-hidden flex flex-col items-center justify-center p-6 md:p-8 rounded-b-[20px] lg:rounded-bl-[20px] lg:rounded-tr-none text-white">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#4F8B52] to-[#76B77D] opacity-90"></div>
          <div className="relative z-10 ">
            <div className="flex items-center justify-center">
              <Link href="/" className=" ">
                <Logo />
              </Link>
            </div>

            {/* Abstract shapes instead of image */}
            <div className="my-12 flex justify-center space-x-4">
              <div className="w-14 h-14 bg-white/20 rounded-full animate-pulse"></div>
              <div className="w-20 h-20 bg-white/30 rounded-2xl animate-pulse delay-150"></div>
              <div className="w-12 h-12 bg-white/10 rounded-full animate-pulse delay-300"></div>
            </div>

            <h1 className="text-2xl font-bold mb-2 text-white drop-shadow-sm">Welcome to Farmlytics</h1>
            <p className="text-[#DCE4D6] text-sm leading-relaxed opacity-90 font-light">
              Connecting Farmers, Growing Futures
            </p>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="lg:w-3/5 p-6 md:p-8 lg:p-10 flex flex-col justify-center bg-white rounded-t-[20px] lg:rounded-tr-[20px] lg:rounded-bl-none">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Farmlytics</h2>
            <p className="text-gray-600 text-sm">Connect to your account</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-5">
              {/* Email field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        type="email"
                        {...field}
                        className="h-10 rounded-lg border-gray-300 bg-white focus-visible:ring-1 focus-visible:ring-[#4F8B52] focus-visible:border-[#4F8B52] transition-all duration-200 shadow-sm text-sm pl-3 pr-8"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1">
                      {getTranslatedError(form.formState.errors.email)}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {/* Password field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          {...field}
                          className="h-10 rounded-lg border-gray-300 bg-white focus-visible:ring-1 focus-visible:ring-[#4F8B52] focus-visible:border-[#4F8B52] transition-all duration-200 shadow-sm text-sm pl-3 pr-8"
                        />
                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute inset-y-0 right-0 px-2 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4F8B52] rounded-r-lg"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1">
                      {getTranslatedError(form.formState.errors.password)}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {/* Remember me */}
              <div className="flex items-center justify-between mt-3">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300 data-[state=checked]:bg-[#4F8B52] data-[state=checked]:border-[#4F8B52] focus-visible:ring-1 focus-visible:ring-[#4F8B52] focus-visible:ring-offset-1"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal text-gray-700 cursor-pointer select-none">
                        Remember me
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <Link
                  href="/forgot-password"
                  className="text-sm text-[#4F8B52] hover:text-[#5AA45D] font-medium hover:underline underline-offset-2 transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4F8B52] rounded"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-10 bg-gradient-to-r from-[#5AA45D] to-[#4F8B52] hover:from-[#4F8B52] hover:to-[#5AA45D] text-white font-semibold text-sm rounded-lg transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F8B52] focus-visible:ring-offset-2 mt-4"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.062 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging In...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>

              <p className="mt-4 text-center text-xs text-gray-600">
                Don&apos;t have your account?{" "}
                <Link
                  href="/register"
                  className="text-[#4F8B52] hover:text-[#5AA45D] font-semibold underline-offset-2 hover:underline transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4F8B52] rounded"
                >
                  Register
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
