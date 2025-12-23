"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envio (implementar integração real depois)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });

      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight">
              Entre em Contato
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 font-sans leading-relaxed">
              Estamos aqui para ajudar você a transformar sua oficina
            </p>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
                Fale com a gente
              </h2>
              <p className="text-lg text-gray-600 font-sans mb-10 leading-relaxed">
                Tem alguma dúvida ou precisa de ajuda? Nossa equipe está pronta 
                para atender você. Escolha o canal que preferir!
              </p>

              <div className="space-y-6 mb-10">
                {/* Email */}
                <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-gray-900 mb-1">
                      E-mail
                    </h3>
                    <a
                      href="mailto:contato@instauto.com.br"
                      className="text-blue-600 hover:text-blue-700 font-sans transition-colors"
                    >
                      contato@instauto.com.br
                    </a>
                    <p className="text-sm text-gray-600 font-sans mt-1">
                      Respondemos em até 24 horas
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 p-6 bg-green-50 rounded-xl border border-green-100">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-gray-900 mb-1">
                      Telefone / WhatsApp
                    </h3>
                    <a
                      href="tel:+5543991852779"
                      className="text-green-600 hover:text-green-700 font-sans transition-colors"
                    >
                      +55 (43) 99185-2779
                    </a>
                    <p className="text-sm text-gray-600 font-sans mt-1">
                      Seg a Sex, 9h às 18h
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4 p-6 bg-yellow-50 rounded-xl border border-yellow-100">
                  <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-gray-900 mb-1">
                      Localização
                    </h3>
                    <p className="text-gray-700 font-sans">
                      Londrina, Paraná<br />
                      Brasil
                    </p>
                  </div>
                </div>
              </div>

              {/* Horário de Atendimento */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                  <h3 className="font-heading font-bold text-gray-900">
                    Horário de Atendimento
                  </h3>
                </div>
                <div className="space-y-2 font-sans text-gray-700">
                  <div className="flex justify-between">
                    <span>Segunda a Sexta:</span>
                    <span className="font-semibold">9h às 18h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábado:</span>
                    <span className="font-semibold">9h às 13h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingo:</span>
                    <span className="font-semibold">Fechado</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="h-7 w-7 text-blue-600" />
                  <h2 className="text-2xl font-heading font-bold text-gray-900">
                    Envie uma mensagem
                  </h2>
                </div>

                {isSuccess && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-green-800 font-sans font-semibold">
                        Mensagem enviada com sucesso!
                      </p>
                      <p className="text-green-700 font-sans text-sm mt-1">
                        Entraremos em contato em breve.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-sans font-semibold text-gray-700 mb-2">
                      Nome completo *
                    </label>
                    <Input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Seu nome"
                      className="font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-semibold text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="seu@email.com"
                      className="font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-semibold text-gray-700 mb-2">
                      Telefone
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="(00) 00000-0000"
                      className="font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-semibold text-gray-700 mb-2">
                      Assunto *
                    </label>
                    <Input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      placeholder="Como podemos ajudar?"
                      className="font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-semibold text-gray-700 mb-2">
                      Mensagem *
                    </label>
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Conte-nos mais sobre sua dúvida ou necessidade..."
                      rows={6}
                      className="font-sans resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
                  >
                    {isSubmitting ? (
                      "Enviando..."
                    ) : (
                      <>
                        Enviar Mensagem
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Rápido */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
                Perguntas Frequentes
              </h2>
              <p className="text-lg text-gray-600 font-sans">
                Talvez sua dúvida já esteja respondida aqui
              </p>
            </div>

            <div className="space-y-4">
              <details className="bg-white p-6 rounded-xl shadow-sm group">
                <summary className="font-heading font-bold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  Como funciona o teste grátis?
                  <span className="text-blue-600 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-gray-600 font-sans leading-relaxed">
                  Você se cadastra e tem 14 dias de acesso completo ao plano PRO. 
                  Não precisa cadastrar cartão de crédito.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-sm group">
                <summary className="font-heading font-bold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  Vocês oferecem treinamento?
                  <span className="text-blue-600 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-gray-600 font-sans leading-relaxed">
                  Sim! Oferecemos tutoriais em vídeo e suporte por WhatsApp para 
                  tirar todas as suas dúvidas.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-sm group">
                <summary className="font-heading font-bold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  Posso migrar meus dados de outro sistema?
                  <span className="text-blue-600 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-gray-600 font-sans leading-relaxed">
                  Sim! Nossa equipe pode ajudar você a importar seus dados. 
                  Entre em contato para mais informações.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

