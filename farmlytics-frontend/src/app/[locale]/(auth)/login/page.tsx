import { LoginForm } from "@/components/forms/loginForm";
import { getDictionary } from "@/i18n";

type SupportedLocale = "en" | "fr" | "rw";

interface LoginPageProps {
  params?: { locale?: SupportedLocale };
}

export default async function LoginPage({ params }: LoginPageProps) {
  const locale = params?.locale ?? "en";
  const dict = await getDictionary(locale);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <LoginForm dict={dict.login} lang={locale} />
    </div>
  );
}