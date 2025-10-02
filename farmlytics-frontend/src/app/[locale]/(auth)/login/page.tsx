"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";

// Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const t = useTranslations("login");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setIsPending(true);
    try {
      console.log("Login data:", data);
      // Replace with your login API call
      // await loginUser(data);
      // if (data.rememberMe) { saveTokenToLocalStorage() }
      // router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 via-green-50 to-amber-100 flex items-center justify-center px-4 py-8">
      {/* Main container */}
      <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[600px] max-h-[90vh] border border-green-100">
        
        {/* Left side - Branding and image */}
        <div className="lg:w-2/5 bg-gradient-to-br from-[#2E7D32] to-[#4CAF50] relative overflow-hidden flex items-center justify-center p-6 md:p-8">
          {/* Subtle agricultural pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 md:top-10 md:left-10 w-20 h-20 md:w-32 md:h-32 bg-leaf-pattern bg-contain"></div>
            <div className="absolute bottom-4 right-4 md:bottom-20 md:right-16 w-16 h-16 md:w-24 md:h-24 bg-leaf-pattern bg-contain rotate-45"></div>
            <div className="absolute top-1/3 right-4 md:right-20 w-12 h-12 md:w-20 md:h-20 bg-leaf-pattern bg-contain rotate-12"></div>
          </div>
          
          {/* Content container */}
          <div className="relative z-10 text-center text-white w-full max-w-xs md:max-w-none">
            {/* Logo */}
            <div className="flex justify-center mb-6 md:mb-8">
              <Link href="/" className="group">
                <div className="relative">
                  <div className="absolute -inset-2 md:-inset-4 bg-white/10 rounded-2xl blur-md group-hover:bg-white/20 transition-all duration-300"></div>
                  <Logo />
                </div>
              </Link>
            </div>

            {/* Agricultural image */}
            <div className="relative w-32 h-32 md:w-48 md:h-48 mx-auto mb-6 md:mb-8">
              <div className="absolute inset-0 bg-white/20 rounded-2xl transform rotate-3 md:rotate-6 scale-105"></div>
              <div className="relative w-full h-full bg-white rounded-2xl shadow-2xl flex items-center justify-center p-3 md:p-4">
                <Image
                  src="/image/crop.png"
                  alt="Agriculture"
                  width={120}
                  height={120}
                  className="object-contain w-20 h-20 md:w-32 md:h-32"
                  priority
                />
              </div>
            </div>

            {/* Welcome text */}
            <h1 className="text-xl md:text-3xl font-bold mb-3 md:mb-4 text-white">Welcome Back to Our Farming Community</h1>
            <p className="text-green-100 text-sm md:text-lg leading-relaxed">
              Sign in to continue your journey with fellow farmers and growers.
            </p>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="lg:w-3/5 p-6 md:p-8 lg:p-12 flex flex-col justify-center overflow-y-auto">
          {/* Form header */}
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 md:mb-3">Sign In to Your Account</h2>
            <p className="text-gray-600 text-sm md:text-base">Welcome back! Please enter your details</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
              {/* Email field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold text-xs md:text-sm">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="h-10 md:h-12 rounded-lg md:rounded-xl border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-[#4CAF50] focus-visible:border-[#4CAF50] transition-all duration-200 shadow-sm text-sm md:text-base pl-9 md:pl-11"
                          placeholder="Enter your email address"
                          type="email"
                          {...field}
                        />
                        <svg className="absolute left-2.5 md:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              {/* Password field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold text-xs md:text-sm">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="h-10 md:h-12 rounded-lg md:rounded-xl border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-[#4CAF50] focus-visible:border-[#4CAF50] transition-all duration-200 shadow-sm text-sm md:text-base pr-9 md:pr-11"
                          placeholder="Enter your password"
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute inset-y-0 right-0 px-2 md:px-3 flex items-center hover:bg-transparent"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? 
                            <EyeOff className="w-4 h-4 md:w-5 md:h-5 text-gray-400" /> : 
                            <Eye className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                          }
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              {/* Remember me and forgot password */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-[#4CAF50] data-[state=checked]:border-[#4CAF50]"
                        />
                      </FormControl>
                      <FormLabel className="text-xs md:text-sm font-normal text-gray-700 cursor-pointer">
                        Remember me for 30 days
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <Link
                  href="/forgot-password"
                  className="text-xs md:text-sm text-[#4CAF50] hover:text-[#2E7D32] font-medium underline-offset-2 md:underline-offset-4 hover:underline transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>

              {form.formState.errors.root && (
                <div className="p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg md:rounded-xl text-red-600 text-xs md:text-sm">
                  {form.formState.errors.root.message}
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full h-10 md:h-12 bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] hover:from-[#45a049] hover:to-[#1B5E20] text-white font-semibold text-sm md:text-base rounded-lg md:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border-0 mt-4 md:mt-6"
                disabled={isPending}
              >
                {isPending ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-xs md:text-sm">Signing in...</span>
                  </div>
                ) : (
                  <span className="text-xs md:text-sm">Sign In</span>
                )}
              </Button>
            </form>
          </Form>

          {/* Sign up link */}
          <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
            <p className="text-center text-xs md:text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/register" className="text-[#4CAF50] hover:text-[#2E7D32] font-semibold underline-offset-2 md:underline-offset-4 hover:underline transition-colors duration-200">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Add CSS for leaf pattern */}
      <style jsx>{`
        .bg-leaf-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 1C5 1 1 5 1 10C1 15 5 19 10 19C15 19 19 15 19 10C19 5 15 1 10 1Z' stroke='%23ffffff' stroke-width='0.5'/%3E%3Cpath d='M10 1C7 3 5 6 5 10C5 14 7 17 10 19C13 17 15 14 15 10C15 6 13 3 10 1Z' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}