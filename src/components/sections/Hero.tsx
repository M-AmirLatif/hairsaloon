import React from 'react';
import type { SalonConfig } from '../../config/schema.ts';
import { Button } from '../ui/Button.tsx';
import { Star, Clock, MapPin, Sparkles, Scissors } from 'lucide-react';

interface HeroProps {
  salon: SalonConfig;
}

export const Hero: React.FC<HeroProps> = ({ salon }) => {
  return (
    <section
      id="hero"
      aria-label="Welcome and Studio Highlights"
      className="relative flex items-center justify-center pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden bg-[#0F0F10]"
    >
      {/* Background Hero Photography with Refined, Lighter Contrast Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-grooming.webp"
          alt="Barber in black apron trimming hair of male customer in modern salon chair"
          width={1200}
          height={800}
          loading="eager"
          // @ts-expect-error React 19 / modern HTML attribute
          fetchpriority="high"
          decoding="async"
          className="w-full h-full object-cover object-center brightness-[0.56] contrast-[1.05] filter"
        />
        {/* Subtle Gradient Backing for Contrast without Obscuring the Photo */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0F0F10] via-[#0F0F10]/65 to-[#0F0F10]/35"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Location & Category Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161618]/90 border border-[#C9A96E]/40 text-[#C9A96E] text-xs font-semibold tracking-wider uppercase mb-5 backdrop-blur-sm shadow-md animate-in fade-in duration-300">
          <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{salon.contact.city}, {salon.contact.province} &bull; {salon.identity.category}</span>
        </div>

        {/* Fluid Main Headline (clamped to prevent overflow at 320px) */}
        <h1
          className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F5F0E8] leading-[1.12] mb-5 max-w-4xl"
          style={{ textWrap: 'balance', overflowWrap: 'break-word' }}
        >
          Master Grooming & Precision Cuts Tailored for Gentlemen.
        </h1>

        {/* Truthful Subheadline */}
        <p
          className="text-base sm:text-lg text-[#ECE6DC] max-w-2xl leading-relaxed mb-8 font-normal"
          style={{ textWrap: 'pretty' }}
        >
          Dedicated men’s haircuts and beard trimming on Shahbaz Khan Road, Tariq Colony, Kasur. Clean studio, well-kept equipment, and evening hours until {salon.hours.closingTimeDisplay}.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-10">
          <Button href="#booking" variant="primary" size="lg" className="w-full sm:w-auto">
            <Scissors className="w-4 h-4 mr-2" aria-hidden="true" />
            Request Appointment
          </Button>
          <Button href="#services" variant="outline" size="lg" className="w-full sm:w-auto">
            Explore Services
          </Button>
        </div>

        {/* Verified Trust Indicators Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl pt-6 border-t border-[#2A2A2D]/80 text-left">
          {/* Trust 1: Google Rating */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#161618]/80 border border-white/5 backdrop-blur-xs">
            <div className="w-10 h-10 rounded-lg bg-[#C9A96E]/15 border border-[#C9A96E]/30 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-[#C9A96E] fill-[#C9A96E]" aria-hidden="true" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-[#F5F0E8]">
                {salon.rating.ratingValue.toFixed(1)} / 5.0 Rating
              </p>
              <p className="text-xs text-[#D1CCC2]">
                {salon.rating.ratingCount} Google reviews
              </p>
            </div>
          </div>

          {/* Trust 2: Closing Time */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#161618]/80 border border-white/5 backdrop-blur-xs">
            <div className="w-10 h-10 rounded-lg bg-[#C9A96E]/15 border border-[#C9A96E]/30 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[#C9A96E]" aria-hidden="true" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-[#F5F0E8]">
                Open until {salon.hours.closingTimeDisplay}
              </p>
              <p className="text-xs text-[#D1CCC2]">
                Listed Google closing time
              </p>
            </div>
          </div>

          {/* Trust 3: Location */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#161618]/80 border border-white/5 backdrop-blur-xs">
            <div className="w-10 h-10 rounded-lg bg-[#C9A96E]/15 border border-[#C9A96E]/30 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-[#C9A96E]" aria-hidden="true" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-[#F5F0E8]">
                Tariq Colony, Kasur
              </p>
              <p className="text-xs text-[#D1CCC2]">
                Shahbaz Khan Road
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
