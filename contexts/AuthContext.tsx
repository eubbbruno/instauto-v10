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

  // Inicialização SIMPLES
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      console.log("=== AUTH CONTEXT INIT ===");
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Session user:", session?.user?.id);
        
        if (session?.user && mounted) {
          setUser(session.user);
          
          console.log("Loading profile for user:", session.user.id);
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          
          console.log("Profile data:", data?.id);
          console.log("Profile error:", error?.code, error?.message);
          
          if (data && mounted) {
            setProfile(data);
            console.log("✅ Profile loaded:", data.type);
          } else if (!data && !error) {
            console.warn("⚠️ ATENÇÃO: Usuário sem profile! Pode ser login Google que falhou no callback.");
          }
        } else {
          console.log("No session found");
        }
      } catch (e) {
        console.error("❌ Auth init error:", e);
      } finally {
        if (mounted) {
          setLoading(false);
          console.log("Auth init complete");
        }
      }
    };

    init();

    // Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("=== AUTH STATE CHANGE ===");
      console.log("Event:", event);
      console.log("User:", session?.user?.id);
      
      if (!mounted) return;
      
      setUser(session?.user || null);
      
      if (session?.user) {
        console.log("Loading profile for user:", session.user.id);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        console.log("Profile data:", data?.id);
        console.log("Profile error:", error?.code);
        
        setProfile(data || null);
        
        if (!data) {
          console.warn("⚠️ ATENÇÃO: Usuário autenticado mas sem profile!");
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
