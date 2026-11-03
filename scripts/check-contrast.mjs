/**
 * WCAG 2.2 Color Contrast Calculator & Automated Verification Script
 */

function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function getLuminance({ r, g, b }) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(hex1, hex2) {
  const lum1 = getLuminance(hexToRgb(hex1));
  const lum2 = getLuminance(hexToRgb(hex2));
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

const pairings = [
  // Dark section text pairings
  { name: 'Dark Section: Primary Text on Dark BG', fg: '#F5F0E8', bg: '#0F0F10', target: 4.5 },
  { name: 'Dark Section: Primary Text on Elevated Surface', fg: '#F5F0E8', bg: '#161618', target: 4.5 },
  { name: 'Dark Section: Muted Text on Dark BG', fg: '#A8A39D', bg: '#0F0F10', target: 4.5 },
  { name: 'Dark Section: Champagne Gold on Dark BG', fg: '#C9A96E', bg: '#0F0F10', target: 4.5 },
  { name: 'Dark Section: Champagne Gold on Elevated Surface', fg: '#C9A96E', bg: '#161618', target: 4.5 },
  { name: 'Dark Section: Success Green on Dark BG', fg: '#4ADE80', bg: '#0F0F10', target: 4.5 },
  { name: 'Dark Section: Amber Warning on Dark BG', fg: '#FBBF24', bg: '#0F0F10', target: 4.5 },

  // Light section text pairings
  { name: 'Light Section: Primary Text on Light BG', fg: '#1C1C1E', bg: '#F5F0E8', target: 4.5 },
  { name: 'Light Section: Primary Text on Light Surface', fg: '#1C1C1E', bg: '#ECE6DC', target: 4.5 },
  { name: 'Light Section: Muted Text on Light BG', fg: '#57534E', bg: '#F5F0E8', target: 4.5 },
  { name: 'Light Section: Dedicated Bronze Text on Light BG', fg: '#5C4028', bg: '#F5F0E8', target: 4.5 },
  { name: 'Light Section: Dedicated Bronze Text on Light Surface', fg: '#5C4028', bg: '#ECE6DC', target: 4.5 },

  // Interactive buttons / badges
  { name: 'Primary Button: Dark Charcoal Text on Champagne Gold', fg: '#0F0F10', bg: '#C9A96E', target: 4.5 },
  { name: 'Badge: Off-white Text on Dark Surface', fg: '#F5F0E8', bg: '#2A2A2D', target: 4.5 },
];

let failed = false;
console.log('=== WCAG 2.2 AA Contrast Verification Report ===\n');

pairings.forEach(p => {
  const ratio = getContrastRatio(p.fg, p.bg);
  const passed = ratio >= p.target;
  const grade = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'FAIL';
  console.log(
    `${passed ? '✓ PASS' : '✗ FAIL'} [${grade}] (${ratio.toFixed(2)}:1, req >= ${p.target}:1) - ${p.name}`
  );
  if (!passed) {
    failed = true;
  }
});

if (failed) {
  console.error('\nOne or more color pairings failed WCAG 2.2 AA contrast requirement (4.5:1)!');
  process.exit(1);
} else {
  console.log('\nAll color pairings passed WCAG 2.2 AA contrast requirements (>= 4.5:1)!');
}
