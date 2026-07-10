"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

interface Profile {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  avatar_url: string | null;
  type: string;
  role: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  // Guarda o id do usuário atual para evitar recarregar o profile em cada
  // refresh de token / refoco de aba (que dispararia setUser desnecessário).
  const currentUserId = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async (userId: string) => {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
        if (mounted && data) setProfile(data);
      } catch (e) {
        console.error("❌ [Auth] Erro ao carregar profile:", e);
      }
    };

    // 1) Sessão inicial (seguro chamar supabase aqui — fora do onAuthStateChange)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      currentUserId.current = session?.user?.id ?? null;

      if (session?.user) {
        loadProfile(session.user.id).finally(() => {
          if (mounted) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    // 2) Listener de mudanças de auth.
    // IMPORTANTE: nunca fazer `await supabase.*` DENTRO deste callback — o Supabase
    // segura um lock interno aqui e a query trava (deadlock), deixando o app preso
    // no "carregando" ao voltar de segundo plano. Por isso deferimos com setTimeout(0)
    // e só recarregamos o profile quando o usuário realmente muda.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!mounted) return;

      if (event === "SIGNED_OUT") {
        setSession(null);
        setUser(null);
        setProfile(null);
        currentUserId.current = null;
        router.push("/login");
        return;
      }

      // Atualiza a sessão (tokens novos) sempre.
      setSession(newSession);

      const newUserId = newSession?.user?.id ?? null;

      // Só mexe em user/profile quando o USUÁRIO muda de fato.
      // Em TOKEN_REFRESHED / refoco de aba o id é o mesmo → não faz nada pesado.
      if (newUserId !== currentUserId.current) {
        currentUserId.current = newUserId;
        setUser(newSession?.user ?? null);
        if (newUserId) {
          setTimeout(() => {
            if (mounted) loadProfile(newUserId);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
