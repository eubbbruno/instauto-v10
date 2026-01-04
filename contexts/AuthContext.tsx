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
    const initAuth = async () => {
      try {
        console.log("AuthContext: Initializing auth...");
        
        // Primeiro tenta pegar sessão existente
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("AuthContext: Error getting session:", error);
        }

        if (session) {
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

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    } finally {
      setLoading(false);
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
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
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

