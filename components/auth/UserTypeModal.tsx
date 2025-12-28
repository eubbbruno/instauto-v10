"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Car, Wrench } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface UserTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: "login" | "cadastro";
}

export default function UserTypeModal({
  isOpen,
  onClose,
  action,
}: UserTypeModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Bloquear scroll quando modal abrir
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const title = action === "login" ? "Como você quer entrar?" : "Como você quer se cadastrar?";
  const subtitle = action === "login" ? "Escolha o tipo de conta" : "Escolha o tipo de conta para criar";

  const modalContent = (
    <div 
      className="fixed z-[100] bg-black/60 backdrop-blur-sm"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflow: 'auto'
      }}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8" style={{ margin: 'auto' }}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-2">
            {title}
          </h2>
          <p className="text-gray-600 font-sans">{subtitle}</p>
        </div>

        {/* Options */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Motorista */}
          <Link
            href={action === "login" ? "/login-motorista" : "/cadastro-motorista"}
            onClick={onClose}
          >
            <div className="group bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border-2 border-blue-200 hover:border-blue-400 transition-all cursor-pointer hover:shadow-xl">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform mx-auto">
                <Car className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-3 text-center">
                Sou Motorista
              </h3>
              <p className="text-gray-700 font-sans text-center mb-4 text-sm">
                Buscar oficinas, solicitar orçamentos e gerenciar meus veículos
              </p>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-sans font-bold text-center">
                100% Grátis
              </div>
            </div>
          </Link>

          {/* Oficina */}
          <Link
            href={action === "login" ? "/login-oficina" : "/cadastro"}
            onClick={onClose}
          >
            <div className="group bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-2xl border-2 border-yellow-200 hover:border-yellow-400 transition-all cursor-pointer hover:shadow-xl">
              <div className="w-16 h-16 bg-yellow-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform mx-auto">
                <Wrench className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-3 text-center">
                Sou Oficina
              </h3>
              <p className="text-gray-700 font-sans text-center mb-4 text-sm">
                Sistema completo de gestão para minha oficina mecânica
              </p>
              <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-sans font-bold text-center">
                14 dias grátis
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

