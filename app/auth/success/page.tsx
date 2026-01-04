"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile, loading } = useAuth();
  const redirectTo = searchParams.get("redirect") || "/motorista";

  useEffect(() => {
    console.log("Auth Success Page - Loading:", loading, "User:", !!user, "Profile:", !!profile);

    if (!loading) {
      if (user && profile) {
        console.log("Redirecting to:", redirectTo);
        router.push(redirectTo);
      } else {
        // Aguardar um pouco e tentar novamente
        console.log("Waiting for auth to load...");
        setTimeout(() => {
          router.refresh();
        }, 1000);
      }
    }
  }, [user, profile, loading, redirectTo, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="text-center">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
        <p className="text-lg text-gray-700 font-medium">Finalizando login...</p>
        <p className="text-sm text-gray-500 mt-2">Aguarde um momento</p>
      </div>
    </div>
  );
}

