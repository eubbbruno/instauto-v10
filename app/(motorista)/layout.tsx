import DashboardHeader from "@/components/layout/DashboardHeader";
import Footer from "@/components/layout/Footer";

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

