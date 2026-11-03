import React, { useState, useEffect, useRef } from 'react';
import type { SalonConfig } from '../../config/schema';
import { BrandLogo } from '../ui/BrandLogo';
import { Button } from '../ui/Button';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { Phone, Menu, X, Calendar } from 'lucide-react';

interface NavbarProps {
  salon: SalonConfig;
}

export const Navbar: React.FC<NavbarProps> = ({ salon }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useBodyScrollLock(mobileMenuOpen);

  // Derive nav links based on feature flags
  const navLinks = [
    { label: 'Home', href: '#hero', id: 'hero' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Services', href: '#services', id: 'services' },
    ...(salon.features.showPricing ? [{ label: 'Pricing', href: '#pricing', id: 'pricing' }] : []),
    ...(salon.features.showGallery ? [{ label: 'Gallery', href: '#gallery', id: 'gallery' }] : []),
    ...(salon.features.showReviews ? [{ label: 'Reviews', href: '#reviews', id: 'reviews' }] : []),
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const sectionIds = navLinks.map(l => l.id);
  const activeSectionId = useScrollSpy(sectionIds, 120);

  // Scroll listener for sticky navbar blur state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard trap and escape handler for mobile menu
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      } else if (e.key === 'Tab' && mobileMenuRef.current) {
        const focusable = mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'a, button, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0F0F10]/92 backdrop-blur-md border-b border-[#2A2A2D] shadow-lg shadow-black/30 py-3'
          : 'bg-transparent py-4 md:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between" aria-label="Main Navigation">
          {/* Logo link */}
          <a
            href="#hero"
            className="focus-visible:outline-2 focus-visible:outline-[#C9A96E] rounded-md"
          >
            <BrandLogo identity={salon.identity} size="md" />
          </a>

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map(link => {
              const isActive = activeSectionId === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={link.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-[#C9A96E] bg-white/5 font-semibold'
                        : 'text-[#F5F0E8] hover:text-[#C9A96E] hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Desktop CTAs (Phone + Book) */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${salon.contact.phoneTel}`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#F5F0E8] hover:text-[#C9A96E] transition-colors focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
            >
              <Phone className="w-4 h-4 text-[#C9A96E]" aria-hidden="true" />
              <span>{salon.contact.phoneDisplay}</span>
            </a>

            <Button href="#booking" size="sm" variant="primary">
              <Calendar className="w-4 h-4 mr-1.5" aria-hidden="true" />
              Book Appointment
            </Button>
          </div>

          {/* Mobile Right Controls: Quick Call & Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={`tel:${salon.contact.phoneTel}`}
              className="p-2.5 rounded-lg bg-[#161618] text-[#C9A96E] border border-[#2A2A2D] hover:bg-[#2A2A2D] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
              aria-label={`Call ${salon.contact.phoneDisplay}`}
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
            </a>

            <button
              ref={menuButtonRef}
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="p-2.5 rounded-lg bg-[#161618] text-[#F5F0E8] border border-[#2A2A2D] hover:bg-[#2A2A2D] hover:text-[#C9A96E] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          ref={mobileMenuRef}
          className="fixed inset-0 top-[65px] z-50 bg-[#0F0F10]/98 backdrop-blur-xl border-t border-[#2A2A2D] lg:hidden flex flex-col justify-between p-6 overflow-y-auto animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A96E] mb-2 px-3">
              Navigation
            </p>
            <ul className="flex flex-col gap-1">
              {navLinks.map(link => {
                const isActive = activeSectionId === link.id;
                return (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      onClick={closeMobileMenu}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg text-lg font-medium transition-colors min-h-[48px] ${
                        isActive
                          ? 'text-[#C9A96E] bg-white/5 font-semibold'
                          : 'text-[#F5F0E8] hover:text-[#C9A96E] hover:bg-white/5'
                      }`}
                    >
                      <span>{link.label}</span>
                      <span className="text-xs text-[#8A857B]">{link.id === 'hero' ? '01' : ''}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="pt-6 border-t border-[#2A2A2D] flex flex-col gap-3 mt-6 safe-bottom-padding">
            <Button
              href="#booking"
              variant="primary"
              size="lg"
              fullWidth
              onClick={closeMobileMenu}
            >
              <Calendar className="w-5 h-5 mr-2" aria-hidden="true" />
              Book Appointment
            </Button>

            <a
              href={`tel:${salon.contact.phoneTel}`}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#161618] border border-[#2A2A2D] text-[#F5F0E8] hover:text-[#C9A96E] font-medium text-base min-h-[48px] transition-colors"
            >
              <Phone className="w-4 h-4 text-[#C9A96E]" aria-hidden="true" />
              <span>Call: {salon.contact.phoneDisplay}</span>
            </a>

            <p className="text-center text-xs text-[#D1CCC2] mt-2">
              {salon.hours.scheduleNotice}
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
