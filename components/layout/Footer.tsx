"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Image
              src="/images/logo.svg"
              alt="Instauto"
              width={150}
              height={40}
              className="h-10 w-auto mb-6"
            />
            <p className="text-gray-400 font-sans leading-relaxed mb-6 max-w-md">
              Sistema completo de gestão para oficinas mecânicas. Transforme seu
              negócio com tecnologia de ponta.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-all hover:scale-110"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-all hover:scale-110"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-all hover:scale-110"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-all hover:scale-110"
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
            <ul className="space-y-3 font-sans">
              <li>
                <Link
                  href="/oficinas"
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Para Oficinas
                </Link>
              </li>
              <li>
                <Link
                  href="/planos"
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Planos e Preços
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Funcionalidades
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Integrações
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-white font-heading font-bold text-lg mb-6">
              Empresa
            </h4>
            <ul className="space-y-3 font-sans">
              <li>
                <Link
                  href="#"
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Carreiras
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-white font-heading font-bold text-lg mb-6">
              Contato
            </h4>
            <ul className="space-y-4 font-sans">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:contato@instauto.com.br"
                  className="hover:text-white transition-colors"
                >
                  contato@instauto.com.br
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <a
                  href="tel:+5511999999999"
                  className="hover:text-white transition-colors"
                >
                  (11) 99999-9999
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm">
                  São Paulo, SP<br />Brasil
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm font-sans text-gray-400">
              © {currentYear} Instauto. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm font-sans">
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Termos de Uso
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacidade
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

