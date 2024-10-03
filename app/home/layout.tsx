import Footer from "@/components/footer";
import Header from "@/components/header";
import { Loader } from "lucide-react";
import { Suspense } from "react";

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
