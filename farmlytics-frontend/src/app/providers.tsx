// app/providers.tsx
"use client"; // This directive is CRUCIAL: it marks this file as a Client Component

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from "@/context/userContext"; // Make sure this path is correct for your UserProvider

// Create a QueryClient instance outside of the component to avoid re-creating it on every render.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Example: Data is considered fresh for 5 minutes
      refetchOnWindowFocus: false, // Example: Don't refetch queries automatically when window regains focus
    },
  },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* You can add other Client Providers here as well, e.g., ThemeProvider, AuthProvider */}
      <UserProvider>
        {children}
      </UserProvider>
    </QueryClientProvider>
  );
}