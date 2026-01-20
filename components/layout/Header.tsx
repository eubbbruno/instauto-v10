"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import UserTypeModal from "@/components/auth/UserTypeModal";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"login" | "cadastro">("login");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-100"
          : "bg-white/80 backdrop-blur-md border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo-of-dark.svg"
              alt="Instauto"
              width={130}
              height={36}
              className="h-9 w-auto transition-transform hover:scale-105"
            />
          </Link>

          {/* Menu Principal - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium rounded-lg hover:bg-gray-50 transition-all"
            >
              Início
            </Link>
            <Link
              href="/buscar-oficinas"
              className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium rounded-lg hover:bg-gray-50 transition-all"
            >
              Buscar Oficinas
            </Link>
            <Link
              href="/para-oficinas"
              className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium rounded-lg hover:bg-gray-50 transition-all"
            >
              Para Oficinas
            </Link>
            <Link
              href="/planos"
              className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium rounded-lg hover:bg-gray-50 transition-all"
            >
              Planos
            </Link>
            <Link
              href="/como-funciona"
              className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium rounded-lg hover:bg-gray-50 transition-all"
            >
              Como Funciona
            </Link>
          </nav>

          {/* Ações - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => {
                setModalAction("login");
                setIsModalOpen(true);
              }}
              className="px-4 py-2 text-gray-700 font-medium hover:text-blue-600 transition-all"
            >
              Entrar
            </button>
            <button
              onClick={() => {
                setModalAction("cadastro");
                setIsModalOpen(true);
              }}
              className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold rounded-xl transition-all"
            >
              Cadastrar Grátis
            </button>
          </div>

          {/* Menu Mobile */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-gray-100 max-h-[calc(100vh-80px)] overflow-y-auto">
            <div className="px-4 py-6 space-y-1">
              <Link
                href="/"
                className="block text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium py-3 px-4 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Início
              </Link>
              <Link
                href="/buscar-oficinas"
                className="block text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium py-3 px-4 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Buscar Oficinas
              </Link>
              <Link
                href="/para-oficinas"
                className="block text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium py-3 px-4 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Para Oficinas
              </Link>
              <Link
                href="/planos"
                className="block text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium py-3 px-4 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Planos
              </Link>
              <Link
                href="/como-funciona"
                className="block text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium py-3 px-4 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Como Funciona
              </Link>
              
              <div className="border-t border-gray-200 my-3"></div>
              
              <button
                onClick={() => {
                  setModalAction("login");
                  setIsModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-center text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Entrar
              </button>
              <button
                onClick={() => {
                  setModalAction("cadastro");
                  setIsModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold py-3 px-4 rounded-xl transition-all"
              >
                Cadastrar Grátis
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Seleção */}
      <UserTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        action={modalAction}
      />
    </header>
  );
}

