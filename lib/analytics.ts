/**
 * Eventos de conversão para Google Analytics (gtag) + Meta Pixel (fbq).
 * Cada evento Meta também é enviado via Conversions API (server-side) com o
 * mesmo event_id → a Meta deduplica pixel × servidor. Seguro se GA/Pixel/CAPI
 * não estiverem carregados/configurados.
 */

type AnyWindow = Window & { gtag?: (...args: any[]) => void; fbq?: (...args: any[]) => void };

function newEventId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

/** Envia o mesmo evento para o CAPI (server) com o event_id do pixel para dedup. */
function sendCapi(
  eventName: string,
  eventId: string,
  data?: { email?: string; phone?: string; custom?: Record<string, unknown> }
) {
  if (typeof window === "undefined") return;
  try {
    fetch("/api/meta/capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true, // sobrevive à navegação (ex.: submit que redireciona)
      body: JSON.stringify({
        eventName,
        eventId,
        eventSourceUrl: window.location.href,
        email: data?.email,
        phone: data?.phone,
        custom: data?.custom || {},
      }),
    }).catch(() => {});
  } catch {}
}

/** Dispara o evento de cadastro concluído (conversão principal). */
export function trackSignup(userType: "oficina" | "motorista", email?: string, phone?: string) {
  if (typeof window === "undefined") return;
  const w = window as AnyWindow;
  const eventId = newEventId();
  const custom = { content_name: userType };
  try {
    w.gtag?.("event", "sign_up", { method: "email", user_type: userType });
  } catch {}
  try {
    w.fbq?.("track", "CompleteRegistration", custom, { eventID: eventId });
  } catch {}
  sendCapi("CompleteRegistration", eventId, { email, phone, custom });
}

/** Clique num CTA principal (ex.: "Começar grátis" no /para-oficinas). Topo do funil. */
export function trackCtaClick(location: string) {
  if (typeof window === "undefined") return;
  const w = window as AnyWindow;
  const eventId = newEventId();
  const custom = { location };
  try {
    w.gtag?.("event", "select_content", { content_type: "cta", item_id: location });
  } catch {}
  try {
    w.fbq?.("trackCustom", "ClickCTA", custom, { eventID: eventId });
  } catch {}
  sendCapi("ClickCTA", eventId, { custom });
}

/** Usuário começou a preencher o cadastro (1ª interação com o form). Meio do funil. */
export function trackStartSignup(userType: "oficina" | "motorista") {
  if (typeof window === "undefined") return;
  const w = window as AnyWindow;
  const eventId = newEventId();
  const custom = { content_name: userType };
  try {
    w.gtag?.("event", "sign_up_start", { user_type: userType });
  } catch {}
  try {
    w.fbq?.("trackCustom", "StartSignup", custom, { eventID: eventId });
  } catch {}
  sendCapi("StartSignup", eventId, { custom });
}

/** Dispara quando o usuário inicia um checkout de plano (para otimização de ADS). */
export function trackBeginCheckout(plan: string, value: number) {
  if (typeof window === "undefined") return;
  const w = window as AnyWindow;
  const eventId = newEventId();
  const custom = { currency: "BRL", value, content_name: plan };
  try {
    w.gtag?.("event", "begin_checkout", { currency: "BRL", value, items: [{ item_id: plan }] });
  } catch {}
  try {
    w.fbq?.("track", "InitiateCheckout", custom, { eventID: eventId });
  } catch {}
  sendCapi("InitiateCheckout", eventId, { custom });
}
