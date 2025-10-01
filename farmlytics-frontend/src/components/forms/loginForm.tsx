"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/schemas/loginSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Dictionary } from "@/types/Dictionary"; // Assuming your Dictionary type

interface LoginFormProps {
  dict: Dictionary['login']; // Corrected: Now it only expects the 'login' part of the Dictionary
  lang: string;
}

export function LoginForm({ dict, lang }: LoginFormProps) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema(dict)), // loginSchema also expects Dictionary['login']
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginFormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    // Here you would typically send these values to your API for authentication
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        {/* CORRECTED: Access title directly from dict */}
        <CardTitle className="text-2xl text-center">
          {dict.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  {/* CORRECTED: Access email label directly from dict */}
                  <FormLabel>{dict.email.label}</FormLabel>
                  <FormControl>
                    {/* CORRECTED: Access email placeholder directly from dict */}
                    <Input
                      placeholder={dict.email.placeholder}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  {/* CORRECTED: Access password label directly from dict */}
                  <FormLabel>{dict.password.label}</FormLabel>
                  <FormControl>
                    {/* CORRECTED: Access password placeholder directly from dict */}
                    <Input
                      type="password"
                      placeholder={dict.password.placeholder}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {/* CORRECTED: Access submit directly from dict */}
              {dict.submit}
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center text-sm">
          {/* CORRECTED: Access noAccount directly from dict */}
          {dict.noAccount}{" "}
          <Link href={`/${lang}/register`} className="underline">
            {/* CORRECTED: Access registerLink directly from dict */}
            {dict.registerLink}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}