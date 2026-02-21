"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";
import { Profile } from "@/types/database";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, userType: "motorista" | "oficina") => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (userType: "motorista" | "oficina") => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Timeout para evitar loading infinito
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn("⚠️ Auth timeout - forçando fim do loading após 10s");
        setLoading(false);
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [loading]);

  // Função para carregar profile com retries
  const loadProfileWithRetries = async (userId: string, retries = 3): Promise<any> => {
    console.log(`🔄 [AuthContext] Carregando profile (tentativa ${4 - retries}/3)...`);
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (data) {
      console.log("✅ [AuthContext] Profile encontrado:", data.type);
      return data;
    }

    if (error && retries > 0) {
      console.log("⏳ [AuthContext] Profile não encontrado, aguardando callback criar...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      return loadProfileWithRetries(userId, retries - 1);
    }

    console.log("❌ [AuthContext] Profile não encontrado após 3 tentativas");
    return null;
  };

  // Inicialização SIMPLES
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      console.log("🔐 [AuthContext] Inicializando...");
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          console.log("✅ [AuthContext] Sessão encontrada:", session.user.email);
          setUser(session.user);
          
          // Usar função com retries
          const profileData = await loadProfileWithRetries(session.user.id);
          
          if (profileData && mounted) {
            setProfile(profileData);
          }
        } else {
          console.log("ℹ️ [AuthContext] Nenhuma sessão ativa");
        }
      } catch (e) {
        console.error("❌ [AuthContext] Erro na inicialização:", e);
      } finally {
        if (mounted) {
          setLoading(false);
          console.log("✅ [AuthContext] Inicialização completa");
        }
      }
    };

    init();

    // Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔄 [AuthContext] Estado mudou:", event);
      
      if (!mounted) return;
      
      setUser(session?.user || null);
      
      if (session?.user) {
        console.log("👤 [AuthContext] Carregando profile para:", session.user.email);
        
        // Usar função com retries para aguardar callback criar profile
        const profileData = await loadProfileWithRetries(session.user.id);
        
        if (profileData && mounted) {
          setProfile(profileData);
        } else if (mounted) {
          console.log("❌ [AuthContext] Profile não encontrado após retries");
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // CADASTRO
  const signUp = async (email: string, password: string, name: string, userType: "motorista" | "oficina") => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?type=${userType}`,
        data: { name, user_type: userType },
      },
    });
    if (error) throw error;
  };

  // LOGIN
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  // GOOGLE
  const signInWithGoogle = async (userType: "motorista" | "oficina") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?type=${userType}`,
      },
    });
    if (error) throw error;
  };

  // LOGOUT - SIMPLES E DIRETO
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    
    // Limpar cookies
    document.cookie.split(";").forEach((c) => {
      const name = c.split("=")[0].trim();
      if (name.startsWith("sb-")) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      }
    });
    
    // Limpar storage
    Object.keys(localStorage).filter(k => k.startsWith("sb-")).forEach(k => localStorage.removeItem(k));
    Object.keys(sessionStorage).filter(k => k.startsWith("sb-")).forEach(k => sessionStorage.removeItem(k));
    
    // Redirect
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
