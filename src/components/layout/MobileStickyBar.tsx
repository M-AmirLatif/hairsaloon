import React from 'react';
import type { SalonConfig } from '../../config/schema';
import { Phone, Calendar, MessageSquare } from 'lucide-react';

interface MobileStickyBarProps {
  salon: SalonConfig;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ salon }) => {
  return (
    <div
      className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-[#0F0F10]/95 backdrop-blur-md border-t border-[#2A2A2D] px-4 py-2.5 safe-bottom-padding shadow-2xl"
      role="region"
      aria-label="Quick Mobile Actions"
    >
      <div className="flex items-center gap-2 max-w-md mx-auto">
        {/* Quick Call */}
        <a
          href={`tel:${salon.contact.phoneTel}`}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#161618] border border-[#2A2A2D] text-[#F5F0E8] hover:text-[#C9A96E] text-xs font-semibold min-h-[44px] transition-colors focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
          aria-label={`Call Now at ${salon.contact.phoneDisplay}`}
        >
          <Phone className="w-4 h-4 text-[#C9A96E] shrink-0" aria-hidden="true" />
          <span>Call Now</span>
        </a>

        {/* Quick WhatsApp Inquiry */}
        <a
          href={`https://wa.me/${salon.contact.whatsappDigits}?text=${encodeURIComponent(
            `Assalam-o-Alaikum ${salon.identity.businessName}, I would like to inquire about your grooming services.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#1F2922] border border-[#2EA043]/40 text-[#4ADE80] text-xs font-semibold min-h-[44px] transition-colors focus-visible:outline-2 focus-visible:outline-[#4ADE80]"
          aria-label="WhatsApp Inquiry"
        >
          <MessageSquare className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>WhatsApp</span>
        </a>

        {/* Book Appointment CTA */}
        <a
          href="#booking"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#C9A96E] text-[#0F0F10] text-xs font-bold min-h-[44px] transition-colors hover:bg-[#DFC28E] focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
        >
          <Calendar className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Book</span>
        </a>
      </div>
    </div>
  );
};
