"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import TopBar from "@/components/motorista/TopBar";
import {
  LayoutDashboard,
  Car,
  FileText,
  Clock,
  Search,
  Menu,
  Fuel,
  DollarSign,
  Bell,
  Gift,
  Settings,
  LogOut,
  MoreVertical,
} from "lucide-react";

const menuItems = [
  { href: "/motorista", label: "Dashboard", icon: LayoutDashboard },
  { href: "/motorista/garagem", label: "Minha Garagem", icon: Car },
  { href: "/motorista/orcamentos", label: "Orçamentos", icon: FileText },
  { href: "/motorista/abastecimento", label: "Abastecimento", icon: Fuel },
  { href: "/motorista/despesas", label: "Despesas", icon: DollarSign },
  { href: "/motorista/lembretes", label: "Lembretes", icon: Bell },
  { href: "/motorista/historico", label: "Histórico", icon: Clock },
  { href: "/motorista/oficinas", label: "Buscar Oficinas", icon: Search },
  { href: "/motorista/promocoes", label: "Promoções", icon: Gift },
];

export default function MotoristaLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR PREMIUM */}
      <aside className={`
        fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-blue-50 via-white to-blue-50/50 border-r border-blue-100 z-50 flex flex-col
        transform transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo no topo */}
        <div className="p-6 border-b border-blue-100">
          <Link href="/motorista" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-lg">Instauto</span>
              <span className="ml-2 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                @ Motorista
              </span>
            </div>
          </Link>
        </div>

        {/* Menu Principal */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
            Menu
          </p>
          
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
          
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-8 mb-4 px-3">
            Outros
          </p>
          
          <Link
            href="/motorista/configuracoes"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
            onClick={() => setSidebarOpen(false)}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Configurações</span>
          </Link>
        </nav>

        {/* Usuário no rodapé */}
        <div className="p-4 border-t border-blue-100">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate text-sm">
                {profile?.name || 'Usuário'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {profile?.email || ''}
              </p>
            </div>
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar - Desktop */}
        <div className="hidden lg:block">
          <TopBar />
        </div>

        {/* Top Bar Mobile */}
        <header className="lg:hidden sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
          <Image src="/images/logo-of-dark.svg" alt="Instauto" width={100} height={28} />
          <div className="w-10" /> {/* Spacer */}
        </header>

        {/* Page Content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
