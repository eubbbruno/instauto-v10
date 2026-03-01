import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8fafc",
          backgroundImage: "linear-gradient(to bottom right, #eff6ff, #ffffff, #fefce8)",
          padding: "60px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 50,
          }}
        >
          <span
            style={{
              fontSize: 80,
              fontWeight: "bold",
              color: "#2563eb",
              letterSpacing: "-2px",
            }}
          >
            Inst
          </span>
          <span
            style={{
              fontSize: 80,
              fontWeight: "bold",
              color: "#1f2937",
              letterSpacing: "-2px",
            }}
          >
            auto
          </span>
        </div>

        {/* Título principal */}
        <div
          style={{
            fontSize: 48,
            fontWeight: "bold",
            color: "#1f2937",
            textAlign: "center",
            maxWidth: 900,
            marginBottom: 20,
            lineHeight: 1.2,
          }}
        >
          Encontre a Melhor Oficina Mecânica
        </div>

        {/* Subtítulo */}
        <div
          style={{
            fontSize: 28,
            color: "#6b7280",
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          Orçamentos • Avaliações • Gestão de Veículos
        </div>

        {/* Cards de features */}
        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "white",
              padding: "15px 30px",
              borderRadius: 12,
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <span style={{ fontSize: 24, marginRight: 10 }}>⭐</span>
            <span style={{ fontSize: 20, color: "#374151", fontWeight: 600 }}>
              Avaliações Reais
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "white",
              padding: "15px 30px",
              borderRadius: 12,
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <span style={{ fontSize: 24, marginRight: 10 }}>💰</span>
            <span style={{ fontSize: 20, color: "#374151", fontWeight: 600 }}>
              Orçamentos Grátis
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "white",
              padding: "15px 30px",
              borderRadius: 12,
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <span style={{ fontSize: 24, marginRight: 10 }}>🔧</span>
            <span style={{ fontSize: 20, color: "#374151", fontWeight: 600 }}>
              Oficinas Confiáveis
            </span>
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 20,
            color: "#9ca3af",
          }}
        >
          www.instauto.com.br
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
