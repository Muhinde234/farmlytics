// app/[locale]/layout.tsx
import type { Metadata } from "next";
import "../globals.css";
import { Outfit } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { UserProvider } from "@/context/userContext";
import { ReactQueryProvider } from "@/context/react-query-provider";
import { Toaster } from "@/components/ui/sooner";
import { NextIntlClientProvider } from 'next-intl';

const outfit = Outfit({
    subsets: ["latin"],
    weight: ["400", "500"],
    display: "swap",
    variable: "--font-outfit",
});

export const metadata: Metadata = {
    title: "Farmlytics|| Digitalized farm",
    description: "Team data scientists ",
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    const { locale } = params;

    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    let messages;
    try {
        messages = (await import(`@/messages/${locale}.json`)).default;
    } catch {
        notFound();
    }

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={`${outfit.className} `}>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <ReactQueryProvider>
                        <Toaster position="top-right" richColors />
                        <TooltipProvider delayDuration={0}>
                            <UserProvider>
                                {children}
                            </UserProvider>
                        </TooltipProvider>
                    </ReactQueryProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}