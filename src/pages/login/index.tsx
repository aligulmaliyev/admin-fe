import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginFormData,
} from "@/common/schemas/loginSchema";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const onLogin = useCallback(
    async (data: LoginFormData) => {
      const email = data.email.trim();
      const password = data.password;

      try {
        const success = await login(email, password);
        if (success) {
          toast.success("Uğurla daxil oldunuz!");
          navigate("/");
        } else {
          toast.error("Email və ya şifrə yanlışdır!");
          setError("password", { type: "manual", message: "Yanlış məlumat" });
        }
      } catch (e) {
        console.error(e);
        toast.error("Giriş zamanı xəta baş verdi!");
      }
    },
    [login, navigate, setError]
  );

  const disabled = isLoading || isSubmitting;

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="mb-5 flex justify-center mt-3">
          <img src="/qr_inn_logo.png" width={70} alt="QR Inn loqo" />
        </div>
        <CardTitle className="text-2xl">Daxil ol</CardTitle>
        <CardDescription>
          QR Inn idarəetmə panelinə xoş gəlmisiniz
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onLogin)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email daxil edin"
              autoComplete="email"
              {...register("email")}
              disabled={disabled}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Şifrə</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Şifrənizi daxil edin"
                autoComplete="current-password"
                {...register("password")}
                disabled={disabled}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? "Şifrəni gizlət" : "Şifrəni göstər"}
                aria-pressed={showPassword}
                disabled={disabled}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={disabled}>
            {disabled ? "Daxil olunur..." : "Daxil ol"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
