"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Car,
  FileText,
  Clock,
  Search,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Fuel,
  DollarSign,
  Bell,
  MessageCircle,
  Users as UsersIcon,
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
];

export default function MotoristaLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-emerald-600 to-emerald-700 z-50
        transform transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-emerald-500/30">
          <Link href="/motorista" className="flex items-center gap-3">
            <Image src="/images/logo.svg" alt="Instauto" width={120} height={32} />
          </Link>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-emerald-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">{profile?.name || "Motorista"}</p>
              <p className="text-emerald-200 text-xs">Conta Gratuita</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm
                  ${isActive 
                    ? 'bg-white text-emerald-700 font-semibold shadow-lg' 
                    : 'text-emerald-100 hover:bg-emerald-500/50'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-emerald-500/30">
          <button
            onClick={signOut}
            className="flex items-center gap-3 w-full px-4 py-3 text-emerald-100 hover:bg-emerald-500/50 rounded-xl transition-all text-sm"
          >
            <LogOut className="w-5 h-5" />
            Sair da conta
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
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
