import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/motorista/",
          "/oficina/",
          "/api/",
          "/auth/",
        ],
      },
    ],
    sitemap: "https://www.instauto.com.br/sitemap.xml",
  };
}
