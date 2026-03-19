import { Hero } from '@/components/sections/Hero';
import { Welcome } from '@/components/sections/Welcome';
import { Services } from '@/components/sections/Services';
import { Sermons } from '@/components/sections/Sermons';
import { Events } from '@/components/sections/Events';
import { Give } from '@/components/sections/Give';
import { VNFTFPreview } from '@/components/sections/VNFTFPreview';
import { Footer } from '@/components/layout/Footer';
import { Navigation } from '@/components/layout/Navigation';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Handles both desktop and mobile */}
      <Navigation />

      {/* Main Content */}
      <main className="pb-20 lg:pb-0">
        {/* Hero Section with Altar Glow */}
        <Hero />

        {/* Welcome / About */}
        <Welcome />

        {/* Service Times */}
        <Services />

        {/* Latest Sermons */}
        <Sermons />

        {/* Upcoming Events */}
        <Events />

        {/* VNFTF Preview */}
        <VNFTFPreview />

        {/* Give Section */}
        <Give />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
