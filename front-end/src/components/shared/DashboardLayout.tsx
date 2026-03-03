import { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-slate-50">
      {/* Sidebar Lateral */}
      <aside className="w-64 border-r bg-white p-6 flex flex-col gap-8">
        <h1 className="text-xl font-bold text-orange-600">Teddy Admin</h1>
        
        <nav className="flex flex-col gap-2">
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-orange-50 text-orange-700 font-medium">
            📂 Clientes
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
            📈 Relatórios
          </a>
        </nav>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header Superior */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-8">
          <div className="text-sm text-slate-500">Bem-vindo, Wesley!</div>
          <Avatar>
            <AvatarImage src="https://github.com/wesley.png" />
            <AvatarFallback>W</AvatarFallback>
          </Avatar>
        </header>

        {/* Conteúdo Dinâmico */}
        <section className="flex-1 overflow-y-auto p-8">
          {children}
        </section>
      </main>
    </div>
  );
}