import { Workshop } from "@/types/database";

/**
 * Resolve a oficina que o usuário atual pode acessar — seja como DONO ou como MEMBRO.
 * Usa a tabela workshop_members (que já inclui os donos via backfill).
 * Substitui o antigo `.from("workshops").eq("profile_id", user.id)`, que só achava
 * a oficina do dono e quebrava para membros.
 */
export async function resolveWorkshop(
  supabase: any,
  profileId: string | undefined | null
): Promise<Workshop | null> {
  if (!profileId) return null;

  const { data, error } = await supabase
    .from("workshop_members")
    .select("workshops(*)")
    .eq("profile_id", profileId)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("❌ [resolveWorkshop] erro:", error);
    return null;
  }

  return (data?.workshops as Workshop) ?? null;
}
