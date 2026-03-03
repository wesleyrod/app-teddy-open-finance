import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
      {/* Container Principal com Sombra Suave */}
      <Card className="w-full max-w-md border-none shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
             {/* Espaço para o Logo da Teddy */}
             <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xl">
               T
             </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Acesse sua conta
          </CardTitle>
          <CardDescription>
            Entre com seu e-mail e senha para gerenciar os clientes.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Campo de E-mail */}
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="wesley@teddy.com" 
              className="focus-visible:ring-orange-500"
            />
          </div>

          {/* Campo de Senha */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <a href="#" className="text-xs text-orange-600 hover:underline">
                Esqueceu a senha?
              </a>
            </div>
            <Input 
              id="password" 
              type="password" 
              className="focus-visible:ring-orange-500"
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          {/* Botão de Ação Principal */}
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold h-11 transition-colors">
            Entrar no Sistema
          </Button>
          
          <p className="text-center text-sm text-slate-500">
            Ainda não tem acesso?{" "}
            <a href="#" className="font-medium text-orange-600 hover:underline">
              Solicite ao administrador
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}