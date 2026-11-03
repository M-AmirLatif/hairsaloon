import React from 'react';
import type { SalonConfig, CustomerTheme } from '../../config/schema.ts';
import { Section } from '../layout/Section.tsx';
import { Container } from '../layout/Container.tsx';
import { SectionHeading } from '../layout/SectionHeading.tsx';
import { Card } from '../ui/Card.tsx';
import { Star, Sparkles, Scissors, ShieldCheck, CheckCircle2, ExternalLink, type LucideIcon } from 'lucide-react';

interface ReviewsProps {
  salon: SalonConfig;
}

const themeIconMap: Record<CustomerTheme['iconName'], LucideIcon> = {
  Sparkles,
  Scissors,
  ShieldCheck,
  CheckCircle2,
};

export const Reviews: React.FC<ReviewsProps> = ({ salon }) => {
  if (!salon.features.showReviews) return null;

  return (
    <Section id="reviews" variant="dark" ariaLabelledby="reviews-heading">
      <Container>
        <SectionHeading
          id="reviews-heading"
          eyebrow="Customer Feedback"
          title="What Customers Appreciate."
          subtitle="Feedback themes from Google reviews regarding our cleanliness, haircut quality, and equipment care."
          variant="dark"
        />

        {/* Rating Summary Block */}
        <div className="max-w-xl mx-auto mb-12 p-6 sm:p-8 rounded-2xl bg-[#161618] border border-[#2A2A2D] text-center shadow-xl">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-6 h-6 text-[#C9A96E] fill-[#C9A96E]"
                aria-hidden="true"
              />
            ))}
          </div>

          <p className="text-3xl sm:text-4xl font-bold font-heading text-[#F5F0E8] mt-2">
            {salon.rating.ratingValue.toFixed(1)} / 5.0
          </p>

          <p className="text-sm font-medium text-[#ECE6DC] mt-1">
            Based on {salon.rating.ratingCount} {salon.rating.source}
          </p>

          <p className="text-xs text-[#D1CCC2] mt-1">
            Rating as listed on Google profile ({salon.rating.asOf})
          </p>

          {/* Conditional Google Maps Listing URL Button */}
          {salon.contact.googleMapsListingUrl && (
            <div className="mt-5">
              <a
                href={salon.contact.googleMapsListingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F0F10] bg-[#C9A96E] hover:bg-[#DFC28E] px-4 py-2 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
              >
                <span>View on Google</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          )}
        </div>

        {/* 4 Customer Feedback Themes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {salon.customerThemes.map(theme => {
            const Icon = themeIconMap[theme.iconName] || Sparkles;
            return (
              <Card
                key={theme.id}
                variant="dark"
                className="p-6 bg-[#161618] border border-[#2A2A2D] flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[#C9A96E]/15 border border-[#C9A96E]/30 text-[#C9A96E] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-lg font-bold text-[#F5F0E8]">
                      {theme.title}
                    </h3>
                    <span className="text-xs text-[#D1CCC2] font-medium bg-[#2A2A2D] px-2.5 py-0.5 rounded-md">
                      Customer Theme
                    </span>
                  </div>
                  <p className="text-sm text-[#D1CCC2] leading-relaxed">
                    {theme.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Clean note */}
        <p className="text-center text-xs text-[#D1CCC2] mt-8">
          Customer feedback themes compiled from public Google reviews.
        </p>
      </Container>
    </Section>
  );
};
