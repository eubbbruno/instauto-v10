import { MetadataRoute } from "next";
import { createPublicClient } from "@/lib/supabase-public";
import { slugify } from "@/lib/slug";

const baseUrl = "https://www.instauto.com.br";

// Páginas de cidade que têm ao menos 1 oficina pública
async function getCityRoutes(): Promise<MetadataRoute.Sitemap> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("workshops")
      .select("city")
      .eq("is_public", true)
      .not("city", "is", null);

    const slugs = new Set<string>();
    (data || []).forEach((w: { city: string | null }) => {
      if (w.city) slugs.add(slugify(w.city));
    });

    return [...slugs].map((slug) => ({
      url: `${baseUrl}/oficinas/${slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/buscar-oficinas`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/oficinas`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/para-oficinas`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/como-funciona`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/planos`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/cadastro`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/cadastro/motorista`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/cadastro/oficina`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/sobre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contato`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/motoristas`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/solicitar-orcamento`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/termos`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/privacidade`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const cityRoutes = await getCityRoutes();
  return [...staticRoutes, ...cityRoutes];
}
