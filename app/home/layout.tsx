import Footer from "@/components/footer";
import Header from "@/components/header";


interface HomeLayoutProps {
  children: React.ReactNode;
}
export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <main className="h-screen">
      <Header />

      {children}

      <Footer />
    </main>
  );
}
