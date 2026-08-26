"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";

/**
 * Rota "decisora" pós-login. Recebe uma navegação DURA (window.location) vinda
 * do /login. Como roda numa página recém-carregada (client limpo), não sofre o
 * deadlock do lock de auth que acontece ao consultar o Supabase logo após o
 * signInWithPassword no mesmo client.
 */
export default function EntrarPage() {
  useEffect(() => {
    const go = (path: string) => { window.location.href = path; };

    (async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return go("/login");

        const { data: profile } = await supabase
          .from("profiles")
          .select("type, role")
          .eq("id", user.id)
          .single();

        if (profile?.role === "admin") return go("/admin");

        // Aceita convites pendentes (vincula membro) e checa vínculo com oficina
        try { await supabase.rpc("accept_my_invites"); } catch {}
        const { data: membership } = await supabase
          .from("workshop_members")
          .select("workshop_id")
          .eq("profile_id", user.id)
          .limit(1)
          .maybeSingle();

        if (membership) return go("/oficina");

        // Se o perfil ainda não existe (ex.: confirmação de e-mail que não passou
        // pelo callback), decide pelo user_type do cadastro (metadata/cookie),
        // para NUNCA marcar uma oficina como motorista.
        const meta = (user.user_metadata as any) || {};
        const cookieType = typeof document !== "undefined"
          ? document.cookie.match(/instauto_user_type=([^;]+)/)?.[1]
          : null;
        const isWorkshop = profile
          ? profile.type === "workshop"
          : (meta.user_type === "workshop" || cookieType === "oficina");

        return go(isWorkshop ? "/oficina" : "/motorista");
      } catch {
        return go("/login");
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#1e3a8a] mx-auto mb-4" />
        <p className="text-gray-500">Entrando…</p>
      </div>
    </div>
  );
}
