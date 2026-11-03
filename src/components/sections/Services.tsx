import React from 'react';
import type { SalonConfig, ServiceItem } from '../../config/schema.ts';
import { Section } from '../layout/Section.tsx';
import { Container } from '../layout/Container.tsx';
import { SectionHeading } from '../layout/SectionHeading.tsx';
import { Card } from '../ui/Card.tsx';
import { Badge } from '../ui/Badge.tsx';
import { Button } from '../ui/Button.tsx';
import { formatPKR } from '../../lib/formatters.ts';
import { Clock, Calendar } from 'lucide-react';

interface ServicesProps {
  salon: SalonConfig;
  onSelectService: (serviceName: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ salon, onSelectService }) => {
  const visibleServices = salon.services.filter(service => {
    if (!service.visible) return false;
    if (!salon.features.showUnverifiedServices && !service.verified) return false;
    return true;
  });

  const handleBookService = (service: ServiceItem) => {
    onSelectService(service.name);
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Section id="services" variant="dark" ariaLabelledby="services-heading">
      <Container>
        <SectionHeading
          id="services-heading"
          eyebrow="Grooming Menu"
          title="Men’s Haircuts & Beard Services."
          subtitle="Precision haircutting, clean fades, and beard trimming tailored to your style."
          variant="dark"
        />

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {visibleServices.map(service => (
            <Card
              key={service.id}
              as="article"
              variant="dark"
              className="flex flex-col h-full bg-[#161618] border border-[#2A2A2D]"
            >
              {/* Image Container with Consistent Aspect Ratio */}
              <div className="relative aspect-16/10 overflow-hidden bg-[#1C1C1E]">
                <img
                  src={service.image.src}
                  alt={service.image.alt}
                  width={service.image.width}
                  height={service.image.height}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                />

                {/* Status Badges Overlay */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold tracking-wider uppercase bg-[#0F0F10]/90 text-[#F5F0E8] px-2.5 py-1 rounded-md backdrop-blur-xs border border-white/10">
                    {service.category}
                  </span>

                  {service.verified ? (
                    <Badge variant="verified" size="sm">
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="sample" size="sm">
                      Sample service
                    </Badge>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <h3 className="font-heading text-xl font-bold text-[#F5F0E8] leading-snug mb-2">
                    {service.name}
                  </h3>

                  <p className="text-sm text-[#D1CCC2] leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Price, Duration & Booking CTA */}
                <div className="pt-4 border-t border-[#2A2A2D] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-[#C9A96E]">
                        {formatPKR(service.price.amount, service.price.from)}
                      </span>
                      {!salon.features.pricesAreVerified && (
                        <span className="block text-xs text-[#E0B873] font-medium">
                          Demo price
                        </span>
                      )}
                    </div>

                    {service.duration && (
                      <span className="flex items-center gap-1 text-xs text-[#C2BCB0]">
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{service.duration}</span>
                      </span>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => handleBookService(service)}
                    aria-label={`Book this service: ${service.name}`}
                  >
                    <Calendar className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                    Book this service
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Informative Note */}
        <div className="mt-10 p-4 rounded-xl bg-[#161618] border border-[#2A2A2D] text-center max-w-2xl mx-auto">
          <p className="text-xs text-[#D1CCC2] leading-relaxed">
            Men's Haircuts and Beard Trimming are verified services offered by the salon. Additional sample services and prices are illustrative placeholders. Final pricing is confirmed by the salon.
          </p>
        </div>
      </Container>
    </Section>
  );
};
