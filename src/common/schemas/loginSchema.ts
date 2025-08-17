import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email düzgün deyil"),
  password: z.string().min(8, "Şifrə minimum 8 simvol olmalıdır"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
