import React from 'react';
import type { SalonConfig } from '../../config/schema.ts';
import { Section } from '../layout/Section.tsx';
import { Container } from '../layout/Container.tsx';
import { SectionHeading } from '../layout/SectionHeading.tsx';
import { Card } from '../ui/Card.tsx';
import { Badge } from '../ui/Badge.tsx';
import { Button } from '../ui/Button.tsx';
import { formatPKR } from '../../lib/formatters.ts';
import { Check, Clock, Calendar, Info } from 'lucide-react';

interface PricingProps {
  salon: SalonConfig;
  onSelectService: (serviceName: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ salon, onSelectService }) => {
  if (!salon.features.showPricing) return null;

  const handleBookItem = (name: string) => {
    onSelectService(name);
    const bookingEl = document.getElementById('booking');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Section id="pricing" variant="light" ariaLabelledby="pricing-heading">
      <Container>
        <SectionHeading
          id="pricing-heading"
          eyebrow="Rates Overview"
          title="Grooming Rates & Packages."
          subtitle="Clear overview of service rates and combination grooming packages."
          variant="light"
        />

        {/* Demo Price Notice Banner */}
        {!salon.features.pricesAreVerified && (
          <div className="mb-8 p-4 rounded-xl bg-[#ECE6DC] border border-[#DDD6CA] max-w-3xl mx-auto flex items-start gap-3">
            <span className="p-1 rounded-md bg-[#5C4028]/10 text-[#5C4028] mt-0.5 shrink-0">
              <Info className="w-4 h-4" aria-hidden="true" />
            </span>
            <div className="text-xs text-[#57534E] leading-relaxed">
              <strong className="text-[#1C1C1E] font-semibold block mb-0.5">
                Pricing Note:
              </strong>
              {salon.pricingDisclaimer}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Individual Services Menu */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <h3 className="font-heading text-2xl font-bold text-[#1C1C1E] mb-1 tracking-tight">
              Individual Rates
            </h3>

            <div className="flex flex-col gap-2.5">
              {salon.services
                .filter(s => s.visible && (salon.features.showUnverifiedServices || s.verified))
                .map(item => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-[#ECE6DC] border border-[#DDD6CA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors hover:border-[#5C4028]/40"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-semibold text-base text-[#1C1C1E]">
                          {item.name}
                        </h4>
                        {item.verified ? (
                          <Badge variant="verified" size="sm">
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="sample" size="sm">
                            Sample
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-[#57534E] line-clamp-2">
                        {item.description}
                      </p>
                      {item.duration && (
                        <span className="inline-flex items-center gap-1 text-xs text-[#3D3A35] mt-1 font-medium">
                          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{item.duration}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#DDD6CA]">
                      <div className="text-left sm:text-right">
                        <span className="text-lg font-bold text-[#1C1C1E]">
                          {formatPKR(item.price.amount, item.price.from)}
                        </span>
                        {!salon.features.pricesAreVerified && (
                          <span className="block text-xs text-[#5C4028] font-medium">
                            Demo price
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleBookItem(item.name)}
                        className="text-xs font-semibold text-[#5C4028] hover:text-[#1C1C1E] underline underline-offset-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#5C4028] py-0.5"
                      >
                        Request this
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Right Column: Grooming Combo Packages (Tightened Spacing) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <h3 className="font-heading text-2xl font-bold text-[#1C1C1E] mb-1 tracking-tight">
              Curated Packages
            </h3>

            <div className="flex flex-col gap-3.5">
              {salon.pricingPackages.map(pkg => (
                <Card
                  key={pkg.id}
                  variant="light"
                  className={`p-5 border relative ${
                    pkg.popular ? 'border-[#5C4028] shadow-md bg-white' : 'border-[#DDD6CA] bg-[#ECE6DC]'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute top-3.5 right-3.5">
                      <span className="text-xs font-bold uppercase tracking-wider bg-[#5C4028] text-white px-2.5 py-0.5 rounded-full">
                        Popular
                      </span>
                    </div>
                  )}

                  <h4 className="font-heading text-xl font-bold text-[#1C1C1E] mb-1">
                    {pkg.name}
                  </h4>
                  <p className="text-xs text-[#57534E] mb-3 leading-relaxed">
                    {pkg.description}
                  </p>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-[#1C1C1E]">
                      {formatPKR(pkg.price.amount)}
                    </span>
                    {!salon.features.pricesAreVerified && (
                      <span className="text-xs text-[#5C4028] font-medium">
                        (Demo price)
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 mb-4">
                    <p className="text-xs font-semibold text-[#1C1C1E] uppercase tracking-wider">
                      Includes:
                    </p>
                    {pkg.servicesIncluded.map((inc, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#3D3A35]">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline-light"
                    size="sm"
                    fullWidth
                    onClick={() => handleBookItem(pkg.name)}
                  >
                    <Calendar className="w-4 h-4 mr-1.5" aria-hidden="true" />
                    Request Package
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};
