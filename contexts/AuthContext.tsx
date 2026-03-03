"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
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

  useEffect(() => {
    console.log("🔐 [Auth] Inicializando...");
    let initialized = false;
    let refreshTimer: NodeJS.Timeout;

    // Pegar sessão inicial
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("🔐 [Auth] getSession result:", session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      // Carregar profile se tiver user
      if (session?.user) {
        console.log("🔐 [Auth] Carregando profile...");
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        console.log("🔐 [Auth] Profile result:", data?.type);
        if (data) {
          setProfile(data);
        }

        // Configurar renovação automática a cada 50 minutos (token expira em 60min)
        refreshTimer = setInterval(async () => {
          console.log("🔄 [Auth] Renovando token proativamente...");
          const { data: { session: newSession }, error } = await supabase.auth.refreshSession();
          if (error) {
            console.error("❌ [Auth] Erro ao renovar token:", error);
          } else {
            console.log("✅ [Auth] Token renovado com sucesso");
            setSession(newSession);
            setUser(newSession?.user ?? null);
          }
        }, 50 * 60 * 1000); // 50 minutos
      }
      
      console.log("✅ [Auth] Setando loading = false (getSession)");
      initialized = true;
      setLoading(false);
    });

    // Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔄 [Auth] onAuthStateChange:", event, session?.user?.email);
      
      // Tratar eventos específicos
      if (event === 'TOKEN_REFRESHED') {
        console.log("🔄 [Auth] Token renovado automaticamente");
        setSession(session);
        setUser(session?.user ?? null);
        return;
      }
      
      if (event === 'SIGNED_OUT') {
        console.log("🔓 [Auth] Usuário deslogado");
        setSession(null);
        setUser(null);
        setProfile(null);
        router.push("/login");
        return;
      }

      if (event === 'USER_UPDATED') {
        console.log("👤 [Auth] Usuário atualizado");
        setSession(session);
        setUser(session?.user ?? null);
        return;
      }
      
      // Só processar se já inicializou
      if (!initialized) {
        console.log("⏭️ [Auth] Pulando evento (ainda inicializando)");
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      
      // Carregar profile se tiver user
      if (session?.user) {
        console.log("🔐 [Auth] Carregando profile (listener)...");
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        console.log("🔐 [Auth] Profile result (listener):", data?.type);
        if (data) {
          setProfile(data);
        }
      } else {
        setProfile(null);
      }
      
      console.log("✅ [Auth] Setando loading = false (listener)");
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      if (refreshTimer) clearInterval(refreshTimer);
    };
  }, [supabase]);

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
