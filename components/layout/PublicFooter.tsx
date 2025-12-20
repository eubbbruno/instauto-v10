import Link from "next/link";
import { Car } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Car className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-heading font-bold">Instauto</span>
          </div>

          <div className="flex gap-8 text-sm text-gray-400">
            <Link href="#" className="hover:text-white transition-colors">
              Termos de Uso
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Privacidade
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Suporte
            </Link>
          </div>

          <div className="text-sm text-gray-400">
            © 2024 Instauto. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}

