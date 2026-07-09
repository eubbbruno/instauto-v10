import { createBrowserClient } from "@supabase/ssr";

// Singleton do client de navegador.
// Sem isto, cada componente/página cria uma NOVA instância de GoTrueClient,
// e várias instâncias disputam o mesmo lock de auth do navegador — o que
// pendura queries ao trocar de página (spinner infinito, só resolve com Ctrl+R).
let browserClient: ReturnType<typeof createBrowserClient> | undefined;

export function createClient() {
  // No servidor (SSR) não compartilhamos instância entre requisições.
  if (typeof window === "undefined") {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return browserClient;
}
