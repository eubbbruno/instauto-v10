"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@supabase/supabase-js";
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
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      console.log("🔐 [Auth] Inicializando...");
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log("✅ [Auth] Sessão encontrada:", session.user.email);
          setUser(session.user);
          
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          
          if (profileData) {
            console.log("✅ [Auth] Profile carregado:", profileData.type);
            setProfile(profileData);
          } else {
            console.log("⚠️ [Auth] Profile não encontrado:", error?.message);
          }
        } else {
          console.log("👤 [Auth] Sem sessão");
        }
      } catch (error) {
        console.error("❌ [Auth] Erro:", error);
      } finally {
        setLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔄 [Auth] Evento:", event);
      
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
        
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
        }
        setLoading(false);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
