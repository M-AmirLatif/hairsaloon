import React, { useState } from 'react';
import type { SalonConfig } from '../../config/schema.ts';
import { Section } from '../layout/Section.tsx';
import { Container } from '../layout/Container.tsx';
import { SectionHeading } from '../layout/SectionHeading.tsx';
import { Lightbox } from '../ui/Lightbox.tsx';
import { Maximize2, Info } from 'lucide-react';

interface GalleryProps {
  salon: SalonConfig;
}

export const Gallery: React.FC<GalleryProps> = ({ salon }) => {
  if (!salon.features.showGallery) return null;

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'All Styles' },
    { id: 'haircuts', label: 'Haircuts' },
    { id: 'fades', label: 'Fades' },
    { id: 'beard', label: 'Beard Styling' },
    { id: 'salon', label: 'Salon Studio' },
    { id: 'tools', label: 'Tools' },
  ];

  const filteredImages =
    activeCategory === 'all'
      ? salon.gallery.images
      : salon.gallery.images.filter(img => img.category === activeCategory);

  const openLightbox = (imgId: string) => {
    const idx = salon.gallery.images.findIndex(img => img.id === imgId);
    if (idx !== -1) {
      setLightboxIndex(idx);
    }
  };

  return (
    <Section id="gallery" variant="light" ariaLabelledby="gallery-heading">
      <Container>
        <SectionHeading
          id="gallery-heading"
          eyebrow="Style Lookbook"
          title="Men’s Grooming & Styling Gallery."
          subtitle="Explore haircut silhouettes, clean fades, beard shapes, and salon equipment."
          variant="light"
        />

        {/* Stock Photo Disclosure Note */}
        {salon.features.showStockNotice && (
          <div className="mb-8 p-3.5 rounded-xl bg-[#ECE6DC] border border-[#DDD6CA] max-w-2xl mx-auto flex items-center justify-center gap-2 text-center">
            <Info className="w-4 h-4 text-[#5C4028] shrink-0" aria-hidden="true" />
            <p className="text-xs text-[#57534E]">
              {salon.gallery.stockNotice} See <a href="#attribution" className="text-[#5C4028] underline underline-offset-2">ATTRIBUTION</a> for credits.
            </p>
          </div>
        )}

        {/* Category Filter Chips */}
        <div
          className="flex items-center justify-center gap-2 flex-wrap mb-10"
          role="group"
          aria-label="Filter gallery by category"
        >
          {categories.map(cat => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                aria-pressed={isSelected}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer min-h-[40px] focus-visible:outline-2 focus-visible:outline-[#5C4028] ${
                  isSelected
                    ? 'bg-[#1C1C1E] text-[#F5F0E8] shadow-sm'
                    : 'bg-[#ECE6DC] text-[#3D3A35] hover:bg-[#DDD6CA] border border-[#DDD6CA]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Responsive Image Grid with Visible Captions without Hover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map(img => (
            <div
              key={img.id}
              onClick={() => openLightbox(img.id)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openLightbox(img.id);
                }
              }}
              tabIndex={0}
              role="button"
              className="group flex flex-col rounded-xl overflow-hidden bg-[#ECE6DC] border border-[#DDD6CA] shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-[#5C4028] transition-all hover:shadow-md hover:border-[#5C4028]/40"
            >
              {/* Image Frame */}
              <div className="relative aspect-4/3 overflow-hidden bg-[#DDD6CA]">
                <img
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 text-white backdrop-blur-xs opacity-75 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
              </div>

              {/* Permanently Visible Caption Card (No Hover Required) */}
              <div className="p-3.5 flex flex-col gap-1.5 bg-[#ECE6DC]">
                <span className="self-start text-xs font-semibold uppercase tracking-wider text-[#5C4028] bg-[#DDD6CA]/60 px-2.5 py-0.5 rounded-md">
                  {img.categoryLabel}
                </span>
                <p className="text-xs text-[#1C1C1E] font-medium line-clamp-2 leading-relaxed">
                  {img.alt}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <Lightbox
          images={salon.gallery.images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={idx => setLightboxIndex(idx)}
        />
      </Container>
    </Section>
  );
};
