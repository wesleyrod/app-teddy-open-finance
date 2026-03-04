import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/features/auth/contexts/AuthContext";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "O e-mail é obrigatório.")
    .email("Formato de e-mail inválido."),
  password: z
    .string()
    .min(1, "A senha é obrigatória.")
    .min(6, "A senha deve ter ao menos 6 caracteres."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    setServerError("");
    setLoading(true);
    try {
      await login(data.email, data.password);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md border-none shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <img
                src="https://lp.teddydigital.io/wp-content/uploads/2024/02/logo-preto-2048x992-1.webp"
                alt="Teddy Open Finance"
                className="h-14"
              />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
              Acesse sua conta
            </CardTitle>
            <CardDescription>
              Entre com seu e-mail e senha para gerenciar os clientes.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {serverError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seuemail@email.com"
                className={`focus-visible:ring-orange-500 ${errors.email ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                className={`focus-visible:ring-orange-500 ${errors.password ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold h-11 transition-colors disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar no Sistema"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}