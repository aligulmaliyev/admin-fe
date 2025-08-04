import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, "İstifadəçi adı minimum 3 simvol olmalıdır"),
  password: z.string().min(5, "Şifrə minimum 5 simvol olmalıdır"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
