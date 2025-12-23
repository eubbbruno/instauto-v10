"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

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
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <Image
              src="/images/logo-of-dark.svg"
              alt="Instauto"
              width={150}
              height={40}
              className="h-10 w-auto transition-transform hover:scale-105"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/oficinas"
              className="text-gray-700 hover:text-blue-600 font-sans font-medium transition-colors relative group"
            >
              Para Oficinas
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/planos"
              className="text-gray-700 hover:text-blue-600 font-sans font-medium transition-colors relative group"
            >
              Planos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/login"
              className="text-gray-700 hover:text-blue-600 font-sans font-medium transition-colors"
            >
              Entrar
            </Link>
            <Link href="/cadastro">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-sans font-semibold shadow-lg hover:shadow-xl transition-all">
                Começar Grátis
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
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
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 animate-in slide-in-from-top">
            <div className="container mx-auto px-4 py-6 space-y-4">
              <Link
                href="/oficinas"
                className="block text-gray-700 hover:text-blue-600 font-sans font-medium py-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Para Oficinas
              </Link>
              <Link
                href="/planos"
                className="block text-gray-700 hover:text-blue-600 font-sans font-medium py-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Planos
              </Link>
              <Link
                href="/login"
                className="block text-gray-700 hover:text-blue-600 font-sans font-medium py-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Entrar
              </Link>
              <Link href="/cadastro" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-sans font-semibold">
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

