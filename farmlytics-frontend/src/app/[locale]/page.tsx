"use client";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-100 to-green-200 relative overflow-hidden">
      {/* floating circles */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-green-300 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute top-1/3 right-20 w-32 h-32 bg-green-400 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-green-300 rounded-full blur-3xl opacity-30"></div>

      {/* Navbar */}
      <header className="flex items-center justify-between px-10 py-6 relative z-10">
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <span className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white">🌱</span>
          <span>Smart Farming Platform</span>
        </div>
        <div className="flex gap-4">
          <button className="px-5 py-2 rounded-full border border-green-700 text-green-700 hover:bg-green-50">
            Sign in
          </button>
          <button className="px-5 py-2 rounded-full bg-green-600 text-white hover:bg-green-700">
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-10 lg:px-20 py-20 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto relative z-10">
        {/* Text Content */}
        <div className="max-w-xl space-y-6">
          <span className="px-4 py-1 text-sm bg-white/60 text-green-700 rounded-full border border-green-200 shadow-sm">
            Smart Farming Revolution
          </span>

          <h1 className="text-5xl font-extrabold text-green-900 leading-tight tracking-tight">
            FARM SMARTER, <br /> GROW BIGGER
          </h1>

          <p className="text-gray-600 leading-relaxed">
            This is placeholder text for the hero description. Add a sentence that
            explains how your platform helps farmers boost efficiency and crop yields.
          </p>

          <div className="flex gap-4">
            <button className="px-6 py-3 bg-green-600 text-white rounded-full font-medium shadow hover:bg-green-700 transition">
              Start Free Trial
            </button>
            <button className="px-6 py-3 border border-green-700 text-green-700 rounded-full font-medium hover:bg-green-50 transition">
              Learn More
            </button>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-700 pt-4">
            <span>🌍 Trusted by 10,000+ Farmers</span>
            <span>📈 95% Success Analytics</span>
          </div>
        </div>

        {/* Dashboard Card */}
        <div className="relative mt-12 lg:mt-0 lg:ml-12">
          <div className="w-80 rounded-2xl bg-green-900 p-6 shadow-xl text-white">
            <h3 className="font-semibold text-lg mb-6">Farmlytics Dashboard</h3>
            <div className="flex gap-3 mb-8">
              <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center">🌱</div>
              <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center">🌱</div>
              <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center">🌱</div>
            </div>
            <div>
              <p className="text-sm text-gray-300">Crop Growth Progress</p>
              <div className="w-full bg-green-700 rounded-full h-2 mt-2">
                <div className="bg-green-400 h-2 rounded-full w-[85%]"></div>
              </div>
              <p className="text-right text-sm mt-1">85%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 px-10 lg:px-20 rounded-t-3xl shadow-inner relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-green-900">
            Everything You Need for Modern Farming
          </h2>
          <p className="text-center text-gray-600 mb-14">
            Empowering farmers with tools, data, and insights for the future.
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="p-8 rounded-2xl bg-green-50 shadow hover:-rotate-1 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-5 text-2xl">
                🌿
              </div>
              <h3 className="font-semibold text-xl mb-3 text-green-900">Crop Monitoring</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Real-time insights into soil health, crop conditions, and growth.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-green-50 shadow hover:rotate-1 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-5 text-2xl">
                📊
              </div>
              <h3 className="font-semibold text-xl mb-3 text-green-900">Analytics Dashboard</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Analyze key agricultural data and trends for smarter decisions.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-green-50 shadow hover:-rotate-1 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-5 text-2xl">
                🛒
              </div>
              <h3 className="font-semibold text-xl mb-3 text-green-900">Marketplace</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Connect with other farmers and suppliers to trade goods directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-950 text-green-200 px-10 py-14 mt-12 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start text-sm">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <span className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white">🌱</span>
            <span>Smart Farming Platform</span>
          </div>
          <div className="flex gap-14">
            <div>
              <h4 className="font-semibold mb-3">Platform</h4>
              <ul className="space-y-2">
                <li>Features</li>
                <li>Pricing</li>
                <li>Resources</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2">
                <li>Documentation</li>
                <li>FAQs</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
