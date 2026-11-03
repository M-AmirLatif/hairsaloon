/**
 * WhatsApp Click-to-Chat URL generators and message formatters
 */

export interface BookingMessagePayload {
  whatsappDigits: string; // "923034316954"
  salonName: string;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  formattedDate: string; // e.g. "Wednesday, November 4, 2026"
  timeSlot: string; // e.g. "04:30 PM"
  notes?: string;
}

export function buildBookingWhatsAppUrl(payload: BookingMessagePayload): string {
  const {
    whatsappDigits,
    salonName,
    clientName,
    clientPhone,
    serviceName,
    formattedDate,
    timeSlot,
    notes,
  } = payload;

  let message = `Assalam-o-Alaikum ${salonName},\n\n`;
  message += `I would like to request an appointment:\n`;
  message += `• Name: ${clientName.trim()}\n`;
  message += `• Phone: ${clientPhone.trim()}\n`;
  message += `• Service: ${serviceName.trim()}\n`;
  message += `• Preferred Date: ${formattedDate.trim()}\n`;
  message += `• Preferred Time: ${timeSlot.trim()}\n`;

  if (notes && notes.trim().length > 0) {
    message += `• Note: ${notes.trim()}\n`;
  }

  message += `\nPlease let me know if this slot is available. Thank you!`;

  return `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(message)}`;
}

export interface ContactMessagePayload {
  whatsappDigits: string;
  salonName: string;
  senderName: string;
  senderPhone?: string;
  messageText: string;
}

export function buildContactWhatsAppUrl(payload: ContactMessagePayload): string {
  const { whatsappDigits, salonName, senderName, senderPhone, messageText } = payload;

  let message = `Assalam-o-Alaikum ${salonName},\n\n`;
  message += `Message from website visitor:\n`;
  message += `• Name: ${senderName.trim()}\n`;
  if (senderPhone && senderPhone.trim().length > 0) {
    message += `• Phone: ${senderPhone.trim()}\n`;
  }
  message += `• Message: ${messageText.trim()}\n`;

  return `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(message)}`;
}
