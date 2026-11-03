import React, { useState } from 'react';
import type { SalonConfig } from '../../config/schema';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { SectionHeading } from '../layout/SectionHeading';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { buildContactWhatsAppUrl } from '../../lib/whatsapp';
import { validateAndNormalizePkPhone } from '../../lib/phoneValidator';
import { Phone, MessageSquare, MapPin, Clock, Navigation, CheckCircle } from 'lucide-react';

interface ContactProps {
  salon: SalonConfig;
}

export const Contact: React.FC<ContactProps> = ({ salon }) => {
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [messageText, setMessageText] = useState('');
  const [errors, setErrors] = useState<{ senderName?: string; senderPhone?: string; messageText?: string }>({});
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { senderName?: string; senderPhone?: string; messageText?: string } = {};

    if (!senderName.trim() || senderName.trim().length < 2) {
      newErrors.senderName = 'Please enter your name.';
    }

    if (senderPhone.trim()) {
      const phoneResult = validateAndNormalizePkPhone(senderPhone);
      if (!phoneResult.isValid) {
        newErrors.senderPhone = 'Please enter a valid Pakistani phone or leave blank.';
      }
    }

    if (!messageText.trim() || messageText.trim().length < 5) {
      newErrors.messageText = 'Please enter a message (at least 5 characters).';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const waUrl = buildContactWhatsAppUrl({
      whatsappDigits: salon.contact.whatsappDigits,
      salonName: salon.identity.businessName,
      senderName: senderName.trim(),
      senderPhone: senderPhone.trim() || undefined,
      messageText: messageText.trim(),
    });

    setSubmittedUrl(waUrl);

    try {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // Handled via on-page fallback button
    }
  };

  const handleReset = () => {
    setSubmittedUrl(null);
    setSenderName('');
    setSenderPhone('');
    setMessageText('');
    setErrors({});
  };

  return (
    <Section id="contact" variant="light" ariaLabelledby="contact-heading">
      <Container>
        <SectionHeading
          id="contact-heading"
          eyebrow="Visit & Connect"
          title="Studio Location & Quick Inquiries."
          subtitle="Find us on Shahbaz Khan Road in Tariq Colony, call for quick directions, or send a WhatsApp message."
          variant="light"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Studio Information Cards */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Address & Plus Code Card */}
            <Card variant="light" className="p-6 bg-[#ECE6DC] border border-[#DDD6CA] shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#5C4028]/10 text-[#5C4028] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <h3 className="font-heading text-lg font-bold text-[#1C1C1E]">
                    Our Studio Address
                  </h3>
                  <p className="text-sm text-[#3D3A35] leading-relaxed">
                    {salon.contact.addressLines.join(', ')}<br />
                    {salon.contact.city}, {salon.contact.province} {salon.contact.postalCode}, {salon.contact.country}
                  </p>
                  <p className="text-xs text-[#5C4028] font-semibold mt-1">
                    Google Maps Plus Code: {salon.contact.plusCode}
                  </p>

                  <div className="pt-3 mt-1 flex flex-col gap-2">
                    <a
                      href={salon.contact.googleMapsDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1C1C1E] text-[#F5F0E8] hover:bg-[#2A2A2D] text-xs font-semibold transition-colors min-h-[44px]"
                    >
                      <Navigation className="w-4 h-4 text-[#C9A96E]" aria-hidden="true" />
                      <span>Get Directions on Google Maps</span>
                    </a>
                  </div>
                </div>
              </div>
            </Card>

            {/* Direct Phone & WhatsApp Card */}
            <Card variant="light" className="p-6 bg-[#ECE6DC] border border-[#DDD6CA] shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#5C4028]/10 text-[#5C4028] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <h3 className="font-heading text-lg font-bold text-[#1C1C1E]">
                    Direct Phone & WhatsApp
                  </h3>
                  <p className="text-sm text-[#3D3A35]">
                    Call or text us for availability inquiries or immediate directions.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    <a
                      href={`tel:${salon.contact.phoneTel}`}
                      className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-[#DDD6CA] text-[#1C1C1E] hover:border-[#5C4028] text-xs font-semibold min-h-[44px] transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#5C4028]" aria-hidden="true" />
                      <span>{salon.contact.phoneDisplay}</span>
                    </a>

                    <a
                      href={`https://wa.me/${salon.contact.whatsappDigits}?text=${encodeURIComponent(
                        `Assalam-o-Alaikum ${salon.identity.businessName}, I would like to inquire about your services.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-[#15803D] text-white hover:bg-[#166534] text-xs font-semibold min-h-[44px] transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Quick WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </Card>

            {/* Opening Hours Info */}
            <Card variant="light" className="p-6 bg-[#ECE6DC] border border-[#DDD6CA] shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#5C4028]/10 text-[#5C4028] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-heading text-lg font-bold text-[#1C1C1E]">
                    Listed Hours
                  </h3>
                  <p className="text-sm text-[#3D3A35] font-semibold">
                    Open until {salon.hours.closingTimeDisplay}
                  </p>
                  <p className="text-xs text-[#57534E]">
                    {salon.hours.scheduleNotice}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Quick WhatsApp Message Form (Honest frontend flow) */}
          <div className="lg:col-span-7">
            <Card variant="light" className="p-6 sm:p-8 bg-white border border-[#DDD6CA] shadow-md">
              <h3 className="font-heading text-2xl font-bold text-[#1C1C1E] mb-1">
                Send a Quick Message
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] mb-6">
                Have a question about services or timings? Fill out this brief form and send it directly via WhatsApp.
              </p>

              {submittedUrl ? (
                <div className="flex flex-col items-center text-center py-6 animate-in fade-in duration-300">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                    <CheckCircle className="w-7 h-7" aria-hidden="true" />
                  </div>
                  <h4 className="font-heading text-xl font-bold text-[#1C1C1E] mb-2">
                    Message Formatted & Ready!
                  </h4>
                  <p className="text-xs sm:text-sm text-[#57534E] max-w-md mb-6">
                    Tap the button below to send your inquiry to <strong>{salon.identity.businessName}</strong> on WhatsApp.
                  </p>
                  <Button
                    href={submittedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    size="md"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" aria-hidden="true" />
                    Open in WhatsApp
                  </Button>
                  <button
                    onClick={handleReset}
                    className="mt-6 text-xs text-[#5C4028] hover:underline cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      variant="light"
                      label="Your Name"
                      required
                      placeholder="e.g. Usman Tariq"
                      value={senderName}
                      error={errors.senderName}
                      onChange={e => {
                        setSenderName(e.target.value);
                        if (errors.senderName) setErrors(prev => ({ ...prev, senderName: undefined }));
                      }}
                    />

                    <Input
                      variant="light"
                      label="Phone Number (Optional)"
                      type="tel"
                      placeholder="e.g. 0303 4316954"
                      value={senderPhone}
                      error={errors.senderPhone}
                      onChange={e => {
                        setSenderPhone(e.target.value);
                        if (errors.senderPhone) setErrors(prev => ({ ...prev, senderPhone: undefined }));
                      }}
                    />
                  </div>

                  <Textarea
                    variant="light"
                    label="Your Message or Inquiry"
                    required
                    placeholder="Ask about haircut types, group appointments, or salon location..."
                    rows={4}
                    maxLength={300}
                    currentLength={messageText.length}
                    value={messageText}
                    error={errors.messageText}
                    onChange={e => {
                      setMessageText(e.target.value);
                      if (errors.messageText) setErrors(prev => ({ ...prev, messageText: undefined }));
                    }}
                  />

                  <p className="text-[11px] text-[#736E65]">
                    <strong>Honesty Note:</strong> Submitting this form opens official WhatsApp click-to-chat. No emails or server requests are faked.
                  </p>

                  <div className="pt-2">
                    <Button type="submit" variant="primary" size="md" fullWidth>
                      <MessageSquare className="w-4 h-4 mr-2" aria-hidden="true" />
                      Send Message via WhatsApp
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
};
