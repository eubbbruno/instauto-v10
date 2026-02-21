"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Image
              src="/images/logo.svg"
              alt="Instauto"
              width={160}
              height={45}
              className="h-11 w-auto mb-6"
            />
            <p className="text-gray-400 font-sans leading-relaxed mb-6 max-w-md text-[15px]">
              Sistema completo de gestão para oficinas mecânicas. Transforme seu
              negócio com tecnologia de ponta e aumente seu faturamento.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com/instauto"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-yellow-400 hover:text-gray-900 flex items-center justify-center transition-all hover:scale-110"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/instauto"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-yellow-400 hover:text-gray-900 flex items-center justify-center transition-all hover:scale-110"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/company/instauto"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-yellow-400 hover:text-gray-900 flex items-center justify-center transition-all hover:scale-110"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/instauto"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-yellow-400 hover:text-gray-900 flex items-center justify-center transition-all hover:scale-110"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="text-white font-heading font-bold text-lg mb-6">
              Produto
            </h4>
            <ul className="space-y-3 font-sans text-[15px]">
              <li>
                <Link
                  href="/buscar-oficinas"
                  className="hover:text-yellow-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Buscar Oficinas
                </Link>
              </li>
              <li>
                <Link
                  href="/para-oficinas"
                  className="hover:text-yellow-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Para Oficinas
                </Link>
              </li>
              <li>
                <Link
                  href="/planos"
                  className="hover:text-yellow-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Planos e Preços
                </Link>
              </li>
              <li>
                <Link
                  href="/como-funciona"
                  className="hover:text-yellow-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Como Funciona
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-white font-heading font-bold text-lg mb-6">
              Empresa
            </h4>
            <ul className="space-y-3 font-sans text-[15px]">
              <li>
                <Link
                  href="/sobre"
                  className="hover:text-yellow-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="hover:text-yellow-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-white font-heading font-bold text-lg mb-6">
              Legal
            </h4>
            <ul className="space-y-3 font-sans text-[15px]">
              <li>
                <Link
                  href="/termos-uso"
                  className="hover:text-yellow-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-privacidade"
                  className="hover:text-yellow-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Acesso Column */}
          <div>
            <h4 className="text-white font-heading font-bold text-lg mb-6">
              Acesso
            </h4>
            <ul className="space-y-3 font-sans text-[15px]">
              <li>
                <Link
                  href="/login"
                  className="hover:text-yellow-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Cadastrar Oficina
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-yellow-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Cadastrar Motorista
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-yellow-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Login Oficina
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-yellow-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Login Motorista
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm font-sans text-gray-400">
              © {currentYear} Instauto. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm font-sans">
              <Link
                href="/termos-uso"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                Termos de Uso
              </Link>
              <Link
                href="/politica-privacidade"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                Privacidade
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

