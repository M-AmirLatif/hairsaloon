import { smoothCutSalon } from './salons/smooth-cut-hair-studio.ts';
import { templateSalon } from './salons/template-salon.ts';
import { validateSalonConfig, type SalonConfig } from './schema.ts';

/**
 * Salon Registry
 * To switch the active salon, change DEFAULT_SALON_ID or set VITE_ACTIVE_SALON.
 */
export const salonsRegistry: Record<string, SalonConfig> = {
  'smooth-cut-hair-studio': smoothCutSalon,
  'template-salon': templateSalon,
};

// Single exported active salon line
export const DEFAULT_SALON_ID = 'smooth-cut-hair-studio';

// Resolve active salon
const activeId =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ACTIVE_SALON) ||
  DEFAULT_SALON_ID;

export const activeSalon: SalonConfig = salonsRegistry[activeId] || smoothCutSalon;

// Validate config at runtime to catch missing/invalid fields early
validateSalonConfig(activeSalon);

export default activeSalon;
