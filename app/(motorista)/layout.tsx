import DashboardHeader from "@/components/layout/DashboardHeader";
import Footer from "@/components/layout/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Motorista | Instauto",
  description: "Gerencie seus veículos e encontre as melhores oficinas",
};

// Desabilitar cache
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function MotoristaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardHeader />
      <main className="pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}

