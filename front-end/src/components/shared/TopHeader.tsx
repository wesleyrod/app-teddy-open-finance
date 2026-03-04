import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const TEDDY_LOGO = "https://lp.teddydigital.io/wp-content/uploads/2024/02/logo-preto-2048x992-1.webp";

interface TopHeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  currentPath: string;
}

export function TopHeader({ isSidebarOpen, onToggleSidebar, currentPath }: TopHeaderProps) {
  const { user, logout } = useAuth();
  const isActive = (path: string) => currentPath === path;

  return (
    <header className="h-32 border-b border-gray-200 bg-white flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-6">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <Menu className="h-6 w-6 text-gray-500" />
        </button>

        {/* Logo no header - aparece SOMENTE quando sidebar está FECHADA */}
        {!isSidebarOpen && (
          <img src={TEDDY_LOGO} alt="Teddy" className="h-16 hidden md:block" />
        )}
      </div>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
        <Link
          to="/"
          className={cn(
            "pb-1 transition-colors",
            isActive("/")
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          Clientes
        </Link>
        <Link
          to="/selected"
          className={cn(
            "pb-1 transition-colors",
            isActive("/selected")
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          Clientes selecionados
        </Link>
        <button onClick={logout} className="text-gray-600 hover:text-gray-900">Sair</button>
      </nav>

      <div className="text-sm font-medium">
        <span className="text-gray-500">Olá, </span>
        <span className="text-gray-900 font-bold">{user?.name || "Usuário"}!</span>
      </div>
    </header>
  );
}
