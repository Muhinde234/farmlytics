import { RegisterForm } from "@/components/forms/registerForm";
import { getDictionary } from "@/i18n";

interface RegisterPageProps {
  params: { lang: string };
}

export default async function RegisterPage({
  params: { lang },
}: RegisterPageProps) {
  const dict = await getDictionary(lang as any); // Type assertion for simplicity, handle properly

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <RegisterForm dict={dict.register} lang={lang} />
    </div>
  );
}