"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Eye, EyeOff } from "lucide-react"
import Logo from "@/components/common/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

export default function RegisterPage() {
  const t = useTranslations("register")
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const registerSchema = z
    .object({
      firstName: z
        .string()
        .min(2, { message: t("firstNameInvalid") })
        .max(50),
      lastName: z
        .string()
        .min(2, { message: t("lastNameInvalid") })
        .max(50),
      district: z.string().min(2, { message: t("districtInvalid") }),
      email: z
        .string()
        .min(1, { message: t("emailRequired") })
        .email({ message: t("emailInvalid") }),
      password: z
        .string()
        .min(8, { message: t("passwordMin") })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { message: t("passwordComplexity") }),
      confirmPassword: z.string().min(8, { message: t("passwordMin") }),
      terms: z.boolean().refine((val) => val === true, { message: t("termsRequired") }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("confirmPasswordMatch"),
      path: ["confirmPassword"],
    })

  type RegisterFormInputs = z.infer<typeof registerSchema>

  const form = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      district: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  })

  const onSubmit = async (data: RegisterFormInputs) => {
    setIsPending(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast.success(t("success"))
      router.push("/login")
    } catch (error: any) {
      toast.error(error.message || t("error"))
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#EBF0E6] flex items-center justify-center p-4 md:p-8 font-sans antialiased">
      <div className="w-full max-w-[900px] mx-auto bg-white rounded-[20px] shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[550px] border border-[#DCE4D6]">
        <div className="lg:w-2/5 bg-[#4F8B52] relative overflow-hidden flex flex-col items-center justify-center p-6 md:p-8 rounded-b-[20px] lg:rounded-bl-[20px] lg:rounded-tr-none text-white">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#4F8B52] to-[#76B77D] opacity-90"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center">
              <Link href="/" className="">
                <Logo />
              </Link>
            </div>

            <div className="my-12 flex justify-center space-x-4">
              <div className="w-14 h-14 bg-white/20 rounded-full animate-pulse"></div>
              <div className="w-20 h-20 bg-white/30 rounded-2xl animate-pulse delay-150"></div>
              <div className="w-12 h-12 bg-white/10 rounded-full animate-pulse delay-300"></div>
            </div>

            <h1 className="text-2xl font-bold mb-2 text-white drop-shadow-sm">Join Farmlytics</h1>
            <p className="text-[#DCE4D6] text-sm leading-relaxed opacity-90 font-light">
              Start your journey with us today
            </p>
          </div>
        </div>

        <div className="lg:w-3/5 p-6 md:p-8 lg:p-10 flex flex-col justify-center bg-white rounded-t-[20px] lg:rounded-tr-[20px] lg:rounded-bl-none">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Your Account</h2>
            <p className="text-gray-600 text-sm">Fill in your details to get started</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="First Name"
                          {...field}
                          className="h-10 rounded-lg border-gray-300 bg-white focus-visible:ring-1 focus-visible:ring-[#4F8B52] focus-visible:border-[#4F8B52] transition-all duration-200 shadow-sm text-sm pl-3 pr-8"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500 mt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Last Name"
                          {...field}
                          className="h-10 rounded-lg border-gray-300 bg-white focus-visible:ring-1 focus-visible:ring-[#4F8B52] focus-visible:border-[#4F8B52] transition-all duration-200 shadow-sm text-sm pl-3 pr-8"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500 mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">District</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="District"
                        {...field}
                        className="h-10 rounded-lg border-gray-300 bg-white focus-visible:ring-1 focus-visible:ring-[#4F8B52] focus-visible:border-[#4F8B52] transition-all duration-200 shadow-sm text-sm pl-3 pr-8"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        {...field}
                        className="h-10 rounded-lg border-gray-300 bg-white focus-visible:ring-1 focus-visible:ring-[#4F8B52] focus-visible:border-[#4F8B52] transition-all duration-200 shadow-sm text-sm pl-3 pr-8"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />

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
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          {...field}
                          className="h-10 rounded-lg border-gray-300 bg-white focus-visible:ring-1 focus-visible:ring-[#4F8B52] focus-visible:border-[#4F8B52] transition-all duration-200 shadow-sm text-sm pl-3 pr-8"
                        />
                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => setShowConfirmPassword((v) => !v)}
                          className="absolute inset-y-0 right-0 px-2 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4F8B52] rounded-r-lg"
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />

              <div className="flex items-start space-x-2 mt-3">
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300 text-[#4F8B52] focus:ring-[#4F8B52] focus:ring-1 mt-0.5 cursor-pointer"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal text-gray-700 cursor-pointer select-none leading-tight">
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-[#4F8B52] hover:text-[#5AA45D] font-semibold underline-offset-2 hover:underline transition-colors duration-200"
                        >
                          Terms
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-[#4F8B52] hover:text-[#5AA45D] font-semibold underline-offset-2 hover:underline transition-colors duration-200"
                        >
                          Privacy Policy
                        </Link>
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              {form.formState.errors.terms && (
                <p className="text-xs text-red-500 mt-1">{form.formState.errors.terms.message}</p>
              )}

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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  "Register"
                )}
              </Button>

              <p className="mt-4 text-center text-xs text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#4F8B52] hover:text-[#5AA45D] font-semibold underline-offset-2 hover:underline transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4F8B52] rounded"
                >
                  Login
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
