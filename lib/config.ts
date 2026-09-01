/**
 * Login com Facebook: desativado até a Meta liberar o app (Business Verification).
 * O código do OAuth está pronto — basta voltar para `true` quando o app estiver
 * verificado e o login funcionando. Ver botões em app/login e components/auth/SignupForm.
 */
export const FACEBOOK_LOGIN_ENABLED = false;

/**
 * Provedor do WhatsApp da oficina.
 *  - "off"       → recurso em migração; UI mostra "chegando" e as rotas não
 *                  chamam nada (Evolution foi descontinuado — QR/Baileys dá ban
 *                  e a Meta tornou o Embedded Signup obrigatório em 2026).
 *  - "evolution" → provedor antigo (self-hosted no Railway). NÃO usar.
 *  - "cloud"     → WhatsApp Cloud API oficial (em construção — ver
 *                  docs/whatsapp-cloud-api-plan.md).
 */
export const WHATSAPP_MODE: "off" | "evolution" | "cloud" = "off";
