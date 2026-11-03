import React, { useState, useEffect, useRef } from 'react';
import type { SalonConfig } from '../../config/schema';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { SectionHeading } from '../layout/SectionHeading';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { validateAndNormalizePkPhone } from '../../lib/phoneValidator';
import {
  generateTimeSlots,
  getTodayDateString,
  getMaxBookingDateString,
  formatHumanDate,
  isTimeBeforeClosing,
} from '../../lib/dateHelpers';
import { buildBookingWhatsAppUrl } from '../../lib/whatsapp';
import { MessageSquare, Phone, CheckCircle, Clock } from 'lucide-react';

interface BookingProps {
  salon: SalonConfig;
  selectedService: string;
  onClearSelectedService: () => void;
}

interface FormState {
  fullName: string;
  phone: string;
  service: string;
  date: string;
  timeSlot: string;
  notes: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  service?: string;
  date?: string;
  timeSlot?: string;
  notes?: string;
}

export const Booking: React.FC<BookingProps> = ({
  salon,
  selectedService,
  onClearSelectedService,
}) => {
  const [formData, setFormData] = useState<FormState>({
    fullName: '',
    phone: '',
    service: '',
    date: getTodayDateString(),
    timeSlot: '',
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedWhatsAppUrl, setSubmittedWhatsAppUrl] = useState<string | null>(null);
  const [submittedSummary, setSubmittedSummary] = useState<string | null>(null);

  const fullNameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const serviceRef = useRef<HTMLSelectElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const timeSlotRef = useRef<HTMLSelectElement>(null);

  // Generate available time slots based on editable opening time through closing cutoff
  const availableSlots = generateTimeSlots(
    salon.hours.placeholderOpeningTime || '11:00 AM',
    salon.hours.closingTimeDisplay || '11:30 PM',
    salon.hours.slotIntervalMinutes || 30
  );

  // Sync selectedService prop from card clicks
  useEffect(() => {
    if (selectedService) {
      setFormData(prev => ({ ...prev, service: selectedService }));
      // Clear error on service if any
      setErrors(prev => ({ ...prev, service: undefined }));
    }
  }, [selectedService]);

  // Set default time slot
  useEffect(() => {
    if (availableSlots.length > 0 && !formData.timeSlot) {
      setFormData(prev => ({ ...prev, timeSlot: availableSlots[0] }));
    }
  }, [availableSlots, formData.timeSlot]);

  // Service dropdown options
  const serviceOptions = [
    { value: '', label: '-- Select a Grooming Service --' },
    ...salon.services
      .filter(s => s.visible && (salon.features.showUnverifiedServices || s.verified))
      .map(s => ({
        value: s.name,
        label: `${s.name}${s.verified ? '' : ' (Sample)'}`,
      })),
    // Also include combination packages if configured
    ...salon.pricingPackages.map(pkg => ({
      value: pkg.name,
      label: `[Package] ${pkg.name}`,
    })),
  ];

  const timeSlotOptions = availableSlots.map(slot => ({
    value: slot,
    label: slot,
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 1. Name validation
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full name (at least 2 characters).';
    }

    // 2. Pakistani phone validation
    const phoneResult = validateAndNormalizePkPhone(formData.phone);
    if (!phoneResult.isValid) {
      newErrors.phone = phoneResult.errorMessage || 'Invalid Pakistani phone number.';
    }

    // 3. Service validation
    if (!formData.service) {
      newErrors.service = 'Please select a grooming service.';
    }

    // 4. Date validation
    if (!formData.date) {
      newErrors.date = 'Please select a preferred date.';
    } else {
      const today = getTodayDateString();
      if (formData.date < today) {
        newErrors.date = 'Appointment date cannot be in the past.';
      }
    }

    // 5. Time slot validation (strictly before closing time)
    if (!formData.timeSlot) {
      newErrors.timeSlot = 'Please select a preferred time slot.';
    } else if (!isTimeBeforeClosing(formData.timeSlot, salon.hours.closingTimeDisplay)) {
      newErrors.timeSlot = `Appointments must be before the closing time of ${salon.hours.closingTimeDisplay}.`;
    }

    setErrors(newErrors);

    // Focus first invalid element
    if (newErrors.fullName) {
      fullNameRef.current?.focus();
    } else if (newErrors.phone) {
      phoneRef.current?.focus();
    } else if (newErrors.service) {
      serviceRef.current?.focus();
    } else if (newErrors.date) {
      dateRef.current?.focus();
    } else if (newErrors.timeSlot) {
      timeSlotRef.current?.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const phoneResult = validateAndNormalizePkPhone(formData.phone);
    const readableDate = formatHumanDate(formData.date);

    const waUrl = buildBookingWhatsAppUrl({
      whatsappDigits: salon.contact.whatsappDigits,
      salonName: salon.identity.businessName,
      clientName: formData.fullName.trim(),
      clientPhone: phoneResult.standardDisplay || formData.phone,
      serviceName: formData.service,
      formattedDate: readableDate,
      timeSlot: formData.timeSlot,
      notes: formData.notes.trim() || undefined,
    });

    setSubmittedWhatsAppUrl(waUrl);
    setSubmittedSummary(
      `${formData.service} on ${readableDate} at ${formData.timeSlot} for ${formData.fullName}`
    );

    // Attempt to open in a new window safely
    try {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // Handled via fallback button on-page
    }

    setIsSubmitting(false);
  };

  const handleResetForm = () => {
    setSubmittedWhatsAppUrl(null);
    setSubmittedSummary(null);
    setFormData({
      fullName: '',
      phone: '',
      service: '',
      date: getTodayDateString(),
      timeSlot: availableSlots[0] || '',
      notes: '',
    });
    setErrors({});
    onClearSelectedService();
  };

  return (
    <Section id="booking" variant="dark" ariaLabelledby="booking-heading">
      <Container size="md">
        <SectionHeading
          id="booking-heading"
          eyebrow="Appointments"
          title="Request an Appointment."
          subtitle="Select your service, choose an evening or afternoon slot, and send your booking request directly via WhatsApp."
          variant="dark"
        />

        <Card variant="dark" className="p-6 sm:p-10 bg-[#161618] border border-[#2A2A2D] shadow-2xl relative">
          {submittedWhatsAppUrl ? (
            /* On-Page Success State */
            <div className="flex flex-col items-center text-center py-6 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-5">
                <CheckCircle className="w-8 h-8" aria-hidden="true" />
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#F5F0E8] mb-2">
                Booking Request Prepared!
              </h3>

              <p className="text-sm sm:text-base text-[#ECE6DC] max-w-lg mb-4">
                Your request for <strong className="text-[#C9A96E]">{submittedSummary}</strong> is ready to be sent on WhatsApp.
              </p>

              <div className="p-4 rounded-xl bg-[#0F0F10] border border-[#2A2A2D] text-xs text-[#D1CCC2] max-w-md mb-8">
                <strong>Next Step:</strong> Tap the WhatsApp button below to deliver your message. The salon will verify availability and confirm your booking.
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <Button
                  href={submittedWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <MessageSquare className="w-5 h-5 mr-2" aria-hidden="true" />
                  Open WhatsApp Request
                </Button>

                <Button
                  href={`tel:${salon.contact.phoneTel}`}
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <Phone className="w-4 h-4 mr-2 text-[#C9A96E]" aria-hidden="true" />
                  Call to Confirm
                </Button>
              </div>

              <button
                onClick={handleResetForm}
                className="mt-8 text-xs text-[#D1CCC2] hover:text-[#C9A96E] underline underline-offset-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
              >
                Submit another request
              </button>
            </div>
          ) : (
            /* Interactive Booking Form */
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              {/* Timing disclaimer pill */}
              <div className="p-3 rounded-lg bg-[#0F0F10] border border-[#2A2A2D] flex items-center gap-2.5 text-xs text-[#D1CCC2]">
                <Clock className="w-4 h-4 text-[#C9A96E] shrink-0" aria-hidden="true" />
                <span>
                  <strong>Salon Hours Note:</strong> {salon.hours.scheduleNotice} Slot times are indicative and confirmed by the salon.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <Input
                  ref={fullNameRef}
                  label="Your Full Name"
                  required
                  placeholder="e.g. Ali Khan"
                  autoComplete="name"
                  value={formData.fullName}
                  error={errors.fullName}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, fullName: e.target.value }));
                    if (errors.fullName) setErrors(prev => ({ ...prev, fullName: undefined }));
                  }}
                />

                {/* Mobile Phone */}
                <Input
                  ref={phoneRef}
                  label="Pakistani Mobile Number"
                  required
                  type="tel"
                  inputMode="tel"
                  placeholder="e.g. 0303 4316954 or +92 303 4316954"
                  autoComplete="tel"
                  helperText="Format: 03XXXXXXXXX or +923XXXXXXXXX"
                  value={formData.phone}
                  error={errors.phone}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, phone: e.target.value }));
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
                  }}
                />
              </div>

              {/* Service Selection */}
              <Select
                ref={serviceRef}
                label="Selected Grooming Service"
                required
                options={serviceOptions}
                value={formData.service}
                error={errors.service}
                onChange={e => {
                  setFormData(prev => ({ ...prev, service: e.target.value }));
                  if (errors.service) setErrors(prev => ({ ...prev, service: undefined }));
                }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Preferred Date */}
                <Input
                  ref={dateRef}
                  label="Preferred Date"
                  required
                  type="date"
                  min={getTodayDateString()}
                  max={getMaxBookingDateString(30)}
                  value={formData.date}
                  error={errors.date}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, date: e.target.value }));
                    if (errors.date) setErrors(prev => ({ ...prev, date: undefined }));
                  }}
                />

                {/* Preferred Time Slot */}
                <Select
                  ref={timeSlotRef}
                  label={`Preferred Time (Open until ${salon.hours.closingTimeDisplay})`}
                  required
                  options={timeSlotOptions}
                  value={formData.timeSlot}
                  error={errors.timeSlot}
                  helperText="Closing cutoff is 11:30 PM (as listed on Google)."
                  onChange={e => {
                    setFormData(prev => ({ ...prev, timeSlot: e.target.value }));
                    if (errors.timeSlot) setErrors(prev => ({ ...prev, timeSlot: undefined }));
                  }}
                />
              </div>

              {/* Notes / Special Requests */}
              <Textarea
                label="Additional Notes / Style Preference (Optional)"
                placeholder="Mention specific fade height, beard shape preference, or time flexibility..."
                maxLength={200}
                currentLength={formData.notes.length}
                rows={3}
                value={formData.notes}
                onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />

              {/* Honest Notice */}
              <p className="text-xs text-[#8A857B] leading-relaxed">
                {salon.booking.disclaimer}
              </p>

              {/* Submit CTA */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={isSubmitting}
                >
                  <MessageSquare className="w-5 h-5 mr-2" aria-hidden="true" />
                  <span>Send Booking Request via WhatsApp</span>
                </Button>
              </div>
            </form>
          )}
        </Card>
      </Container>
    </Section>
  );
};
