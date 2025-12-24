"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-gray-300">
      {/* CTA Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-4xl font-heading font-bold text-white mb-4">
              Pronto para transformar sua oficina?
            </h3>
            <p className="text-blue-100 font-sans text-lg mb-8 max-w-2xl mx-auto">
              Comece seu teste grátis de 14 dias agora. Sem cartão de crédito.
            </p>
            <Link href="/cadastro">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-sans font-bold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 inline-flex items-center gap-2 text-lg">
                Começar Teste Grátis
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
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
                  href="/oficinas"
                  className="hover:text-yellow-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Para Oficinas
                </Link>
              </li>
              <li>
                <Link
                  href="/motoristas"
                  className="hover:text-yellow-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Para Motoristas
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
                  href="/oficinas#funcionalidades"
                  className="hover:text-yellow-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Funcionalidades
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
              <li>
                <Link
                  href="/cadastro"
                  className="hover:text-yellow-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Criar Conta
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-yellow-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Acessar Sistema
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-white font-heading font-bold text-lg mb-6">
              Contato
            </h4>
            <ul className="space-y-4 font-sans text-[15px]">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:contato@instauto.com.br"
                  className="hover:text-yellow-400 transition-colors"
                >
                  contato@instauto.com.br
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <a
                  href="tel:+5543991852779"
                  className="hover:text-yellow-400 transition-colors"
                >
                  +55 (43) 99185-2779
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm leading-relaxed">
                  Londrina, PR<br />Brasil
                </span>
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
                href="/termos"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                Termos de Uso
              </Link>
              <Link
                href="/privacidade"
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

