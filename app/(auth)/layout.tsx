import { Car } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Car className="h-10 w-10 text-blue-600" />
            <span className="text-3xl font-bold text-gray-900">Instauto</span>
          </Link>
          <p className="text-gray-600">Sistema de Gestão para Oficinas</p>
        </div>
        {children}
      </div>
    </div>
  );
}

