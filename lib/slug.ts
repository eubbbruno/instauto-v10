/**
 * Converte um texto (ex.: nome de cidade) em slug URL-safe.
 * "São Paulo" -> "sao-paulo", "Ribeirão Preto" -> "ribeirao-preto"
 */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove acentos (combining marks)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Título amigável a partir de um slug: "sao-paulo" -> "Sao Paulo".
 * Usado só como fallback — o nome real da cidade vem do banco.
 */
export function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
