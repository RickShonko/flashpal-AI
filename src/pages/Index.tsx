import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { FlashCardDemo } from "@/components/FlashCardDemo";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <FlashCardDemo />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
