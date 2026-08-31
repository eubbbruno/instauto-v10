/**
 * Eventos de conversão para Google Analytics (gtag) + Meta Pixel (fbq).
 * Chamado no client após ações-chave. Seguro se GA/Pixel não estiverem carregados.
 */

type AnyWindow = Window & { gtag?: (...args: any[]) => void; fbq?: (...args: any[]) => void };

/** Dispara o evento de cadastro concluído (conversão principal). */
export function trackSignup(userType: "oficina" | "motorista") {
  if (typeof window === "undefined") return;
  const w = window as AnyWindow;
  try {
    w.gtag?.("event", "sign_up", { method: "email", user_type: userType });
  } catch {}
  try {
    w.fbq?.("track", "CompleteRegistration", { content_name: userType });
  } catch {}
}

/** Clique num CTA principal (ex.: "Começar grátis" no /para-oficinas). Topo do funil. */
export function trackCtaClick(location: string) {
  if (typeof window === "undefined") return;
  const w = window as AnyWindow;
  try {
    w.gtag?.("event", "select_content", { content_type: "cta", item_id: location });
  } catch {}
  try {
    w.fbq?.("trackCustom", "ClickCTA", { location });
  } catch {}
}

/** Usuário começou a preencher o cadastro (1ª interação com o form). Meio do funil. */
export function trackStartSignup(userType: "oficina" | "motorista") {
  if (typeof window === "undefined") return;
  const w = window as AnyWindow;
  try {
    w.gtag?.("event", "sign_up_start", { user_type: userType });
  } catch {}
  try {
    w.fbq?.("trackCustom", "StartSignup", { content_name: userType });
  } catch {}
}

/** Dispara quando o usuário inicia um checkout de plano (para otimização de ADS). */
export function trackBeginCheckout(plan: string, value: number) {
  if (typeof window === "undefined") return;
  const w = window as AnyWindow;
  try {
    w.gtag?.("event", "begin_checkout", { currency: "BRL", value, items: [{ item_id: plan }] });
  } catch {}
  try {
    w.fbq?.("track", "InitiateCheckout", { currency: "BRL", value, content_name: plan });
  } catch {}
}
