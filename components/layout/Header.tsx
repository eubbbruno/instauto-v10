"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Phone } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          ? "bg-blue-900 shadow-lg"
          : "bg-blue-900/95 backdrop-blur-sm"
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10 flex items-center gap-3">
            <Image
              src="/images/logo.svg"
              alt="Instauto"
              width={160}
              height={45}
              className="h-11 w-auto transition-transform hover:scale-105"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/oficinas"
              className="text-white hover:text-yellow-400 font-sans font-semibold transition-colors relative group text-[15px]"
            >
              Para Oficinas
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/motoristas"
              className="text-white hover:text-yellow-400 font-sans font-semibold transition-colors relative group text-[15px]"
            >
              Para Motoristas
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/planos"
              className="text-white hover:text-yellow-400 font-sans font-semibold transition-colors relative group text-[15px]"
            >
              Planos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/sobre"
              className="text-white hover:text-yellow-400 font-sans font-semibold transition-colors relative group text-[15px]"
            >
              Sobre
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/contato"
              className="text-white hover:text-yellow-400 font-sans font-semibold transition-colors relative group text-[15px]"
            >
              Contato
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
            </Link>
            
            <div className="h-6 w-px bg-white/30"></div>
            
            <a 
              href="tel:+5543991852779" 
              className="flex items-center gap-2 text-white hover:text-yellow-400 font-sans font-semibold transition-colors text-[15px]"
            >
              <Phone className="h-4 w-4" />
              (43) 99185-2779
            </a>
            
            <Link
              href="/login"
              className="text-white hover:text-yellow-400 font-sans font-semibold transition-colors text-[15px]"
            >
              Entrar
            </Link>
            <Link href="/cadastro">
              <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-sans font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 text-[15px] px-6">
                Começar Grátis
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-white hover:text-yellow-400 transition-colors"
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
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-gray-100 max-h-[calc(100vh-80px)] overflow-y-auto">
            <div className="px-4 py-6 space-y-1">
              <Link
                href="/oficinas"
                className="block text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-sans font-semibold py-3 px-4 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Para Oficinas
              </Link>
              <Link
                href="/motoristas"
                className="block text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-sans font-semibold py-3 px-4 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Para Motoristas
              </Link>
              <Link
                href="/planos"
                className="block text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-sans font-semibold py-3 px-4 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Planos
              </Link>
              <Link
                href="/sobre"
                className="block text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-sans font-semibold py-3 px-4 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sobre
              </Link>
              <Link
                href="/contato"
                className="block text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-sans font-semibold py-3 px-4 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contato
              </Link>
              
              <div className="border-t border-gray-200 my-3"></div>
              
              <a 
                href="tel:+5543991852779" 
                className="flex items-center gap-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-sans font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                <Phone className="h-4 w-4" />
                (43) 99185-2779
              </a>
              
              <div className="border-t border-gray-200 my-3"></div>
              
              <Link
                href="/login"
                className="block text-center text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-sans font-semibold py-3 px-4 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Entrar
              </Link>
              <Link href="/cadastro" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-sans font-bold shadow-lg py-6 text-base">
                  Começar Grátis
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

