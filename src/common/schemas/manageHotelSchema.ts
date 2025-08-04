import { z } from "zod";

export const manageHotelSchema = z.object({
  name: z
    .string({
      error: "Otel adı tələb olunur",
    })
    .nonempty("Otel adı boş olmamalıdır"),

  legalName: z.string().nonempty("Hüquqi ad boş olmamalıdır"),

  country: z
    .string({
      error: "Ölkə tələb olunur",
    })
    .nonempty("Ölkə tələb olunur"),

  city: z
    .string({
      error: "Şəhər tələb olunur",
    })
    .nonempty("Şəhər tələb olunur"),

  address: z.string().nonempty("Ünvan boş olmamalıdır"),

  phone: z
    .string()
    .nonempty("Telefon nömrəsi tələb olunur")
    .regex(/\d{9}$/, 'Telefon nömrəsi "+994xxxxxxxxx" formatında olmalıdır')
    .max(9, "Telefon nömrəsi 9 rəqəmdən ibarət olmalıdır")
    .min(9, "Telefon nömrəsi 9 rəqəmdən az olmamalıdır")
    .refine(
      (val) =>
        val.startsWith("50") ||
        val.startsWith("51") ||
        val.startsWith("55") ||
        val.startsWith("70") ||
        val.startsWith("77") ||
        val.startsWith("99"),
      {
        message: "Telefon nömrəsi 50, 51, 55, 70, 77 və ya 99 ilə başlamalıdır",
      }
    )
    .transform((val) => `+994${val}`),

  email: z
    .string()
    .email("E-mail düzgün deyil")
    .nonempty("E-mail tələb olunur"),
});
