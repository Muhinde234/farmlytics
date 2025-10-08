import { defineRouting } from "next-intl/routing"
import { createNavigation } from "next-intl/navigation"

export const routing = defineRouting({
  locales: ["en", "rw", "fr"] as const,
  defaultLocale: "en",
})

// Create locale-aware navigation utilities
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
