"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Link } from "@/i18n/routing"
import Logo from "@/components/common/logo"
import { Button } from "@/components/ui/button"
import {
  Globe,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  LayoutDashboard,
  LeafyGreen,
  ShoppingBag,
  BarChart2,
} from "lucide-react"

import { useUser } from "@/context/userContext"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

type LucideIcon = React.ComponentType<{ className?: string }>

// Define the icon map with explicit types
const iconMap: { [key: string]: LucideIcon } = {
  LayoutDashboard: LayoutDashboard,
  LeafyGreen: LeafyGreen,
  ShoppingBag: ShoppingBag,
  BarChart2: BarChart2,
}

export default function HomePage() {
  const t = useTranslations("home")
  const tCommon = useTranslations("common")
  const currentLocale = useLocale()
  const router = useRouter()
  const { user, logout } = useUser()

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    setHasAnimated(true)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
    { code: "rw", name: "Kinyarwanda" },
  ]

  const handleChangeLocale = (newLocale: string) => {
    const segments = window.location.pathname.split("/")
    segments[1] = newLocale
    router.replace(segments.join("/"))
    setIsLanguageOpen(false)
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }

  // Your features array remains UNCHANGED
  const features = [
    {
      icon: "LayoutDashboard",
      title: t("features.visualInsights.title"),
      description: t("features.visualInsights.description"),
      link: "/admin",
      gradient: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-400/10 to-green-400/10",
    },
    {
      icon: "LeafyGreen",
      title: t("features.cropPlanner.title"),
      description: t("features.cropPlanner.description"),
      link: "/admin/crop-plan",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-400/10 to-emerald-400/10",
    },
    {
      icon: "ShoppingBag",
      title: t("features.marketConnection.title"),
      description: t("features.marketConnection.description"),
      link: "/admin/market-connection",
      gradient: "from-emerald-600 to-green-600",
      bgGradient: "from-emerald-500/10 to-green-500/10",
    },
    {
      icon: "BarChart2",
      title: t("features.harvestTracker.title"),
      description: t("features.harvestTracker.description"),
      link: "/harvest-tracker",
      gradient: "from-green-600 to-emerald-600",
      bgGradient: "from-green-500/10 to-emerald-500/10",
    },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased overflow-x-hidden">
      {/* Header */}
      <header
        className={`w-full fixed top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/90 backdrop-blur-lg shadow-md" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
              Farmlytics
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Language Switcher */}
            <div className="relative">
              <Button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-emerald-700 rounded-md"
              >
                <Globe className="h-5 w-5" />
                <span className="text-sm font-medium">{currentLocale.toUpperCase()}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isLanguageOpen ? "rotate-180" : ""}`} />
              </Button>
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-xl rounded-lg border border-gray-100 p-1 z-50">
                  {languages.map((lang) => (
                    <Button
                      key={lang.code}
                      variant="ghost"
                      className="w-full text-left"
                      onClick={() => handleChangeLocale(lang.code)}
                    >
                      {lang.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-emerald-600 text-white">
                        {getInitials(user.fullName || "U")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-semibold text-gray-900">{user.fullName }</span>
                      <span className="text-xs text-gray-500 capitalize">{user.role?.toLowerCase() || "Member"}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {/* Changed: "Go to Dashboard" is now always visible when logged in */}
                  <DropdownMenuItem onClick={() => router.push("/admin")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                   {tCommon("goto")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <X className="mr-2 h-4 w-4" />
                    {tCommon("leave")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button className="bg-emerald-600 text-white rounded-full px-6 py-2">{tCommon("signIn")}</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-emerald-700 text-white rounded-full px-6 py-2">{tCommon("signUp")}</Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-emerald-100 shadow-xl pb-4">
            <nav className="flex flex-col p-4 space-y-3">
              {user && (
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg mb-2">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-emerald-600 text-white">
                      {getInitials(user.fullName || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">{user.fullName || "User"}</span>
                    <span className="text-xs text-gray-500 capitalize">{user.role?.toLowerCase() || "Member"}</span>
                  </div>
                </div>
              )}

              {/* Language Switcher */}
              <div>
                <Button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="flex items-center gap-2 py-2 px-3 w-full text-left"
                >
                  <Globe size={18} /> {tCommon("language")}
                </Button>
                {isLanguageOpen && (
                  <div className="pl-5 mt-2 space-y-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleChangeLocale(lang.code)}
                        className={`block w-full text-left py-1.5 px-2 text-sm rounded ${
                          currentLocale === lang.code ? "text-green-600 font-medium" : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* User / Auth Buttons */}
              {user ? (
                <>
                  {/* Changed: "Go to Dashboard" is now always visible when logged in */}
                  <Button
                    onClick={() => router.push("/admin")} // Changed link to /admin as in desktop
                    className="bg-emerald-600 text-white rounded-full py-2 px-4 w-full"
                  >
                    {tCommon("goto")}
                  </Button>
                  <Button onClick={handleLogout} className="bg-gray-200 rounded-full py-2 px-4 w-full">
                    {tCommon("leave")}
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" className="bg-emerald-600 text-white rounded-full py-2 px-4 w-full text-center">
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-emerald-700 text-white rounded-full py-2 px-4 w-full text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="pt-16">
        <section className="relative py-20 md:py-32 text-center overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 min-h-[650px] flex items-center justify-center">
          <div className="absolute inset-0 z-0 opacity-80">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-300/30 rounded-full blur-3xl animate-float-slow"></div>
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-green-300/20 rounded-full blur-3xl animate-float-slow delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-emerald-200/40 rounded-full blur-2xl animate-float-slow delay-500"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-5xl">
            <h1
              className={`text-5xl lg:text-7xl font-extrabold mb-6 leading-tight transition-all duration-1000 ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <span className="bg-gradient-to-r from-emerald-800 via-green-700 to-emerald-800 bg-clip-text text-transparent drop-shadow-sm">
                {t("hero.headline")}
              </span>
            </h1>
            <p
              className={`text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed transition-all duration-1000 delay-300 ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <span className="font-medium">{t("hero.subHeadline")}</span>
            </p>
            <div
              className={`flex justify-center transition-all duration-1000 delay-500 ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold rounded-full shadow-lg px-10 py-6 text-lg transform hover:scale-105 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center">
                    {t("hero.ctaPrimary")}
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-gradient-to-b from-white to-emerald-50/60 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 relative">
                <span className="bg-gradient-to-r from-gray-900 via-emerald-800 to-gray-900 bg-clip-text text-transparent drop-shadow-sm">
                  {t("features.title")}
                </span>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
                {t("features.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {features.map(({ icon, title, description, link, gradient, bgGradient }, idx) => {
                const IconComponent = iconMap[icon]

                if (!IconComponent) {
                  console.warn(`Icon "${icon}" not found in iconMap. Using a fallback.`)
                  return (
                    <Link
                      href={link}
                      key={idx}
                      className="group relative bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col items-center border border-gray-100 hover:border-emerald-200 cursor-pointer overflow-hidden"
                    >
                      <div
                        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                      ></div>
                      <div className="relative z-10 w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center mb-5">
                        <X className={`w-10 h-10 text-gray-400`} />
                      </div>
                      <h3 className="text-xl font-bold mb-2 relative z-10">{title}</h3>
                      <p className="text-gray-600 relative z-10">{description}</p>
                    </Link>
                  )
                }

                return (
                  <Link
                    href={link}
                    key={idx}
                    className="group relative bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col items-center border border-gray-100 hover:border-emerald-200 cursor-pointer overflow-hidden"
                  >
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    ></div>
                    <div className="relative z-10 w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center mb-5">
                      <IconComponent className={`w-10 h-10 text-emerald-600`} />
                    </div>
                    <h3 className="text-xl font-bold mb-2 relative z-10">{title}</h3>
                    <p className="text-gray-600 relative z-10">{description}</p>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-emerald-800 text-emerald-100 py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Link href="/" className="mb-4">
              <span className="text-3xl font-extrabold text-white">Farmlytics</span>
            </Link>
            <p className="text-xl md:text-2xl font-semibold text-white max-w-xl mx-auto leading-relaxed">
              {tCommon("footer.slogan")}
            </p>
            <p className="text-sm md:text-base text-emerald-300 pt-6">
              {tCommon("footer.copyright", { year: new Date().getFullYear() })}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}