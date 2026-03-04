import { Link } from "react-router-dom";
import { Home, Users, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const TEDDY_LOGO = "https://lp.teddydigital.io/wp-content/uploads/2024/02/logo-preto-2048x992-1.webp";

interface SidebarProps {
  isOpen: boolean;
  currentPath: string;
}

export function Sidebar({ isOpen, currentPath }: SidebarProps) {
  const isActive = (path: string) => currentPath === path;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-50 flex flex-col overflow-hidden",
        isOpen ? "w-64" : "w-0"
      )}
    >
      {/* Header da Sidebar */}
      <div className="bg-[#363737] h-32 flex justify-center items-center min-w-[256px] shrink-0">
        <img src={TEDDY_LOGO} alt="Teddy" className="h-16" />
      </div>

      {/* Itens de Navegação */}
      <nav className="flex-1 p-4 space-y-2 min-w-[256px]">
        <SidebarLink to="/" icon={<Home size={20} />} label="Home" active={isActive("/")} />
        <SidebarLink to="/" icon={<Users size={20} />} label="Clientes" active={isActive("/")} />
        <SidebarLink to="/selected" icon={<UserCheck size={20} />} label="Clientes selecionados" active={isActive("/selected")} />
      </nav>
    </aside>
  );
}

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function SidebarLink({ to, icon, label, active = false }: SidebarLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-4 px-4 py-3 rounded-md text-sm font-medium transition-colors",
        active
          ? "text-orange-600"
          : "text-gray-900 hover:bg-gray-50"
      )}
    >
      <span className={active ? "text-orange-600" : "text-gray-400"}>{icon}</span>
      {label}
    </Link>
  );
}
