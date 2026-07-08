import SignupForm from "@/components/auth/SignupForm";

export const metadata = {
  title: "Cadastre sua oficina | Instauto",
  description: "Sistema completo de gestão + visibilidade para novos clientes. Comece com 14 dias de PRO grátis, sem cartão.",
};

export default function CadastroOficinaPage() {
  return <SignupForm userType="oficina" />;
}
