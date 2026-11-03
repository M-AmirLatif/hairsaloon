import React, { useState } from 'react';
import { activeSalon } from './config';
import { SkipLink } from './components/layout/SkipLink';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileStickyBar } from './components/layout/MobileStickyBar';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Services } from './components/sections/Services';
import { Pricing } from './components/sections/Pricing';
import { Gallery } from './components/sections/Gallery';
import { WhyChooseUs } from './components/sections/WhyChooseUs';
import { Team } from './components/sections/Team';
import { Reviews } from './components/sections/Reviews';
import { Booking } from './components/sections/Booking';
import { Contact } from './components/sections/Contact';

export const App: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string>('');

  const handleSelectService = (serviceName: string) => {
    setSelectedService(serviceName);
  };

  const handleClearSelectedService = () => {
    setSelectedService('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0F10] text-[#F5F0E8] overflow-x-hidden selection:bg-[#C9A96E] selection:text-[#0F0F10]">
      {/* WCAG 2.2 Skip Navigation Link */}
      <SkipLink />

      {/* Sticky Main Navigation */}
      <Navbar salon={activeSalon} />

      {/* Main Semantic Region with Alternating Dark / Light Editorial Rhythm */}
      <main id="main-content" className="flex-1">
        {/* Section B: Hero (Dark #0F0F10) */}
        <Hero salon={activeSalon} />

        {/* Section C: About Us (Light #F5F0E8) */}
        <About salon={activeSalon} />

        {/* Section D: Services (Dark #0F0F10) */}
        <Services salon={activeSalon} onSelectService={handleSelectService} />

        {/* Section E: Pricing (Light #F5F0E8) */}
        <Pricing salon={activeSalon} onSelectService={handleSelectService} />

        {/* Section G: Why Choose Us (Light Elevated #ECE6DC) */}
        <WhyChooseUs salon={activeSalon} />

        {/* Section F: Gallery (Light #F5F0E8) */}
        <Gallery salon={activeSalon} />

        {/* Section I: Reviews (Dark #0F0F10) */}
        <Reviews salon={activeSalon} />

        {/* Section H: Team (Dark, optional/hidden by default) */}
        <Team salon={activeSalon} />

        {/* Section J: Booking (Dark #0F0F10) */}
        <Booking
          salon={activeSalon}
          selectedService={selectedService}
          onClearSelectedService={handleClearSelectedService}
        />

        {/* Section K: Contact (Light #F5F0E8) */}
        <Contact salon={activeSalon} />
      </main>

      {/* Section L: Footer */}
      <Footer salon={activeSalon} />

      {/* Mobile Bottom Quick-Action Bar */}
      <MobileStickyBar salon={activeSalon} />
    </div>
  );
};

export default App;
