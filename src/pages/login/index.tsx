import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Hotel } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/common/schemas/loginSchema";

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const onLogin = async (data: LoginFormData) => {
    const { username, password } = data;
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        toast.success("Uğurla daxil oldunuz!");
        navigate("/");
      } else {
        toast.error("Email və ya şifrə yanlışdır!");
      }
    } catch {
      toast.error("Giriş zamanı xəta baş verdi!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Hotel className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-2xl">Daxil ol</CardTitle>
        <CardDescription>
          Otel idarəetmə panelinə daxil olmaq üçün məlumatlarınızı daxil edin
          hello
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">İstifadəçi adı</Label>
            <Input  {...register("username")} type="text"   placeholder="İstifadəçi adınızı daxil edin"/>
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Şifrə</Label>
            <div className="relative">
              <Input
                id="password"
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Şifrənizi daxil edin"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Daxil olunur..." : "Daxil ol"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
