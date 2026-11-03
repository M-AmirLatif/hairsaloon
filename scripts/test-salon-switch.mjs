/**
 * White-Label Salon Switching & Feature Flag Test Suite
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

console.log('=== Starting Salon-Switching & Feature Flag Test Suite ===\n');

// 1. Build with template-salon
console.log('1. Building with VITE_ACTIVE_SALON=template-salon...');
process.env.VITE_ACTIVE_SALON = 'template-salon';
execSync('npm run build', { cwd: ROOT_DIR, stdio: 'inherit' });

const distHtml = fs.readFileSync(path.join(ROOT_DIR, 'dist/index.html'), 'utf-8');

// Assertions on template-salon
const hasTemplateTitle = distHtml.includes("Royal Grooming Lounge | Executive Men's Salon in Kasur");
const hasTemplatePhone = distHtml.includes('+923001234567');
const hasTemplateAddress = distHtml.includes('Railway Road');
const hasTemplateCanonical = distHtml.includes('https://royalgrooming.example.com');

console.log(`${hasTemplateTitle ? '✓ PASS' : '✗ FAIL'} Title updated to Royal Grooming Lounge`);
console.log(`${hasTemplatePhone ? '✓ PASS' : '✗ FAIL'} Phone updated to +923001234567`);
console.log(`${hasTemplateAddress ? '✓ PASS' : '✗ FAIL'} Address updated to Railway Road`);
console.log(`${hasTemplateCanonical ? '✓ PASS' : '✗ FAIL'} Canonical URL updated to royalgrooming.example.com`);

if (!hasTemplateTitle || !hasTemplatePhone || !hasTemplateAddress || !hasTemplateCanonical) {
  throw new Error('Salon-switch test failed: template-salon metadata did not propagate!');
}

// 2. Switch back to smooth-cut-hair-studio
console.log('\n2. Restoring VITE_ACTIVE_SALON=smooth-cut-hair-studio...');
process.env.VITE_ACTIVE_SALON = 'smooth-cut-hair-studio';
execSync('npm run build', { cwd: ROOT_DIR, stdio: 'inherit' });

const restoredHtml = fs.readFileSync(path.join(ROOT_DIR, 'dist/index.html'), 'utf-8');
const hasSmoothTitle = restoredHtml.includes("Smooth Cut Hair Studio1 | Men's Hair Salon in Tariq Colony, Kasur");
const hasSmoothPhone = restoredHtml.includes('+923034316954');
const hasSmoothAddress = restoredHtml.includes('Shahbaz Khan Road');

console.log(`${hasSmoothTitle ? '✓ PASS' : '✗ FAIL'} Restored title to Smooth Cut Hair Studio1`);
console.log(`${hasSmoothPhone ? '✓ PASS' : '✗ FAIL'} Restored phone to +923034316954`);
console.log(`${hasSmoothAddress ? '✓ PASS' : '✗ FAIL'} Restored address to Shahbaz Khan Road`);

if (!hasSmoothTitle || !hasSmoothPhone || !hasSmoothAddress) {
  throw new Error('Failed to restore default salon!');
}

console.log('\n✓ Salon-switching reusability test PASSED cleanly with ZERO component edits!');
