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
  type: "motorist" | "workshop";
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();
  const router = useRouter();

  // Carregar profile com retry
  const loadProfile = async (userId: string, retries = 5): Promise<Profile | null> => {
    console.log(`🔄 [Auth] Carregando profile (tentativa ${6 - retries}/5)...`);
    console.log(`🔄 [Auth] userId: ${userId}`);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    // MOSTRAR RESULTADO COMPLETO
    console.log("🔄 [Auth] Resultado da query:");
    console.log("🔄 [Auth] - data:", data);
    console.log("🔄 [Auth] - error:", error);

    if (data) {
      console.log("✅ [Auth] Profile carregado:", data.type);
      setProfile(data);
      setLoading(false);
      return data;
    }

    if (error) {
      console.error("❌ [Auth] Erro na query:", error.message, error.code, error.details);
    }

    if (retries > 0) {
      console.log(`⏳ [Auth] Aguardando 1s para retry... (${retries} restantes)`);
      await new Promise((r) => setTimeout(r, 1000));
      return loadProfile(userId, retries - 1);
    }

    console.log("❌ [Auth] Profile não encontrado após 5 tentativas");
    setLoading(false);
    return null;
  };

  useEffect(() => {
    // Pegar sessão inicial
    const initAuth = async () => {
      console.log("🔐 [Auth] Inicializando...");

      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          console.log("👤 [Auth] Usuário encontrado:", session.user.email);
          setUser(session.user);
          setSession(session);

          const profile = await loadProfile(session.user.id);
          if (profile) {
            setProfile(profile);
          } else {
            console.log("❌ [Auth] Profile não encontrado após retries");
          }
        } else {
          console.log("👤 [Auth] Nenhum usuário logado");
        }
      } catch (error) {
        console.error("❌ [Auth] Erro na inicialização:", error);
      } finally {
        console.log("✅ [Auth] Finalizando inicialização, setando loading = false");
        setLoading(false);
      }
    };

    initAuth();

    // Listener de mudanças
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 [Auth] Evento:", event);

        try {
          if (event === "SIGNED_IN" && session?.user) {
            console.log("✅ [Auth] Usuário logado:", session.user.email);
            setUser(session.user);
            setSession(session);

            const profile = await loadProfile(session.user.id);
            if (profile) {
              setProfile(profile);
            } else {
              console.log("❌ [Auth] Profile não encontrado no SIGNED_IN");
            }
          } else if (event === "SIGNED_OUT") {
            console.log("🔴 [Auth] Usuário deslogado");
            setUser(null);
            setProfile(null);
            setSession(null);
            router.push("/login");
          }
        } catch (error) {
          console.error("❌ [Auth] Erro no listener:", error);
        } finally {
          console.log("✅ [Auth] Finalizando evento, setando loading = false");
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    console.log("🔴 [Auth] Fazendo logout...");
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
