"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase";
import { resolveWorkshop } from "@/lib/workshop";
import { PERMISSION_MODULES, PermissionMap, allPermissions } from "@/lib/permissions";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Users, Mail, Trash2, Crown, ShieldCheck, UserPlus, X, Check } from "lucide-react";

interface Member {
  id: string;
  profile_id: string;
  role: string;
  permissions: PermissionMap | null;
  name: string | null;
  email: string;
}

interface Invite {
  id: string;
  email: string;
  permissions: PermissionMap | null;
  status: string;
  created_at: string;
}

export default function EquipePage() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [workshop, setWorkshop] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);

  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePerms, setInvitePerms] = useState<PermissionMap>(allPermissions());
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    if (profile?.id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  const load = async () => {
    setLoading(true);
    try {
      const ws = await resolveWorkshop(supabase, profile?.id);
      if (!ws) {
        setLoading(false);
        return;
      }
      setWorkshop(ws);
      setIsOwner(ws.profile_id === profile?.id);

      // Membros (join com profiles)
      const { data: membersData } = await supabase
        .from("workshop_members")
        .select("id, profile_id, role, permissions, profiles(name, email)")
        .eq("workshop_id", ws.id)
        .order("created_at", { ascending: true });

      setMembers(
        (membersData || []).map((m: any) => ({
          id: m.id,
          profile_id: m.profile_id,
          role: m.role,
          permissions: m.permissions,
          name: m.profiles?.name ?? null,
          email: m.profiles?.email ?? "",
        }))
      );

      // Convites pendentes
      const { data: invitesData } = await supabase
        .from("workshop_invites")
        .select("id, email, permissions, status, created_at")
        .eq("workshop_id", ws.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      setInvites(invitesData || []);
    } catch (e) {
      console.error("Erro ao carregar equipe:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);
    try {
      const email = inviteEmail.trim().toLowerCase();

      // Já é membro?
      if (members.some((m) => m.email.toLowerCase() === email)) {
        toast({ variant: "destructive", title: "Já é da equipe", description: "Esse e-mail já faz parte da oficina." });
        setInviting(false);
        return;
      }

      const { error } = await supabase.from("workshop_invites").upsert(
        {
          workshop_id: workshop.id,
          email,
          permissions: invitePerms,
          status: "pending",
          invited_by: profile?.id,
        },
        { onConflict: "workshop_id,email" }
      );

      if (error) throw error;

      toast({ title: "Convite enviado!", description: `${email} vai entrar na equipe ao acessar o Instauto com esse e-mail.` });
      setInviteEmail("");
      setInvitePerms(allPermissions());
      load();
    } catch (err: any) {
      console.error(err);
      toast({ variant: "destructive", title: "Erro", description: err.message || "Não foi possível convidar." });
    } finally {
      setInviting(false);
    }
  };

  const removeMember = async (m: Member) => {
    if (m.role === "owner") return;
    if (!confirm(`Remover ${m.name || m.email} da equipe?`)) return;
    const { error } = await supabase.from("workshop_members").delete().eq("id", m.id);
    if (error) {
      toast({ variant: "destructive", title: "Erro", description: error.message });
    } else {
      toast({ title: "Membro removido" });
      load();
    }
  };

  const cancelInvite = async (inv: Invite) => {
    const { error } = await supabase.from("workshop_invites").update({ status: "cancelled" }).eq("id", inv.id);
    if (error) {
      toast({ variant: "destructive", title: "Erro", description: error.message });
    } else {
      load();
    }
  };

  const togglePerm = (key: string) =>
    setInvitePerms((p) => ({ ...p, [key]: !p[key] }));

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1e3a8a]" />
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <div>
          <p className="text-xs sm:text-sm text-gray-400 mb-1">Dashboard / Equipe</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Equipe</h1>
        </div>
        <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-8 text-center shadow-sm">
          <ShieldCheck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">Apenas o dono da oficina pode gerenciar a equipe.</p>
        </div>
      </div>
    );
  }

  const seatsUsed = members.length;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <p className="text-xs sm:text-sm text-gray-400 mb-1">Dashboard / Equipe</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Equipe</h1>
        <p className="text-sm text-gray-600 mt-1">Convide usuários e defina o que cada um acessa.</p>
      </div>

      {/* Assentos / plano */}
      <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#1e3a8a]/5 flex items-center justify-center">
            <Users className="w-5 h-5 text-[#1e3a8a]" />
          </div>
          <div>
            <p className="font-bold text-gray-900">{seatsUsed} {seatsUsed === 1 ? "usuário" : "usuários"} na equipe</p>
            <p className="text-sm text-gray-500">
              Plano {workshop?.plan_type === "equipe" ? "Equipe (dono + 3)" : workshop?.plan_type === "pro" ? "PRO (1 usuário)" : "atual"}
            </p>
          </div>
        </div>
      </div>

      {/* Convidar */}
      <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-5 sm:p-6 shadow-sm">
        <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
          <UserPlus className="w-5 h-5 text-[#1e3a8a]" />
          Convidar usuário
        </h2>
        <form onSubmit={handleInvite} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="email@dapessoa.com"
              required
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a]/30 focus:border-transparent"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Acesso aos módulos</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PERMISSION_MODULES.map((mod) => (
                <button
                  type="button"
                  key={mod.key}
                  onClick={() => togglePerm(mod.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left transition-colors ${
                    invitePerms[mod.key]
                      ? "border-[#1e3a8a]/30 bg-[#1e3a8a]/5 text-gray-900"
                      : "border-gray-200 bg-white text-gray-400"
                  }`}
                >
                  <span className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${invitePerms[mod.key] ? "bg-[#1e3a8a] text-white" : "border border-gray-300"}`}>
                    {invitePerms[mod.key] && <Check className="w-3 h-3" />}
                  </span>
                  {mod.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={inviting}
            className="btn-epic-blue inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold disabled:opacity-60"
          >
            {inviting && <Loader2 className="w-4 h-4 animate-spin" />}
            Enviar convite
          </button>
        </form>
      </div>

      {/* Membros */}
      <div className="bg-white border border-[#0B1120]/8 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Membros</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#13224a] flex items-center justify-center text-white font-bold flex-shrink-0">
                {(m.name || m.email).charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{m.name || m.email.split("@")[0]}</p>
                <p className="text-sm text-gray-500 truncate">{m.email}</p>
              </div>
              {m.role === "owner" ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-yellow-700 bg-yellow-100 px-2.5 py-1 rounded-full">
                  <Crown className="w-3.5 h-3.5" /> Dono
                </span>
              ) : (
                <button
                  onClick={() => removeMember(m)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remover"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Convites pendentes */}
      {invites.length > 0 && (
        <div className="bg-white border border-[#0B1120]/8 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Convites pendentes</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {invites.map((inv) => (
              <div key={inv.id} className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{inv.email}</p>
                  <p className="text-sm text-gray-400">Aguardando o primeiro acesso</p>
                </div>
                <button
                  onClick={() => cancelInvite(inv)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Cancelar convite"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
