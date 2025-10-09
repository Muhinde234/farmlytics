import type { Metadata } from "next";
import "../globals.css";
import { Outfit } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { hasLocale, NextIntlClientProvider } from "next-intl";
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

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const [messages, setMessages] = React.useState<Record<string, string> | null>(
    null
  );

  React.useEffect(() => {
    import(`@/messages/${locale}.json`)
      .then((mod) => setMessages(mod.default))
      .catch(() => notFound());
  }, [locale]);

  if (!messages) return null;

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
