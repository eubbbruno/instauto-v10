import DashboardHeader from "@/components/layout/DashboardHeader";
import Footer from "@/components/layout/Footer";

// Desabilitar cache no layout
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

