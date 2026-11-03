import React from 'react';
import type { SalonConfig } from '../../config/schema.ts';
import { Section } from '../layout/Section.tsx';
import { Container } from '../layout/Container.tsx';
import { SectionHeading } from '../layout/SectionHeading.tsx';
import { Sparkles, ShieldCheck, Scissors, Smile } from 'lucide-react';

interface AboutProps {
  salon: SalonConfig;
}

export const About: React.FC<AboutProps> = ({ salon }) => {
  const highlights = [
    {
      title: 'Salon Cleanliness',
      desc: 'Customers have praised the clean environment and tidy salon setup.',
      icon: Sparkles,
    },
    {
      title: 'Haircut Experience',
      desc: 'Dedicated men’s haircuts focused on customer satisfaction and personal style.',
      icon: Scissors,
    },
    {
      title: 'Grooming Equipment & Safety',
      desc: 'Appreciation for well-kept equipment and careful grooming safety.',
      icon: ShieldCheck,
    },
    {
      title: 'Beard Trimming',
      desc: 'Positive customer feedback for attentive beard and mustache trimming.',
      icon: Smile,
    },
  ];

  return (
    <Section id="about" variant="light" ariaLabelledby="about-heading">
      <Container>
        <SectionHeading
          id="about-heading"
          eyebrow="About Our Studio"
          title="Cleanliness, Equipment Care, and Quality Haircuts."
          subtitle="A local men’s grooming studio on Shahbaz Khan Road, Tariq Colony, Kasur."
          variant="light"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Visual Column without Overlapping Badges */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="relative rounded-2xl overflow-hidden shadow-md border border-[#DDD6CA] bg-[#ECE6DC]">
              <img
                src="/images/about-workstation.webp"
                alt="Modern salon workstation with large mirrors, warm pendant lighting, and leather barber chairs"
                width={1200}
                height={800}
                loading="lazy"
                decoding="async"
                className="w-full h-[320px] sm:h-[380px] object-cover object-center"
              />
            </div>
            {/* Clean, Non-Overlapping Caption Bar */}
            <div className="p-3 rounded-xl bg-[#ECE6DC] border border-[#DDD6CA] text-xs text-[#57534E] flex items-center justify-between">
              <span className="font-semibold text-[#1C1C1E]">Studio Presentation</span>
              <span className="text-[12px] text-[#57534E]">Illustrative stock photography</span>
            </div>
          </div>

          {/* Truthful Copy and Verified Highlights Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="space-y-4 text-base sm:text-lg text-[#3D3A35] leading-relaxed">
              <p>
                <strong>{salon.identity.businessName}</strong> provides men’s haircuts and beard trimming on Shahbaz Khan Road near Dr Abuzar Clinic in Tariq Colony, Kasur.
              </p>
              <p>
                Customers on Google reviews have highlighted the cleanliness of the salon, an excellent haircut experience, well-kept grooming equipment, and positive results with beard trimming. With evening hours open until {salon.hours.closingTimeDisplay}, the studio accommodates local clients after a full workday.
              </p>
            </div>

            {/* 4 Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
              {highlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#ECE6DC] border border-[#DDD6CA] flex flex-col gap-2 transition-all hover:border-[#5C4028]/40"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#5C4028]/10 text-[#5C4028] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <h3 className="font-semibold text-sm text-[#1C1C1E]">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs text-[#57534E] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};
