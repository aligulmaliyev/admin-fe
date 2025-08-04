import { Statuses } from "@/constants/statuses";
import { z } from "zod";

export const manageUserSchema = z.object({
  username: z
    .string({ error: "İstifadəçi adı tələb olunur" })
    .min(3, "İstifadəçi adı minimum 3 simvol olmalıdır"),

  password: z
    .string({ error: "Şifrə tələb olunur" })
    .min(6, "Şifrə minimum 6 simvol olmalıdır"),

  name: z.string().min(3, "Ad soyad minimum 3 simvol olmalıdır"),

  hotelId: z
    .number({ error: "Otel seçilməlidir" })
    .transform(Number),

  accountStatus: z
    .literal(Statuses.ACTIVE)
    .or(z.literal(Statuses.INACTIVE))
    .optional()
});

export type IUserRequest = z.infer<typeof manageUserSchema>;
