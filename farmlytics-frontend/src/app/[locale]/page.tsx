"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import Logo from "@/components/common/logo"
import { Button } from "@/components/ui/button"
import { LeafyGreen, BarChart2, ShoppingBag, FileText, ArrowRight, LayoutDashboard, Sparkles } from "lucide-react"

export default function HomePage() {
  const t = useTranslations("home")
  const tCommon = useTranslations("common")

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      {/* Navigation Section */}
      <header className="w-full bg-white/90 backdrop-blur-xl border-b border-green-100 py-5 px-6 lg:px-16 flex items-center justify-between sticky top-0 z-50 transition-all duration-300">
        <Link href="/" className="flex items-center space-x-3 group">
          <Logo />
          <div className="h-6 w-px bg-green-200 hidden md:block"></div>
          <span className="text-sm font-medium text-green-700 hidden md:block group-hover:text-[#20603D] transition-colors">
            Smart Farming Platform
          </span>
        </Link>
        
        <div className="flex items-center space-x-3">
          <Link href="/login">
            <Button variant="ghost" className="text-green-700 hover:text-[#20603D] hover:bg-green-50 transition-all duration-300 font-medium">
              {tCommon("signIn")}
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-gradient-to-r from-[#20603D] to-[#2D7732] hover:from-[#2D7732] hover:to-[#20603D] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-medium px-6">
              {tCommon("signUp")}
            </Button>
          </Link>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 bg-gradient-to-br from-green-50 via-emerald-50/30 to-lime-50/50 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#20603D]/5 via-[#2D7732]/5 to-[#FAD201]/5 animate-gradient bg-[length:400%_400%]"></div>
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#2D7732]/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#20603D]/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          
          <div className="container mx-auto px-6 lg:px-16 flex flex-col lg:flex-row items-center justify-between gap-16 text-center lg:text-left relative z-10">
            <div className="lg:w-1/2 space-y-8">
              {/* Badge Element */}
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-[#2D7732]/20 shadow-sm hover:shadow-md transition-shadow duration-300">
                <Sparkles className="w-4 h-4 text-[#FAD201]" />
                <span className="text-sm font-semibold text-[#20603D]">
                  Smart Farming Revolution
                </span>
                <div className="w-2 h-2 bg-[#2D7732] rounded-full animate-pulse"></div>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-[#20603D] via-[#2D7732] to-[#20603D] bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient-text">
                  {t("hero.headline")}
                </span>
              </h1>
              
              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-green-800 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                {t("hero.subHeadline")}
              </p>

              {/* Call-to-Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#20603D] to-[#2D7732] hover:from-[#2D7732] hover:to-[#20603D] text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-8 py-6 text-lg group"
                  >
                    {t("hero.ctaPrimary")} 
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-[#20603D] border-2 border-[#20603D] hover:bg-[#20603D] hover:text-white font-bold rounded-xl transition-all duration-300 px-8 py-6 text-lg hover:shadow-lg"
                  >
                    {t("hero.ctaSecondary")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-gradient-to-b from-white to-green-50/30">
          <div className="container mx-auto px-6 lg:px-16">
            {/* Section Header */}
            <div className="text-center max-w-4xl mx-auto mb-20">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#20603D] to-[#2D7732] bg-clip-text text-transparent mb-4">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">WHY CHOOSE US</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-green-900 mb-6">
                {t("features.title")}
              </h2>
              <p className="text-xl text-green-700 leading-relaxed">
                {t("features.subtitle")}
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Crop Planner */}
              <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-green-200/60 hover:border-[#2D7732] hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#20603D]/5 to-[#2D7732]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#20603D] to-[#2D7732] rounded-2xl shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <LeafyGreen className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-900 mb-4 group-hover:text-[#20603D] transition-colors">
                    {t("features.cropPlanner.title")}
                  </h3>
                  <p className="text-green-700 leading-relaxed text-lg">
                    {t("features.cropPlanner.description")}
                  </p>
                </div>
              </div>

              {/* Market Connection */}
              <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-green-200/60 hover:border-[#2D7732] hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#20603D]/5 to-[#2D7732]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#20603D] to-[#2D7732] rounded-2xl shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <ShoppingBag className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-900 mb-4 group-hover:text-[#20603D] transition-colors">
                    {t("features.marketConnection.title")}
                  </h3>
                  <p className="text-green-700 leading-relaxed text-lg">
                    {t("features.marketConnection.description")}
                  </p>
                </div>
              </div>

              {/* Harvest Tracker */}
              <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-green-200/60 hover:border-[#2D7732] hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#20603D]/5 to-[#2D7732]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#20603D] to-[#2D7732] rounded-2xl shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <BarChart2 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-900 mb-4 group-hover:text-[#20603D] transition-colors">
                    {t("features.harvestTracker.title")}
                  </h3>
                  <p className="text-green-700 leading-relaxed text-lg">
                    {t("features.harvestTracker.description")}
                  </p>
                </div>
              </div>

              {/* Visual Insights */}
              <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-green-200/60 hover:border-[#2D7732] hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#20603D]/5 to-[#2D7732]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#20603D] to-[#2D7732] rounded-2xl shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <LayoutDashboard className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-900 mb-4 group-hover:text-[#20603D] transition-colors">
                    {t("features.visualInsights.title")}
                  </h3>
                  <p className="text-green-700 leading-relaxed text-lg">
                    {t("features.visualInsights.description")}
                  </p>
                </div>
              </div>

              {/* Export Insights */}
              <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-green-200/60 hover:border-[#2D7732] hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#20603D]/5 to-[#2D7732]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#20603D] to-[#2D7732] rounded-2xl shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-900 mb-4 group-hover:text-[#20603D] transition-colors">
                    {t("features.exportInsights.title")}
                  </h3>
                  <p className="text-green-700 leading-relaxed text-lg">
                    {t("features.exportInsights.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}