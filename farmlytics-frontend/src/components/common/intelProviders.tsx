// src/components/common/IntlProviders.tsx
"use client"; // <--- VERY IMPORTANT: This makes it a Client Component

import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { AppProviders } from '@/app/providers'; // Correct path to your AppProviders

// Define types for the props this component will receive
interface IntlProvidersProps {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, string>; // Ensure this type matches your messages structure
}

export function IntlProviders({ children, locale, messages }: IntlProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {/* AppProviders is a Client Component, so it's safe to nest here */}
      <AppProviders>
        {children}
      </AppProviders>
    </NextIntlClientProvider>
  );
}