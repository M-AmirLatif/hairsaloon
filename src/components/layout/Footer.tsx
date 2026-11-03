import React from 'react';
import type { SalonConfig } from '../../config/schema';
import { BrandLogo } from '../ui/BrandLogo';
import { Phone, MapPin, Clock, ArrowUp, Navigation } from 'lucide-react';

interface FooterProps {
  salon: SalonConfig;
}

export const Footer: React.FC<FooterProps> = ({ salon }) => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About Us', href: '#about' },
    { label: 'Services', href: '#services' },
    ...(salon.features.showPricing ? [{ label: 'Pricing & Packages', href: '#pricing' }] : []),
    ...(salon.features.showGallery ? [{ label: 'Style Gallery', href: '#gallery' }] : []),
    ...(salon.features.showReviews ? [{ label: 'Customer Reviews', href: '#reviews' }] : []),
    { label: 'Request Appointment', href: '#booking' },
    { label: 'Contact', href: '#contact' },
  ];

  const visibleServices = salon.services
    .filter(s => s.visible && (salon.features.showUnverifiedServices || s.verified))
    .slice(0, 5);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0A0A0B] text-[#ECE6DC] border-t border-[#2A2A2D] pt-16 pb-28 md:pb-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 mb-12">
          {/* Col 1: Identity & Tagline */}
          <div className="flex flex-col gap-4">
            <BrandLogo identity={salon.identity} size="md" />
            <p className="text-sm text-[#D1CCC2] leading-relaxed mt-1">
              {salon.identity.tagline}. Professional men's grooming, precision haircutting, and beard care in Tariq Colony, Kasur.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#C9A96E] font-medium mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              <span>{salon.hours.scheduleNotice}</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h3 className="font-heading text-lg font-bold text-[#F5F0E8] mb-4 tracking-wide">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              {navLinks.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#D1CCC2] hover:text-[#C9A96E] transition-colors focus-visible:outline-2 focus-visible:outline-[#C9A96E] rounded-xs"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h3 className="font-heading text-lg font-bold text-[#F5F0E8] mb-4 tracking-wide">
              Services
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              {visibleServices.map(s => (
                <li key={s.id} className="flex items-center justify-between text-[#D1CCC2]">
                  <span>{s.name}</span>
                  {s.verified && (
                    <span className="text-[10px] text-emerald-400 font-medium">Verified</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Location & Contact */}
          <div className="flex flex-col gap-3.5">
            <h3 className="font-heading text-lg font-bold text-[#F5F0E8] mb-1 tracking-wide">
              Location & Hours
            </h3>

            <div className="flex items-start gap-2.5 text-sm text-[#D1CCC2]">
              <MapPin className="w-4 h-4 text-[#C9A96E] shrink-0 mt-1" aria-hidden="true" />
              <div>
                <p>{salon.contact.addressLines.join(', ')}</p>
                <p>{salon.contact.city}, {salon.contact.province} {salon.contact.postalCode}, {salon.contact.country}</p>
                <p className="text-xs text-[#C2BCB0] mt-0.5">Plus Code: {salon.contact.plusCode}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-sm text-[#D1CCC2]">
              <Phone className="w-4 h-4 text-[#C9A96E] shrink-0" aria-hidden="true" />
              <a
                href={`tel:${salon.contact.phoneTel}`}
                className="hover:text-[#C9A96E] transition-colors focus-visible:outline-2 focus-visible:outline-[#C9A96E] rounded-xs"
              >
                {salon.contact.phoneDisplay}
              </a>
            </div>

            <div className="flex items-start gap-2.5 text-sm text-[#D1CCC2]">
              <Clock className="w-4 h-4 text-[#C9A96E] shrink-0 mt-0.5" aria-hidden="true" />
              <p>{salon.hours.scheduleNotice}</p>
            </div>

            <div className="mt-2">
              <a
                href={salon.contact.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F0F10] bg-[#C9A96E] hover:bg-[#DFC28E] px-3.5 py-2 rounded-lg transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Get Directions (Google Maps)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Legal & Disclaimers Row */}
        <div className="border-t border-[#1C1C1E] pt-8 mt-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#C2BCB0]">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>
              &copy; {currentYear} {salon.identity.businessName}. All rights reserved.
            </p>
            <span className="hidden sm:inline" aria-hidden="true">&bull;</span>
            <p>
              Photography is illustrative stock media per truthful demo guidelines.
            </p>
          </div>

          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex items-center gap-1.5 p-2 rounded-lg bg-[#161618] border border-[#2A2A2D] text-[#ECE6DC] hover:text-[#C9A96E] hover:border-[#C9A96E]/40 transition-colors focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
};
