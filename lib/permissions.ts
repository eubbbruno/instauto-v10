export interface PermissionModule {
  key: string;
  label: string;
}

// Módulos que o dono pode liberar/bloquear por membro.
// Dashboard, Configurações e Planos ficam de fora (nível dono / sempre visíveis).
export const PERMISSION_MODULES: PermissionModule[] = [
  { key: "clientes", label: "Clientes" },
  { key: "veiculos", label: "Veículos" },
  { key: "ordens", label: "Ordens de Serviço" },
  { key: "orcamentos", label: "Orçamentos" },
  { key: "estoque", label: "Estoque" },
  { key: "financeiro", label: "Financeiro" },
  { key: "agenda", label: "Agenda" },
  { key: "diagnostico", label: "Diagnóstico IA" },
  { key: "relatorios", label: "Relatórios" },
  { key: "whatsapp", label: "WhatsApp" },
];

export type PermissionMap = Record<string, boolean>;

/**
 * Um membro pode acessar um módulo?
 * `permissions` null/undefined = sem restrição (dono ou membro com acesso total).
 * Ausência da chave = permitido por padrão; só bloqueia quando explicitamente false.
 */
export function canAccessModule(permissions: PermissionMap | null | undefined, key: string): boolean {
  if (!permissions) return true;
  return permissions[key] !== false;
}

/** Cria um mapa com todos os módulos liberados. */
export function allPermissions(): PermissionMap {
  return PERMISSION_MODULES.reduce((acc, m) => {
    acc[m.key] = true;
    return acc;
  }, {} as PermissionMap);
}
