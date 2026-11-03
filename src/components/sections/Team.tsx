import React from 'react';
import type { SalonConfig } from '../../config/schema';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { SectionHeading } from '../layout/SectionHeading';
import { Badge } from '../ui/Badge';

interface TeamProps {
  salon: SalonConfig;
}

export const Team: React.FC<TeamProps> = ({ salon }) => {
  if (!salon.features.showTeam || !salon.team || salon.team.length === 0) {
    return null;
  }

  return (
    <Section id="team" variant="dark" ariaLabelledby="team-heading">
      <Container>
        <SectionHeading
          id="team-heading"
          eyebrow="Our Barbers"
          title="Master Grooming Stylists."
          subtitle="Experienced professionals dedicated to your styling and comfort."
          variant="dark"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {salon.team.map(member => (
            <div
              key={member.id}
              className="p-6 rounded-2xl bg-[#161618] border border-[#2A2A2D] flex flex-col items-center text-center gap-4"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden bg-[#2A2A2D] border-2 border-[#C9A96E]/40">
                <img
                  src={member.image}
                  alt={`${member.role} demonstration portrait`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div>
                <h3 className="font-heading text-xl font-bold text-[#F5F0E8]">{member.role}</h3>
                <p className="text-xs text-[#A8A39D] mt-1">{member.bio}</p>
              </div>

              {member.isDemo && (
                <Badge variant="sample" size="sm">
                  Demo profile
                </Badge>
              )}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};
