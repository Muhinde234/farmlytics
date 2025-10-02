"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/common/logo"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const registerSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  district: z.string().min(1, { message: "District is required" }),
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Password confirmation must be at least 8 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const t = useTranslations("register");
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      district: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    setIsPending(true);
    try {
      // Replace with your registration API call
      // await registerUser(data);
      toast.success(t("success"));
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || t("error"));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 via-green-50 to-amber-100 flex items-center justify-center px-4 py-8">
      {/* Main container with agricultural aesthetic */}
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-green-100">
        
        {/* Left side - Image and branding */}
        <div className="md:w-2/5 bg-gradient-to-br from-[#2E7D32] to-[#4CAF50] relative overflow-hidden flex items-center justify-center p-8">
          {/* Subtle agricultural pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-leaf-pattern bg-contain"></div>
            <div className="absolute bottom-20 right-16 w-24 h-24 bg-leaf-pattern bg-contain rotate-45"></div>
            <div className="absolute top-1/3 right-20 w-20 h-20 bg-leaf-pattern bg-contain rotate-12"></div>
          </div>
          
          {/* Content container */}
          <div className="relative z-10 text-center text-white w-full">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Link href="/" className="group">
                <div className="relative">
                  <div className="absolute -inset-4 bg-white/10 rounded-2xl blur-md group-hover:bg-white/20 transition-all duration-300"></div>
                  <Logo />
                </div>
              </Link>
            </div>

            {/* Agricultural image - using your crop.png */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              <div className="absolute inset-0 bg-white/20 rounded-2xl transform rotate-6 scale-105"></div>
              <div className="relative w-full h-full bg-white rounded-2xl shadow-2xl flex items-center justify-center p-4">
                <Image
                  src="/image/crop.png"
                  alt="Agriculture"
                  width={160}
                  height={160}
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Welcome text */}
            <h1 className="text-3xl font-bold mb-4 text-white">Join Our Farming Community</h1>
            <p className="text-green-100 text-lg leading-relaxed">
              Connect with farmers, share knowledge, and grow together in our agricultural network.
            </p>
          </div>
        </div>

        {/* Right side - Registration form */}
        <div className="md:w-3/5 p-8 sm:p-12 flex flex-col justify-center">
          {/* Form header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Create Your Account</h2>
            <p className="text-gray-600">Join thousands of farmers in our growing community</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold text-sm">First Name</FormLabel>
                      <FormControl>
                        <Input
                          className="h-12 rounded-xl border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-[#4CAF50] focus-visible:border-[#4CAF50] transition-all duration-200 shadow-sm"
                          placeholder="Enter your first name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold text-sm">Last Name</FormLabel>
                      <FormControl>
                        <Input
                          className="h-12 rounded-xl border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-[#4CAF50] focus-visible:border-[#4CAF50] transition-all duration-200 shadow-sm"
                          placeholder="Enter your last name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* District field */}
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold text-sm">District</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="h-12 rounded-xl border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-[#4CAF50] focus-visible:border-[#4CAF50] transition-all duration-200 shadow-sm pl-11"
                          placeholder="Enter your district"
                          {...field}
                        />
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              {/* Email field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold text-sm">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="h-12 rounded-xl border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-[#4CAF50] focus-visible:border-[#4CAF50] transition-all duration-200 shadow-sm pl-11"
                          placeholder="Enter your email address"
                          type="email"
                          {...field}
                        />
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              {/* Password fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold text-sm">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="h-12 rounded-xl border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-[#4CAF50] focus-visible:border-[#4CAF50] transition-all duration-200 shadow-sm pl-11"
                            placeholder="Create password"
                            type="password"
                            {...field}
                          />
                          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold text-sm">Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="h-12 rounded-xl border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-[#4CAF50] focus-visible:border-[#4CAF50] transition-all duration-200 shadow-sm pl-11"
                            placeholder="Confirm your password"
                            type="password"
                            {...field}
                          />
                          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {form.formState.errors.root && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {form.formState.errors.root.message}
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] hover:from-[#45a049] hover:to-[#1B5E20] text-white font-semibold text-base rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border-0 mt-6"
                disabled={isPending}
              >
                {isPending ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Create Account
                  </div>
                )}
              </Button>
            </form>
          </Form>

          {/* Login link */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-[#4CAF50] hover:text-[#2E7D32] font-semibold underline-offset-4 hover:underline transition-colors duration-200">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Add some CSS for the leaf pattern */}
      <style jsx>{`
        .bg-leaf-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 1C5 1 1 5 1 10C1 15 5 19 10 19C15 19 19 15 19 10C19 5 15 1 10 1Z' stroke='%23ffffff' stroke-width='0.5'/%3E%3Cpath d='M10 1C7 3 5 6 5 10C5 14 7 17 10 19C13 17 15 14 15 10C15 6 13 3 10 1Z' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}