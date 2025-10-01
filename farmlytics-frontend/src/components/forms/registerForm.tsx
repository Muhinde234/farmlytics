"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormValues } from "@/schemas/registerSchema";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Dictionary } from "@/types/Dictionary";

interface RegisterFormProps {
  dict: Dictionary["register"]; 
  lang: string;
}

export function RegisterForm({ dict, lang }: RegisterFormProps) {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema(dict)),
    defaultValues: {
      firstName: "",
      lastName: "",
      district: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: RegisterFormValues) {
    // Handle registration logic here (e.g., send to API)
    console.log(values);
  }

  const districtOptions = [
    { value: "gasabo", label: dict.district.options.gasabo },
    { value: "kicukiro", label: dict.district.options.kicukiro },
    { value: "nyarugenge", label: dict.district.options.nyarugenge },
    // Add more districts as needed
  ];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {dict.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dict.firstName.label}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={dict.firstName.placeholder}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dict.lastName.label}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={dict.lastName.placeholder}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dict.district.label}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={dict.district.placeholder}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {districtOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dict.email.label}</FormLabel>
                  <FormControl>
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
                  <FormLabel>{dict.password.label}</FormLabel>
                  <FormControl>
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dict.confirmPassword.label}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={dict.confirmPassword.placeholder}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {dict.submit}
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center text-sm">
          {dict.haveAccount}{" "}
          <Link href={`/${lang}/login`} className="underline">
            {dict.loginLink}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}