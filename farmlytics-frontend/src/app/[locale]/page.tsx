"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import Logo from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Menu, // Changed from SquareMenu for a more common hamburger icon
  X,
  ChevronDown, // Changed from ArrowRight for language dropdown
  ArrowRight,
  LayoutDashboard,
  LeafyGreen,
  ShoppingBag,
  BarChart2,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import Footer from "@/components/common/footer";

export default function HomePage() {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const currentLocale = useLocale();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    setHasAnimated(true); // Trigger animations on mount
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
    { code: "rw", name: "Kinyarwanda" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased overflow-x-hidden">
      {/* Header */}
      <header
        className={`w-full fixed top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-lg shadow-md py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo & Brand Name */}
          <Link
            href="/"
            className="flex items-center space-x-2 group focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-md p-1 -m-1"
          >
            <Logo /> {/* Ensure Logo component is well-sized */}
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent group-hover:from-emerald-800 group-hover:to-green-700 transition-all duration-300">
              Farmlytics
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/login"
              className="text-gray-600 hover:text-emerald-700 font-medium transition px-4 py-2 rounded-full hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {tCommon("signIn")}
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all px-6 py-2.5 text-base transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400">
                {tCommon("signUp")}
              </Button>
            </Link>

            {/* Language Switcher */}
            <div className="relative">
              <Button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-emerald-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-md"
              >
                <Globe className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {currentLocale.toUpperCase()}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${
                    isLanguageOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </Button>
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-xl rounded-lg border border-gray-100 p-1 z-50 transform origin-top-right animate-fade-in-scale">
                  {languages.map((lang) => (
                    <Link
                      key={lang.code}
                      href="/"
                      locale={lang.code}
                      className={`block px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                        currentLocale === lang.code
                          ? "text-emerald-700 font-semibold bg-emerald-50"
                          : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                      } focus:outline-none focus:ring-1 focus:ring-emerald-200`}
                      onClick={() => setIsLanguageOpen(false)}
                    >
                      {lang.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Language in header (optional, if space allows, otherwise keep it in menu) */}
            {/* <div className="relative">
              <Button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="p-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <Globe size={20} />
              </Button>
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-xl rounded-lg border border-gray-100 p-1 z-50 animate-fade-in-scale">
                  {languages.map((lang) => (
                    <Link
                      key={lang.code}
                      href="/"
                      locale={lang.code}
                      className={`block px-3 py-2 rounded-md text-sm transition ${
                        currentLocale === lang.code ? "bg-emerald-50 text-emerald-700" : "text-gray-700 hover:bg-emerald-50"
                      }`}
                      onClick={() => setIsLanguageOpen(false)}
                    >
                      {lang.name}
                    </Link>
                  ))}
                </div>
              )}
            </div> */}

            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition focus:outline-none focus:ring-2 focus:ring-emerald-400 transform hover:scale-105 active:scale-95"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-emerald-100 shadow-xl animate-slide-down pb-4">
            <nav className="flex flex-col p-4 space-y-3">
              <Link
                href="/login"
                className="text-gray-700 font-medium hover:text-emerald-700 py-3 px-4 rounded-lg hover:bg-emerald-50 transition text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
                onClick={() => setIsMenuOpen(false)}
              >
                {tCommon("signIn")}
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-emerald-600 to-green-600 text-white text-center py-3 rounded-lg font-semibold shadow hover:shadow-lg transition text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
                onClick={() => setIsMenuOpen(false)}
              >
                {tCommon("signUp")}
              </Link>

              {/* Mobile Language Switcher inside menu */}
              <div className="pt-2">
                <Button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="flex items-center justify-between gap-3 py-3 px-4 text-gray-700 hover:text-emerald-700 w-full rounded-lg hover:bg-emerald-50 transition text-base font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5" />
                    <span>{tCommon("language")}</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${
                      isLanguageOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </Button>
                {isLanguageOpen && (
                  <div className="pl-5 mt-2 space-y-1 animate-fade-in-slide">
                    {languages.map((lang) => (
                      <Link
                        key={lang.code}
                        href="/"
                        locale={lang.code}
                        className={`block text-base py-2 px-3 rounded-lg transition-all duration-200 ${
                          currentLocale === lang.code
                            ? "text-emerald-700 font-semibold bg-emerald-50"
                            : "text-gray-700 hover:text-emerald-700 hover:bg-emerald-50"
                        } focus:outline-none focus:ring-2 focus:ring-emerald-200`}
                        onClick={() => {
                          setIsLanguageOpen(false);
                          setIsMenuOpen(false);
                        }}
                      >
                        {lang.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="pt-16">
        <section className="relative py-20 md:py-32 text-center overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 min-h-[650px] flex items-center justify-center">
          {/* Subtle Animated Background Elements */}
          <div className="absolute inset-0 z-0 opacity-80">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-300/30 rounded-full blur-3xl animate-float-slow"></div>
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-green-300/20 rounded-full blur-3xl animate-float-slow delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-emerald-200/40 rounded-full blur-2xl animate-float-slow delay-500"></div>
          </div>

          {/* Floating Icons (more subtle) */}
          <div className="absolute top-1/4 left-1/4 opacity-10 animate-bounce-slow hidden md:block">
            <LeafyGreen className="w-16 h-16 text-emerald-600" />
          </div>
          <div className="absolute bottom-1/4 right-1/4 opacity-10 animate-bounce-medium delay-1000 hidden md:block">
            <TrendingUp className="w-14 h-14 text-green-600" />
          </div>
          <div className="absolute top-1/3 right-[10%] opacity-8 animate-pulse-slow hidden lg:block">
            <Target className="w-20 h-20 text-emerald-500" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-5xl">
            {/* Main Headline */}
            <h1
              className={`text-5xl lg:text-7xl font-extrabold mb-6 leading-tight transition-all duration-1000 ${
                hasAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <span className="bg-gradient-to-r from-emerald-800 via-green-700 to-emerald-800 bg-clip-text text-transparent drop-shadow-sm">
                {t("hero.headline")}
              </span>
            </h1>

            {/* Subheadline */}
            <p
              className={`text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed transition-all duration-1000 delay-300 ${
                hasAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <span className="font-medium">
                {t("hero.subHeadline")}
              </span>
            </p>

            {/* CTA Button */}
            <div
              className={`flex justify-center transition-all duration-1000 delay-500 ${
                hasAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl px-10 py-6 text-lg transform hover:scale-105 transition-all duration-300 group relative overflow-hidden focus:outline-none focus:ring-4 focus:ring-emerald-300/50"
                >
                  <span className="relative z-10 flex items-center">
                    {t("hero.ctaPrimary")}
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-gradient-to-b from-white to-emerald-50/60 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
            {/* Section Header */}
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

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: LayoutDashboard,
                  key: "visualInsights",
                  link: "/dashboard",
                  gradient: "from-emerald-500 to-green-500",
                  bgGradient: "from-emerald-400/10 to-green-400/10",
                  accent: "emerald",
                },
                {
                  icon: LeafyGreen,
                  key: "cropPlanner",
                  link: "/crop-planner",
                  gradient: "from-green-500 to-emerald-500",
                  bgGradient: "from-green-400/10 to-emerald-400/10",
                  accent: "green",
                },
                {
                  icon: ShoppingBag,
                  key: "marketConnection",
                  link: "/market-connection",
                  gradient: "from-emerald-600 to-green-600",
                  bgGradient: "from-emerald-500/10 to-green-500/10",
                  accent: "emerald",
                },
                {
                  icon: BarChart2,
                  key: "harvestTracker",
                  link: "/harvest-tracker",
                  gradient: "from-green-600 to-emerald-600",
                  bgGradient: "from-green-500/10 to-emerald-500/10",
                  accent: "green",
                },
              ].map(
                ({ icon: Icon, key, link, gradient, bgGradient, accent }, index) => (
                  <Link
                    href={link}
                    key={key}
                    className="group relative bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col items-center border border-gray-100 hover:border-emerald-200 cursor-pointer overflow-hidden"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {/* Background gradient on hover */}
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    ></div>

                    {/* Icon Container */}
                    <div className="relative z-10 w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-all duration-500 shadow-md group-hover:shadow-lg border border-gray-100">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      ></div>
                      <Icon
                        className={`w-10 h-10 transform group-hover:rotate-3 transition-all duration-500 relative z-10 ${
                          accent === "emerald"
                            ? "text-emerald-600 group-hover:text-white"
                            : "text-green-600 group-hover:text-white"
                        }`}
                      />
                    </div>

                    {/* Feature Header */}
                    <div className="relative z-10 mb-4">
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent group-hover:from-emerald-800 group-hover:to-green-700 transition-all duration-500 mb-2">
                        {t(`features.${key}.title`)}
                      </h3>
                      <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mx-auto group-hover:w-16 transition-all duration-300"></div>
                    </div>

                    {/* Description */}
                    <p className="relative z-10 text-gray-600 text-base flex-grow leading-relaxed mb-6 font-normal group-hover:text-gray-700 transition-colors duration-300">
                      {t(`features.${key}.description`)}
                    </p>

                    {/* Hover Indicator */}
                    <div className="relative z-10 flex items-center justify-center gap-2 text-emerald-600 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <span className="text-sm font-semibold">
                        Explore Feature
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </Link>
                )
              )}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 text-center relative overflow-hidden bg-gradient-to-tr from-emerald-50 to-green-50">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #a7f3d0 1px, transparent 0)`,
                backgroundSize: "60px 60px",
              }}
            ></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-emerald-800 to-gray-900 bg-clip-text text-transparent drop-shadow-sm">
                {t("main.word")}
              </span>
            </h2>
            <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              {t("main.subword")}
            </p>
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl px-10 py-6 text-lg transform hover:scale-105 transition-all duration-300 group relative overflow-hidden focus:outline-none focus:ring-4 focus:ring-emerald-300/50"
              >
                <span className="relative z-10 flex items-center">
                  {t("hero.ctaPrimary")}
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />

      {/* Tailwind CSS Custom Animations */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-10px) translateX(10px); }
          50% { transform: translateY(0) translateX(0); }
          75% { transform: translateY(10px) translateX(-10px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes bounce-medium {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.02); }
        }
        @keyframes fade-in-scale {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
        }
        @keyframes slide-down {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-slide {
            from { opacity: 0; transform: translateX(-10px); }
            to { opacity: 1; transform: translateX(0); }
        }

        .animate-float-slow {
          animation: float-slow 18s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 6s ease-in-out infinite;
        }
        .animate-bounce-medium {
          animation: bounce-medium 4s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 7s ease-in-out infinite;
        }
        .animate-fade-in-scale {
            animation: fade-in-scale 0.2s ease-out forwards;
        }
        .animate-slide-down {
            animation: slide-down 0.3s ease-out forwards;
        }
        .animate-fade-in-slide {
            animation: fade-in-slide 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}