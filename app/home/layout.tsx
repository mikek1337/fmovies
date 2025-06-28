import Footer from "@/components/footer";
import Header from "@/components/header";


interface HomeLayoutProps {
  children: React.ReactNode;
}
export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <main className="h-fit bg-gray-50">
      <Header />

      {children}

      <Footer />
    </main>
  );
}
