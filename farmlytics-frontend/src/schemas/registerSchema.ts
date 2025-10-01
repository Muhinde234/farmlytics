import { Dictionary } from "@/types/Dictionary";
import { z } from "zod";

export const registerSchema = (dict: Dictionary['register']) =>
  z
    .object({
      firstName: z.string().min(1, { message: dict.firstName.invalid }),
      lastName: z.string().min(1, { message: dict.lastName.invalid }),
      district: z.string().min(1, { message: dict.district.invalid }),
      email: z.string().email({ message: dict.email.invalid }),
      password: z.string().min(6, { message: dict.password.invalid }),
      confirmPassword: z.string().min(6, { message: dict.confirmPassword.invalid }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: dict.confirmPassword.match,
      path: ["confirmPassword"],
    });

export type RegisterFormValues = z.infer<ReturnType<typeof registerSchema>>;