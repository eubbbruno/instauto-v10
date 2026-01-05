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
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

