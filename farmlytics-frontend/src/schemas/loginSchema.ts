import { Dictionary } from "@/types/Dictionary";
import { z } from "zod";


export const loginSchema = (dict: Dictionary['login']) =>
  z.object({
    email: z.string().email({ message: dict.email.invalid }),
    password: z.string().min(1, { message: dict.password.invalid }),
  });

export type LoginFormValues = z.infer<ReturnType<typeof loginSchema>>;