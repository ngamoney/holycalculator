import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AdBanner from "@/components/AdBanner";
import CategoryGrid from "@/components/CategoryGrid";
import Ticker from "@/components/Ticker";
import WhySection from "@/components/WhySection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <AdBanner />
      <CategoryGrid />
      <Ticker />
      <WhySection />
      <Footer />
    </main>
  );
}
