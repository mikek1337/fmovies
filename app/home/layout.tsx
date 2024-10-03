import Footer from "@/components/footer";
import Header from "@/components/header";


interface HomeLayoutProps {
  children: React.ReactNode;
}
export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <main className="">
      <Header />

      {children}

      <Footer />
    </main>
  );
}
