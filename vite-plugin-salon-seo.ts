import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { smoothCutSalon } from './src/config/salons/smooth-cut-hair-studio.ts';
import { templateSalon } from './src/config/salons/template-salon.ts';
import type { SalonConfig } from './src/config/schema.ts';

export function vitePluginSalonSeo(): Plugin {
  const activeId = process.env.VITE_ACTIVE_SALON || 'smooth-cut-hair-studio';
  const salon: SalonConfig = activeId === 'template-salon' ? templateSalon : smoothCutSalon;

  // Build verified JSON-LD (strictly verified fields only per Section 2)
  const jsonLdData: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': salon.seo.schemaType || 'HairSalon',
    name: salon.identity.businessName,
    description: salon.seo.metaDescription,
    url: salon.seo.canonicalUrl,
    telephone: salon.contact.phoneTel,
    address: {
      '@type': 'PostalAddress',
      streetAddress: salon.contact.addressLines.join(', '),
      addressLocality: salon.contact.city,
      addressRegion: salon.contact.province,
      postalCode: salon.contact.postalCode,
      addressCountry: salon.contact.countryCode,
    },
  };

  if (salon.rating.showRating && salon.rating.ratingCount > 0) {
    jsonLdData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: salon.rating.ratingValue.toString(),
      reviewCount: salon.rating.ratingCount.toString(),
      bestRating: '5',
      worstRating: '1',
    };
  }

  // Generate robots.txt
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${salon.seo.canonicalUrl}/sitemap.xml
`;

  // Generate sitemap.xml
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${salon.seo.canonicalUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

  return {
    name: 'vite-plugin-salon-seo',
    buildStart() {
      // Write robots.txt and sitemap.xml to public folder
      const publicDir = path.resolve(process.cwd(), 'public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf-8');
      fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');
    },
    transformIndexHtml(html) {
      const colors = salon.theme.colors;
      const themeCssVars = `
    :root {
      --color-bg-dark: ${colors.bgDark};
      --color-bg-dark-elevated: ${colors.bgDarkElevated};
      --color-surface-dark: ${colors.surfaceDark};
      --color-border-dark: ${colors.borderDark};
      --color-text-dark: ${colors.textDark};
      --color-text-dark-muted: ${colors.textDarkMuted};

      --color-bg-light: ${colors.bgLight};
      --color-bg-light-elevated: ${colors.bgLightElevated};
      --color-surface-light: ${colors.surfaceLight};
      --color-border-light: ${colors.borderLight};
      --color-text-light: ${colors.textLight};
      --color-text-light-muted: ${colors.textLightMuted};

      --color-accent-gold: ${colors.accentGold};
      --color-accent-gold-hover: ${colors.accentGoldHover};
      --color-accent-bronze: ${colors.accentBronze};
      --color-accent-bronze-hover: ${colors.accentBronzeHover};
      --color-bronze-text: #5C4028;
      --color-focus-ring: ${colors.focusRing};
      --color-success: ${colors.success};
      --color-warning: ${colors.warning};
    }
    body {
      background-color: ${colors.bgDark};
      color: ${colors.textDark};
    }
  `;

      const headInjections = `
    <title>${salon.seo.metaTitle}</title>
    <meta name="description" content="${salon.seo.metaDescription}" />
    <meta name="keywords" content="${salon.seo.keywords.join(', ')}" />
    <meta name="geo.region" content="PK-PB" />
    <meta name="geo.placename" content="${salon.contact.city}, ${salon.contact.province}" />
    <link rel="canonical" href="${salon.seo.canonicalUrl}/" />
    <meta name="theme-color" content="${colors.bgDark}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${salon.seo.metaTitle}" />
    <meta property="og:description" content="${salon.seo.metaDescription}" />
    <meta property="og:url" content="${salon.seo.canonicalUrl}/" />
    <meta property="og:image" content="${salon.seo.canonicalUrl}${salon.seo.ogImage}" />
    <meta property="og:locale" content="${salon.seo.locale}" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${salon.seo.metaTitle}" />
    <meta name="twitter:description" content="${salon.seo.metaDescription}" />
    <meta name="twitter:image" content="${salon.seo.canonicalUrl}${salon.seo.ogImage}" />

    <!-- Structured Data JSON-LD -->
    <script type="application/ld+json">
${JSON.stringify(jsonLdData, null, 2)}
    </script>

    <!-- Theme Variables (Applied before first paint to prevent FOUC) -->
    <style id="salon-theme-tokens">
${themeCssVars}
    </style>
  `;

      // Replace default title and insert metadata
      return html
        .replace(/<title>.*?<\/title>/, '')
        .replace('</head>', `${headInjections}\n  </head>`);
    },
  };
}
