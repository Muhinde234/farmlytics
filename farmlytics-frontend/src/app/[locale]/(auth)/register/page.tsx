"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { 
  Eye, 
  EyeOff, 
  Leaf, 
  User, 
  MapPin, 
  Mail, 
  Lock, 
  CheckCircle2,
  ArrowRight,
  Sparkles
} from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const registerSchema = z.object({
    firstName: z.string().min(2, { message: t("firstNameInvalid") }).max(50),
    lastName: z.string().min(2, { message: t("lastNameInvalid") }).max(50),
    district: z.string().min(2, { message: t("districtInvalid") }),
    email: z.string().min(1, { message: t("emailRequired") }).email({ message: t("emailInvalid") }),
    password: z.string().min(8, { message: t("passwordMin") })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { message: t("passwordComplexity") }),
    confirmPassword: z.string().min(8, { message: t("passwordMin") }),
    terms: z.boolean().refine(val => val === true, { message: t("termsRequired") }),
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
      terms: false,
    },
  });

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const onSubmit = async (data: RegisterFormInputs) => {
    setIsPending(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(t("success"));
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || t("error"));
    } finally {
      setIsPending(false);
    }
  };

  const features = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      text: "Smart Farming Analytics"
    },
    {
      icon: <Leaf className="w-5 h-5" />,
      text: "Crop Management Tools"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      text: "Local Market Insights"
    },
    {
      icon: <User className="w-5 h-5" />,
      text: "Expert Community Access"
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-white to-amber-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-7xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[700px] border border-green-100/50">
        {/* Left side - Premium Branding */}
        <div className="lg:w-2/5 bg-gradient-to-br from-emerald-900 via-green-900 to-teal-800 relative overflow-hidden flex items-center justify-center p-8 lg:p-12">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute top-10 left-10 w-20 h-20 bg-leaf-pattern bg-contain animate-float"></div>
            <div className="absolute bottom-20 right-16 w-16 h-16 bg-leaf-pattern bg-contain animate-float animation-delay-2000"></div>
            <div className="absolute top-1/3 right-20 w-12 h-12 bg-leaf-pattern bg-contain animate-float animation-delay-4000"></div>
            <div className="absolute bottom-1/4 left-16 w-14 h-14 bg-leaf-pattern bg-contain animate-float animation-delay-3000"></div>
          </div>

          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-shimmer"></div>

          <div className="relative z-10 text-center text-white w-full max-w-sm">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Link href="/" className="group">
                <div className="relative">
                  <div className="absolute -inset-4 bg-white/10 rounded-2xl blur-xl group-hover:bg-white/20 transition-all duration-500"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 group-hover:border-white/30 transition-all duration-300">
                    <Logo  />
                  </div>
                </div>
              </Link>
            </div>

            {/* Main heading */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 mb-4">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="text-sm font-medium text-amber-100">Join 10,000+ Farmers</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-br from-white to-emerald-100 bg-clip-text text-transparent">
                Grow Your Farm's Potential
              </h1>
              <p className="text-emerald-100 text-lg leading-relaxed">
                Join the most trusted agricultural platform and transform your farming journey.
              </p>
            </div>

            {/* Features list */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <span className="text-emerald-50 font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-6 text-sm text-emerald-200">
              <div className="text-center">
                <div className="font-bold text-white">99.9%</div>
                <div>Uptime</div>
              </div>
              <div className="w-px h-6 bg-emerald-400/30"></div>
              <div className="text-center">
                <div className="font-bold text-white">24/7</div>
                <div>Support</div>
              </div>
              <div className="w-px h-6 bg-emerald-400/30"></div>
              <div className="text-center">
                <div className="font-bold text-white">SSL</div>
                <div>Secure</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Registration Form */}
        <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center bg-white/90 backdrop-blur-sm">
          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Create Your Account
              </h2>
              <p className="text-gray-600 text-lg">
                Start your journey with Farmlytics today
              </p>
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
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your first name"
                            {...field}
                            className="h-12 rounded-xl border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all duration-200 shadow-sm"
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
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your last name"
                            {...field}
                            className="h-12 rounded-xl border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all duration-200 shadow-sm"
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500 mt-1" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* District */}
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        District
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your district"
                          {...field}
                          className="h-12 rounded-xl border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all duration-200 shadow-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500 mt-1" />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          {...field}
                          className="h-12 rounded-xl border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all duration-200 shadow-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500 mt-1" />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              calculatePasswordStrength(e.target.value);
                            }}
                            className="h-12 rounded-xl border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all duration-200 shadow-sm pr-12"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </Button>
                        </div>
                      </FormControl>
                      {field.value && (
                        <div className="mt-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-500">Password strength</span>
                            <span className="text-xs font-medium text-gray-700">{passwordStrength}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                passwordStrength < 50 ? "bg-red-500" :
                                passwordStrength < 75 ? "bg-amber-500" : "bg-emerald-500"
                              }`}
                              style={{ width: `${passwordStrength}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      <FormMessage className="text-xs text-red-500 mt-1" />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            {...field}
                            className="h-12 rounded-xl border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all duration-200 shadow-sm pr-12"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500 mt-1" />
                    </FormItem>
                  )}
                />

                {/* Terms and Conditions */}
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-200 p-4 bg-gray-50/50">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 mt-0.5"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm text-gray-700 font-normal">
                          I agree to the{" "}
                          <Link href="/terms" className="text-emerald-600 hover:text-emerald-700 font-medium underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700 font-medium underline">
                            Privacy Policy
                          </Link>
                        </FormLabel>
                        <FormMessage className="text-xs text-red-500" />
                      </div>
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold text-base rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border-0 mt-2 group"
                >
                  {isPending ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  )}
                </Button>

                {/* Login link */}
                <div className="text-center pt-4">
                  <p className="text-gray-600 text-sm">
                    Already have an account?{" "}
                    <Link 
                      href="/login" 
                      className="text-emerald-600 hover:text-emerald-700 font-semibold underline-offset-2 hover:underline transition-colors duration-200 inline-flex items-center gap-1"
                    >
                      Sign in here
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }

        .bg-leaf-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 5C12 5 5 12 5 20C5 28 12 35 20 35C28 35 35 28 35 20C35 12 28 5 20 5Z' stroke='%23ffffff' stroke-width='0.5'/%3E%3Cpath d='M20 5C16 8 14 12 14 20C14 28 16 32 20 35C24 32 26 28 26 20C26 12 24 8 20 5Z' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}