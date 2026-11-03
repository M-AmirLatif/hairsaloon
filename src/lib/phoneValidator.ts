/**
 * Pakistani Mobile Phone Number Validator and Normalizer
 *
 * Accepts formats such as:
 * - "+92 303 4316954"
 * - "0303-4316954"
 * - "0303 4316954"
 * - "923034316954"
 * - "00923034316954"
 * - "3034316954"
 *
 * Returns normalized forms:
 * - standardDisplay: "0303 4316954"
 * - internationalDisplay: "+92 303 4316954"
 * - waDigits: "923034316954"
 * - telUri: "+923034316954"
 */

export interface PhoneValidationResult {
  isValid: boolean;
  rawInput: string;
  normalizedDigits?: string; // 10 digits without leading 0/92, e.g. "3034316954"
  waDigits?: string; // 12 digits for WhatsApp: "923034316954"
  standardDisplay?: string; // "0303 4316954"
  internationalDisplay?: string; // "+92 303 4316954"
  telUri?: string; // "+923034316954"
  errorMessage?: string;
}

export function validateAndNormalizePkPhone(input: string): PhoneValidationResult {
  if (!input || typeof input !== 'string') {
    return {
      isValid: false,
      rawInput: input || '',
      errorMessage: 'Phone number is required.',
    };
  }

  // 1. Strip all non-digit characters (+, spaces, hyphens, brackets, dots)
  const digitsOnly = input.replace(/\D/g, '');

  let subscriberNumber = ''; // Expecting 10 digits starting with 3 (e.g. 3034316954)

  if (digitsOnly.startsWith('00923') && digitsOnly.length === 14) {
    subscriberNumber = digitsOnly.slice(4);
  } else if (digitsOnly.startsWith('923') && digitsOnly.length === 12) {
    subscriberNumber = digitsOnly.slice(2);
  } else if (digitsOnly.startsWith('03') && digitsOnly.length === 11) {
    subscriberNumber = digitsOnly.slice(1);
  } else if (digitsOnly.startsWith('3') && digitsOnly.length === 10) {
    subscriberNumber = digitsOnly;
  } else {
    return {
      isValid: false,
      rawInput: input,
      errorMessage: 'Please enter a valid Pakistani mobile number (e.g. 0303 4316954 or +92 303 4316954).',
    };
  }

  // Double check subscriberNumber is 10 digits starting with '3' followed by 0-9
  if (!/^3\d{9}$/.test(subscriberNumber)) {
    return {
      isValid: false,
      rawInput: input,
      errorMessage: 'Invalid mobile code. Pakistani mobile numbers start with 03XX.',
    };
  }

  const prefix = subscriberNumber.slice(0, 3); // "303"
  const suffix = subscriberNumber.slice(3); // "4316954"
  const waDigits = `92${subscriberNumber}`;

  return {
    isValid: true,
    rawInput: input,
    normalizedDigits: subscriberNumber,
    waDigits,
    standardDisplay: `0${prefix} ${suffix}`,
    internationalDisplay: `+92 ${prefix} ${suffix}`,
    telUri: `+92${subscriberNumber}`,
  };
}
