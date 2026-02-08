import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Workshop } from "@/types/database";

export function useWorkshop(profileId: string | undefined) {
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!profileId) {
      setLoading(false);
      return;
    }

    const abortController = new AbortController();
    let mounted = true;

    const loadWorkshop = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("workshops")
          .select("*")
          .eq("profile_id", profileId)
          .abortSignal(abortController.signal)
          .single();

        if (fetchError) throw fetchError;

        if (mounted) {
          setWorkshop(data);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError' && mounted) {
          console.error("Erro ao carregar workshop:", err);
          setError(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadWorkshop();

    return () => {
      mounted = false;
      abortController.abort();
    };
  }, [profileId]);

  return { workshop, loading, error };
}
