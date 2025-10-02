import { LoginForm } from "@/components/forms/loginForm";
import { getDictionary } from "@/i18n";

interface LoginPageProps {
  params: { lang: string };
}

export default async function LoginPage({ params: { lang } }: LoginPageProps) {
  const dict = await getDictionary(lang as any); // Type assertion for simplicity, handle properly

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <LoginForm dict={dict.login} lang={lang} />
    </div>
  );
}