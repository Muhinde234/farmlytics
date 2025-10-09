import type { Metadata } from "next";
import "../globals.css";
import { Outfit } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { UserProvider } from "@/context/userContext";
import { ReactQueryProvider } from "@/context/react-query-provider";
import { Toaster } from "@/components/ui/sooner";
import React from "react";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "TegaBus | Travel with us",
  description: "Team transportation solutions",
};

// ✅ Server Component layout (no useEffect)
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // ✅ Load messages on the server
  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={outfit.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ReactQueryProvider>
            <Toaster position="top-right" richColors />
            <TooltipProvider delayDuration={0}>
              <UserProvider>{children}</UserProvider>
            </TooltipProvider>
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
