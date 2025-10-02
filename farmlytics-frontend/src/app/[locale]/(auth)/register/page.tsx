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

export default function RegisterPage() {
  const t = useTranslations("register");
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  // Dynamic schema with translations
  const registerSchema = z.object({
    firstName: z.string().min(1, { message: t("firstNameInvalid") }),
    lastName: z.string().min(1, { message: t("lastNameInvalid") }),
    district: z.string().min(1, { message: t("districtInvalid") }),
    email: z.string()
      .min(1, { message: t("emailRequired") })
      .email({ message: t("emailInvalid") }),
    password: z.string().min(8, { message: t("passwordMin") }),
    confirmPassword: z.string().min(8, { message: t("passwordMin") }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t("confirmPasswordMatch"),
    path: ["confirmPassword"],
  });

  type RegisterFormInputs = z.infer<typeof registerSchema>;

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
      <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[600px] max-h-[90vh] border border-green-100">
        
        {/* Left side - Image and branding */}
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

            {/* Agricultural image - using your crop.png */}
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
            <h1 className="text-xl md:text-3xl font-bold mb-3 md:mb-4 text-white">Join Our Farming Community</h1>
            <p className="text-green-100 text-sm md:text-lg leading-relaxed">
              Connect with farmers, share knowledge, and grow together in our agricultural network.
            </p>
          </div>
        </div>

        {/* Right side - Registration form */}
        <div className="lg:w-3/5 p-6 md:p-8 lg:p-12 flex flex-col justify-center overflow-y-auto">
          {/* Form header */}
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 md:mb-3">{t("title")}</h2>
            <p className="text-gray-600 text-sm md:text-base">{t("subtitle")}</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
              {/* Name fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold text-xs md:text-sm">{t("firstName")}</FormLabel>
                      <FormControl>
                        <Input
                          className="h-10 md:h-12 rounded-lg md:rounded-xl border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-[#4CAF50] focus-visible:border-[#4CAF50] transition-all duration-200 shadow-sm text-sm md:text-base"
                          placeholder={t("firstNamePlaceholder")}
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
                      <FormLabel className="text-gray-700 font-semibold text-xs md:text-sm">{t("lastName")}</FormLabel>
                      <FormControl>
                        <Input
                          className="h-10 md:h-12 rounded-lg md:rounded-xl border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-[#4CAF50] focus-visible:border-[#4CAF50] transition-all duration-200 shadow-sm text-sm md:text-base"
                          placeholder={t("lastNamePlaceholder")}
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
                    <FormLabel className="text-gray-700 font-semibold text-xs md:text-sm">{t("district")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="h-10 md:h-12 rounded-lg md:rounded-xl border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-[#4CAF50] focus-visible:border-[#4CAF50] transition-all duration-200 shadow-sm text-sm md:text-base pl-9 md:pl-11"
                          placeholder={t("districtPlaceholder")}
                          {...field}
                        />
                        <svg className="absolute left-2.5 md:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <FormLabel className="text-gray-700 font-semibold text-xs md:text-sm">{t("email")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="h-10 md:h-12 rounded-lg md:rounded-xl border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-[#4CAF50] focus-visible:border-[#4CAF50] transition-all duration-200 shadow-sm text-sm md:text-base pl-9 md:pl-11"
                          placeholder={t("emailPlaceholder")}
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

              {/* Password fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold text-xs md:text-sm">{t("password")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="h-10 md:h-12 rounded-lg md:rounded-xl border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-[#4CAF50] focus-visible:border-[#4CAF50] transition-all duration-200 shadow-sm text-sm md:text-base pl-9 md:pl-11"
                            placeholder={t("passwordPlaceholder")}
                            type="password"
                            {...field}
                          />
                          <svg className="absolute left-2.5 md:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      <FormLabel className="text-gray-700 font-semibold text-xs md:text-sm">{t("confirmPassword")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="h-10 md:h-12 rounded-lg md:rounded-xl border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-[#4CAF50] focus-visible:border-[#4CAF50] transition-all duration-200 shadow-sm text-sm md:text-base pl-9 md:pl-11"
                            placeholder={t("confirmPasswordPlaceholder")}
                            type="password"
                            {...field}
                          />
                          <svg className="absolute left-2.5 md:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <span className="text-xs md:text-sm">{t("registering")}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span className="text-xs md:text-sm">{t("registerButton")}</span>
                  </div>
                )}
              </Button>
            </form>
          </Form>

          {/* Login link */}
          <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
            <p className="text-center text-xs md:text-sm text-gray-600">
              {t("haveAccount")}{" "}
              <Link href="/login" className="text-[#4CAF50] hover:text-[#2E7D32] font-semibold underline-offset-2 md:underline-offset-4 hover:underline transition-colors duration-200">
                {t("loginLink")}
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