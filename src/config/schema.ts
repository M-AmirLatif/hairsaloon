/**
 * Schema and validation definitions for Salon configurations.
 * Allows white-label rebranding across multiple salons.
 */

export type HoursMode = 'closingOnly' | 'fullSchedule';

export interface SalonHours {
  mode: HoursMode;
  closingTimeDisplay: string; // e.g. "11:30 PM"
  placeholderOpeningTime: string; // e.g. "11:00 AM" (clearly labelled editable placeholder when mode is closingOnly)
  slotIntervalMinutes: number; // e.g. 30
  scheduleNotice: string; // e.g. "Open until 11:30 PM (as listed on Google)"
  weeklySchedule?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
}

export interface SalonIdentity {
  businessName: string;
  shortName: string;
  category: string;
  tagline: string;
  heroPitch: string;
  logoText: string;
  logoAccentText: string;
  monogram: string;
}

export interface SalonContact {
  phoneDisplay: string; // e.g. "+92 303 4316954"
  phoneTel: string; // e.g. "+923034316954"
  whatsappDigits: string; // e.g. "923034316954" (digits only for wa.me)
  email?: string;
  addressLines: string[]; // e.g. ["Shahbaz Khan Road", "near Dr Abuzar Clinic, Tariq Colony"]
  city: string; // "Kasur"
  province: string; // "Punjab"
  postalCode: string; // "55050"
  country: string; // "Pakistan"
  countryCode: string; // "PK"
  plusCode: string; // "4FC3+6F Kasur, Pakistan"
  googleMapsDirectionsUrl: string;
  googleMapsFallbackDirectionsUrl: string;
  googleMapsListingUrl?: string; // Optional: only shown if owner provides verified link
}

export interface SalonRating {
  ratingValue: number; // e.g. 5.0
  ratingCount: number; // e.g. 6
  source: string; // e.g. "Google Reviews"
  asOf: string; // e.g. "As listed on Google"
  showRating: boolean;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: {
    amount: number;
    currency: string; // "PKR"
    from?: boolean;
  };
  duration?: string; // e.g. "30-45 mins"
  verified: boolean; // Men's Haircuts & Beard Trimming are true; others false
  featured: boolean;
  visible: boolean;
  image: {
    src: string;
    srcset?: string;
    alt: string;
    width: number;
    height: number;
  };
}

export interface PricingPackage {
  id: string;
  name: string;
  description: string;
  price: {
    amount: number;
    currency: string;
  };
  duration: string;
  servicesIncluded: string[];
  popular?: boolean;
  verified: boolean;
}

export interface GalleryImage {
  id: string;
  src: string;
  srcset?: string;
  alt: string;
  category: 'haircuts' | 'fades' | 'beard' | 'salon' | 'tools';
  categoryLabel: string;
  width: number;
  height: number;
  credit: {
    photographer: string;
    source: string;
    license: string;
    sourceUrl: string;
  };
}

export interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
  iconName: 'Sparkles' | 'ShieldCheck' | 'Scissors' | 'Clock' | 'Award' | 'HeartHandshake' | 'Smile';
}

export interface TeamMember {
  id: string;
  role: string; // Role title only per Section 2
  bio: string;
  image: string;
  isDemo: boolean;
}

export interface CustomerTheme {
  id: string;
  title: string;
  description: string;
  iconName: 'Sparkles' | 'Scissors' | 'ShieldCheck' | 'CheckCircle2';
}

export interface VerifiedReview {
  id: string;
  author: string;
  text: string;
  date: string;
  rating: number;
  source: string;
}

export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube';
  url: string;
}

export interface ThemeColors {
  // Dark sections
  bgDark: string; // e.g. "#0F0F10"
  bgDarkElevated: string; // e.g. "#1C1C1E"
  surfaceDark: string; // e.g. "#161618"
  borderDark: string; // e.g. "#2A2A2D"
  textDark: string; // e.g. "#F5F0E8"
  textDarkMuted: string; // e.g. "#A19E95"

  // Light sections (alternating rhythm)
  bgLight: string; // e.g. "#F5F0E8"
  bgLightElevated: string; // e.g. "#FFFFFF"
  surfaceLight: string; // e.g. "#ECE6DC"
  borderLight: string; // e.g. "#DDD6CA"
  textLight: string; // e.g. "#1C1C1E"
  textLightMuted: string; // e.g. "#6E6A63"

  // Accents (accessible contrast)
  accentGold: string; // e.g. "#C9A96E" (champagne gold)
  accentGoldHover: string; // e.g. "#DFC28E"
  accentBronze: string; // e.g. "#9C7A56" (muted bronze)
  accentBronzeHover: string; // e.g. "#B38F6A"
  focusRing: string; // e.g. "#C9A96E"
  success: string; // e.g. "#2E7D32"
  warning: string; // e.g. "#D97706"
}

export interface SalonFeatures {
  demoMode: boolean; // Controls whether developer-facing annotations vs customer-facing copy is shown
  showTeam: boolean;
  showPricing: boolean;
  showGallery: boolean;
  showReviews: boolean;
  showUnverifiedServices: boolean;
  showStockNotice: boolean;
  pricesAreVerified: boolean;
}

export interface SalonSEO {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  keywords: string[];
  locale: string;
  schemaType: 'HairSalon' | 'LocalBusiness';
  ogImage: string;
}

export interface SalonConfig {
  id: string;
  identity: SalonIdentity;
  contact: SalonContact;
  hours: SalonHours;
  rating: SalonRating;
  features: SalonFeatures;
  theme: {
    colors: ThemeColors;
    headingFont: string;
    bodyFont: string;
  };
  services: ServiceItem[];
  pricingPackages: PricingPackage[];
  pricingDisclaimer: string;
  gallery: {
    images: GalleryImage[];
    stockNotice: string;
  };
  whyChooseUs: WhyChooseUsItem[];
  customerThemes: CustomerTheme[];
  verifiedReviews?: VerifiedReview[];
  team?: TeamMember[];
  socialLinks?: SocialLink[];
  booking: {
    whatsappTemplate: string;
    disclaimer: string;
  };
  seo: SalonSEO;
}

/**
 * Validates a salon configuration, throwing helpful build-time/runtime errors if invalid.
 */
export function validateSalonConfig(config: SalonConfig): boolean {
  if (!config.id || typeof config.id !== 'string') {
    throw new Error(`[Config Validation] Salon config missing valid 'id'.`);
  }
  if (!config.identity?.businessName) {
    throw new Error(`[Config Validation] Salon "${config.id}" is missing identity.businessName.`);
  }
  if (!config.contact?.phoneTel || !config.contact?.whatsappDigits) {
    throw new Error(`[Config Validation] Salon "${config.id}" is missing contact phoneTel or whatsappDigits.`);
  }
  if (!/^\d{10,15}$/.test(config.contact.whatsappDigits)) {
    throw new Error(
      `[Config Validation] Salon "${config.id}" whatsappDigits must be 10-15 digits only, found "${config.contact.whatsappDigits}".`
    );
  }
  if (!config.contact?.city || !config.contact?.province || !config.contact?.country) {
    throw new Error(`[Config Validation] Salon "${config.id}" must specify city, province, and country.`);
  }
  if (!config.hours?.closingTimeDisplay) {
    throw new Error(`[Config Validation] Salon "${config.id}" must specify hours.closingTimeDisplay.`);
  }
  if (!config.services || config.services.length === 0) {
    throw new Error(`[Config Validation] Salon "${config.id}" must have at least one service.`);
  }
  const hasVerified = config.services.some(s => s.verified);
  if (!hasVerified) {
    throw new Error(`[Config Validation] Salon "${config.id}" must have at least one verified service.`);
  }
  if (config.rating?.ratingValue < 1 || config.rating?.ratingValue > 5) {
    throw new Error(`[Config Validation] Salon "${config.id}" ratingValue must be between 1 and 5.`);
  }

  return true;
}
