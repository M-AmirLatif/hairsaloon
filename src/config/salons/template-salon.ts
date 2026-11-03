import type { SalonConfig } from '../schema.ts';

/**
 * REBRANDING TEMPLATE FOR A NEW SALON
 *
 * To pitch or launch a new salon:
 * 1. Copy this file: cp template-salon.ts royal-cut-salon.ts
 * 2. Update identity, contact (phone & WhatsApp digits), address, and hours.
 * 3. Update services and pricing.
 * 4. In /src/config/index.ts, import and export your new salon as `activeSalon`.
 * 5. Run `npm run build` or `npm run dev`.
 */
export const templateSalon: SalonConfig = {
  id: 'template-salon',
  identity: {
    businessName: 'Royal Grooming Lounge',
    shortName: 'Royal Grooming',
    category: "Men's Barber & Grooming",
    tagline: 'Modern Barbershop & Men’s Styling in Kasur',
    heroPitch: 'Bespoke haircuts, hot towel beard grooming, and modern men’s styling in a relaxed atmosphere.',
    logoText: 'ROYAL GROOMING',
    logoAccentText: 'BARBERSHOP',
    monogram: 'RG',
  },
  contact: {
    phoneDisplay: '+92 300 1234567',
    phoneTel: '+923001234567',
    whatsappDigits: '923001234567',
    addressLines: ['Railway Road', 'Near City Chowk'],
    city: 'Kasur',
    province: 'Punjab',
    postalCode: '55050',
    country: 'Pakistan',
    countryCode: 'PK',
    plusCode: '4FC2+8H Kasur, Pakistan',
    googleMapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=4FC2%2B8H+Kasur%2C+Pakistan',
    googleMapsFallbackDirectionsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=Railway+Road%2C+Kasur%2C+Pakistan',
    googleMapsListingUrl: 'https://maps.google.com',
  },
  hours: {
    mode: 'fullSchedule',
    closingTimeDisplay: '10:00 PM',
    placeholderOpeningTime: '10:00 AM',
    slotIntervalMinutes: 30,
    scheduleNotice: 'Open Monday through Sunday from 10:00 AM to 10:00 PM.',
    weeklySchedule: {
      monday: '10:00 AM - 10:00 PM',
      tuesday: '10:00 AM - 10:00 PM',
      wednesday: '10:00 AM - 10:00 PM',
      thursday: '10:00 AM - 10:00 PM',
      friday: '02:00 PM - 10:00 PM',
      saturday: '10:00 AM - 10:30 PM',
      sunday: '10:00 AM - 10:30 PM',
    },
  },
  rating: {
    ratingValue: 4.9,
    ratingCount: 18,
    source: 'Google Reviews',
    asOf: 'Verified Google Profile',
    showRating: true,
  },
  features: {
    demoMode: false,
    showTeam: false,
    showPricing: true,
    showGallery: true,
    showReviews: true,
    showUnverifiedServices: true,
    showStockNotice: true,
    pricesAreVerified: true,
  },
  theme: {
    headingFont: "'Cormorant Garamond', Georgia, serif",
    bodyFont: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    colors: {
      bgDark: '#0D1117',
      bgDarkElevated: '#161B22',
      surfaceDark: '#21262D',
      borderDark: '#30363D',
      textDark: '#F0F6FC',
      textDarkMuted: '#8B949E',

      bgLight: '#F6F8FA',
      bgLightElevated: '#FFFFFF',
      surfaceLight: '#EAEEF2',
      borderLight: '#D0D7DE',
      textLight: '#1F2328',
      textLightMuted: '#656D76',

      accentGold: '#D29922',
      accentGoldHover: '#E3B341',
      accentBronze: '#8957E5',
      accentBronzeHover: '#A371F7',
      focusRing: '#D29922',
      success: '#3FB950',
      warning: '#D29922',
    },
  },
  services: [
    {
      id: 'gentlemans-cut',
      name: "Gentleman's Signature Haircut",
      description: 'Consultation, precision shear work, neck taper, and styling product.',
      category: 'Haircuts',
      price: { amount: 800, currency: 'PKR', from: false },
      duration: '40 mins',
      verified: true,
      featured: true,
      visible: true,
      image: {
        src: '/images/gallery-haircut-classic.webp',
        alt: 'Classic haircut demonstration',
        width: 1200,
        height: 800,
      },
    },
    {
      id: 'hot-towel-shave',
      name: 'Hot Towel Beard Treatment & Shave',
      description: 'Warm steam towel, pre-shave oil, straight razor contouring, and cold balm.',
      category: 'Beard',
      price: { amount: 600, currency: 'PKR', from: false },
      duration: '30 mins',
      verified: true,
      featured: true,
      visible: true,
      image: {
        src: '/images/gallery-beard-shape.webp',
        alt: 'Beard grooming demonstration',
        width: 1200,
        height: 800,
      },
    },
  ],
  pricingPackages: [
    {
      id: 'executive-package',
      name: 'Executive Grooming Package',
      description: 'Signature Cut + Hot Towel Beard Treatment + Scalp Massage.',
      price: { amount: 1300, currency: 'PKR' },
      duration: '60 mins',
      servicesIncluded: ['Signature Haircut', 'Beard Treatment', 'Scalp Massage'],
      popular: true,
      verified: true,
    },
  ],
  pricingDisclaimer: 'Official salon pricing. All rates include sanitization and hot towel finish.',
  gallery: {
    stockNotice: 'Images are illustrative photography.',
    images: [
      {
        id: 't-img-1',
        src: '/images/gallery-haircut-classic.webp',
        alt: 'Classic haircut demonstration',
        category: 'haircuts',
        categoryLabel: 'Haircuts',
        width: 1200,
        height: 800,
        credit: {
          photographer: 'Apostolos Vamvouras',
          source: 'Unsplash',
          license: 'Unsplash License',
          sourceUrl: 'https://unsplash.com',
        },
      },
    ],
  },
  whyChooseUs: [
    {
      id: 'experience',
      title: 'Expert Master Stylists',
      description: 'Precision scissor and clipper work for discerning gentlemen.',
      iconName: 'Scissors',
    },
  ],
  customerThemes: [
    {
      id: 'theme-style',
      title: 'Refined Atmosphere',
      description: 'Clients appreciate the calm executive environment and punctuality.',
      iconName: 'Sparkles',
    },
  ],
  booking: {
    whatsappTemplate: 'Assalam-o-Alaikum Royal Grooming,\n\nI would like to book:\n• Name: {name}\n• Service: {service}\n',
    disclaimer: 'Request sent via WhatsApp. Salon will reply with confirmation.',
  },
  seo: {
    metaTitle: "Royal Grooming Lounge | Executive Men's Salon in Kasur",
    metaDescription: 'Executive barbershop on Railway Road, Kasur. Precision haircuts and hot towel treatments.',
    canonicalUrl: 'https://royalgrooming.example.com',
    keywords: ['barbershop in Kasur', "men's salon Kasur"],
    locale: 'en-PK',
    schemaType: 'HairSalon',
    ogImage: '/images/hero-grooming.webp',
  },
};
