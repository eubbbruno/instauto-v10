"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Car, ChevronRight } from "lucide-react";

export function PublicHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600 rounded-xl blur-sm opacity-50"></div>
            <div className="relative p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl">
              <Car className="h-6 w-6 text-white" />
            </div>
          </div>
          <span className="text-2xl font-heading font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Instauto
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="font-medium">
              Entrar
            </Button>
          </Link>
          <Link href="/cadastro">
            <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold shadow-lg shadow-yellow-500/30">
              Começar Grátis
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}


