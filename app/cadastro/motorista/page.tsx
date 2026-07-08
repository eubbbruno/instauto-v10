import SignupForm from "@/components/auth/SignupForm";

export const metadata = {
  title: "Criar conta de motorista | Instauto",
  description: "Cadastre-se grátis e encontre oficinas de confiança, peça orçamentos e organize as manutenções do seu veículo.",
};

export default function CadastroMotoristaPage() {
  return <SignupForm userType="motorista" />;
}
