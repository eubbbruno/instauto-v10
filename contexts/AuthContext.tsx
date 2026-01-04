"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";
import { Profile } from "@/types/database";

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, userType: 'motorista' | 'oficina') => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ user: User }>;
  signInWithGoogle: (userType: 'motorista' | 'oficina') => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const initAuth = async () => {
      try {
        console.log("=== INIT AUTH ===");
        
        // Primeiro tenta pegar sessão existente
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("AuthContext: Error getting session:", error);
        }

        console.log("Session:", session?.user?.id || "none");

        if (session?.user) {
          console.log("AuthContext: Session found for user:", session.user.id);
          setUser(session.user);
          await loadProfile(session.user.id);
        } else {
          console.log("AuthContext: No session found");
          setLoading(false);
        }
      } catch (error) {
        console.error("AuthContext: Init auth error:", error);
        setLoading(false);
      }
    };

    initAuth();

    // TIMEOUT de segurança - se demorar mais de 5 segundos, para de carregar
    timeoutId = setTimeout(() => {
      console.warn("⚠️ Auth timeout - forcing loading false after 5s");
      setLoading(false);
    }, 5000);

    // Listener para mudanças
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("AuthContext: Auth state changed:", event);
        setUser(newSession?.user || null);

        if (newSession?.user) {
          console.log("AuthContext: Loading profile for user:", newSession.user.id);
          await loadProfile(newSession.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      console.log("📋 Loading profile for user:", userId);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      console.log("Profile data:", data);
      console.log("Profile error:", error);

      if (error) throw error;
      
      setProfile(data);
      console.log("✅ Profile loaded successfully");
    } catch (error) {
      console.error("❌ Erro ao carregar perfil:", error);
      setProfile(null);
    } finally {
      setLoading(false);
      console.log("🏁 Auth loading finished");
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    name: string, 
    userType: 'motorista' | 'oficina' = 'motorista'
  ) => {
    const redirectTo = userType === 'motorista' 
      ? `${window.location.origin}/auth/callback?type=motorista`
      : `${window.location.origin}/auth/callback?type=oficina`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          name: name,
          user_type: userType, // Salva nos metadados do user
        },
      },
    });

    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error("Usuário não encontrado");

    return { user: data.user };
  };

  const signInWithGoogle = async (userType: 'motorista' | 'oficina' = 'motorista') => {
    const redirectTo = `${window.location.origin}/auth/callback?type=${userType}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) throw error;
  };

  const signOut = async () => {
    try {
      console.log("🚪 Iniciando logout...");
      
      // Limpar estado local PRIMEIRO
      setUser(null);
      setProfile(null);
      setLoading(false);

      // Fazer logout no Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Erro no signOut do Supabase:", error);
      }

      // FORÇAR limpeza de cookies manualmente
      if (typeof window !== "undefined") {
        console.log("🧹 Limpando cookies e localStorage...");
        
        // Limpar todos os cookies do Supabase
        const cookies = document.cookie.split(";");
        for (let cookie of cookies) {
          const cookieName = cookie.split("=")[0].trim();
          if (cookieName.startsWith("sb-")) {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
          }
        }
        
        // Limpar localStorage também
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith("sb-")) {
            localStorage.removeItem(key);
          }
        });
        
        // Limpar sessionStorage
        Object.keys(sessionStorage).forEach(key => {
          if (key.startsWith("sb-")) {
            sessionStorage.removeItem(key);
          }
        });
        
        console.log("✅ Cookies e storage limpos!");
      }

      // Redirecionar para home com reload completo
      console.log("🏠 Redirecionando para home...");
      window.location.href = "/";
      
    } catch (error) {
      console.error("❌ Erro ao fazer logout:", error);
      // Força redirect mesmo com erro
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

