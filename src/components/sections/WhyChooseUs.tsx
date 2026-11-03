import React from 'react';
import type { SalonConfig, WhyChooseUsItem } from '../../config/schema';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { SectionHeading } from '../layout/SectionHeading';
import { Sparkles, ShieldCheck, Scissors, Clock, Award, HeartHandshake, Smile, type LucideIcon } from 'lucide-react';

interface WhyChooseUsProps {
  salon: SalonConfig;
}

const iconMap: Record<WhyChooseUsItem['iconName'], LucideIcon> = {
  Sparkles,
  ShieldCheck,
  Scissors,
  Clock,
  Award,
  HeartHandshake,
  Smile,
};

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ salon }) => {
  return (
    <Section id="why-choose-us" variant="light-elevated" ariaLabelledby="why-heading">
      <Container>
        <SectionHeading
          id="why-heading"
          eyebrow="Our Standard"
          title="Why Clients Choose Smooth Cut."
          subtitle="Honest standards grounded in cleanliness, equipment safety, and customer satisfaction."
          variant="light"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {salon.whyChooseUs.map(item => {
            const Icon = iconMap[item.iconName] || Scissors;
            return (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-[#F5F0E8] border border-[#DDD6CA] shadow-sm flex flex-col gap-4 transition-all duration-300 hover:shadow-md hover:border-[#5C4028]/40"
              >
                <div className="w-12 h-12 rounded-xl bg-[#5C4028]/10 text-[#5C4028] flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="font-heading text-lg font-bold text-[#1C1C1E] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#57534E] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
};
