import '../styles/globals.css';
import { Metadata } from 'next';
import Image from 'next/image';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'SanCor Salud - Cobertura Médica | +800.000 Afiliados en Argentina',
    template: '%s | SanCor Salud',
  },
  description:
    'SanCor Salud: Más de 800.000 afiliados confían en nosotros. Cobertura médica completa con +5.000 centros médicos, emergencias 24/7, sin coseguros. Afiliación flexible para monotributistas, empleados y particulares.',
  keywords: [
    'sancor salud',
    'prepaga sancor',
    'asociacion mutual sancor salud',
    'cobertura médica argentina',
    'plan médico',
    'medicina prepaga',
    'emergencias 24/7',
    'afiliacion flexible',
    'sin coseguros',
    'monotributista',
    'cobertura familiar',
    'planes empresariales',
    'centros médicos argentina',
    'ortodoncia',
    'consultas virtuales',
  ],
  authors: [{ name: 'SanCor Salud' }],
  creator: 'SanCor Salud',
  publisher: 'Asociación Mutual SanCor Salud',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://prepagaargentina.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://prepagaargentina.com',
    title: 'SanCor Salud - +800.000 Afiliados | Cobertura Médica Integral Argentina',
    description:
      'Más de 800.000 afiliados en todo el país. Cobertura médica con +5.000 centros, emergencias 24/7, sin coseguros. Afiliación flexible para todos.',
    siteName: 'SanCor Salud',
    images: [
      {
        url: '/images/hero/heronuevafamilia.jpg',
        width: 1200,
        height: 630,
        alt: 'SanCor Salud - Cobertura Médica para toda la Familia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SanCor Salud - +800.000 Afiliados | Cobertura Médica Integral',
    description: 'Cobertura médica con +5.000 centros, emergencias 24/7, sin coseguros.',
    images: ['/images/hero/heronuevafamilia.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={roboto.className}>
      <head>
        {/* Favicon para diferentes navegadores y dispositivos */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Meta tags adicionales para mejor SEO */}
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Asociación Mutual SanCor Salud',
              alternateName: 'SanCor Salud',
              description:
                'Asociación Mutual SanCor Salud. Más de 800.000 afiliados en todo el país. Cobertura médica integral con +5.000 centros, emergencias 24/7.',
              url: 'https://prepagaargentina.com',
              logo: 'https://prepagaargentina.com/images/sancor-new.png',
              image: 'https://prepagaargentina.com/images/hero/heronuevafamilia.jpg',
              telephone: '0800-222-SALUD',
              email: 'info@sancorsalud.com.ar',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '25 de mayo 201',
                addressLocality: 'Sunchales',
                addressRegion: 'Santa Fe',
                addressCountry: 'AR',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.5',
                reviewCount: '800000',
              },
              sameAs: [
                'https://www.sancorsalud.com.ar',
                'https://www.facebook.com/sancorsalud',
                'https://www.instagram.com/sancorsalud',
                'https://www.linkedin.com/company/sancor-salud',
              ],
              service: {
                '@type': 'MedicalBusiness',
                name: 'Cobertura Médica Integral',
                description:
                  'Planes médicos para familias, monotributistas y empresas. +5.000 centros médicos, emergencias 24/7, sin coseguros.',
                provider: {
                  '@type': 'Organization',
                  name: 'SanCor Salud',
                  legalName: 'Asociación Mutual SanCor Salud',
                },
                areaServed: {
                  '@type': 'Country',
                  name: 'Argentina',
                },
                hasOfferCatalog: {
                  '@type': 'OfferCatalog',
                  name: 'Planes de Salud',
                  itemListElement: [
                    {
                      '@type': 'Offer',
                      itemOffered: {
                        '@type': 'Service',
                        name: 'Plan Familiar',
                        description: 'Cobertura médica completa para toda la familia',
                      },
                    },
                    {
                      '@type': 'Offer',
                      itemOffered: {
                        '@type': 'Service',
                        name: 'Plan Empresarial',
                        description: 'Cobertura médica para empresas y empleados',
                      },
                    },
                    {
                      '@type': 'Offer',
                      itemOffered: {
                        '@type': 'Service',
                        name: 'Plan Monotributista',
                        description: 'Cobertura flexible para monotributistas',
                      },
                    },
                  ],
                },
              },
            }),
          }}
        />
      </head>
      <body className="page-background">
        {children}

        {/* Botón flotante de WhatsApp */}
        <a
          href="https://wa.me/543513817823?text=Hola,%20me%20interesa%20conocer%20más%20sobre%20los%20planes%20de%20Prepaga%20Argentina"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-float animate-pulse"
          aria-label="Contactar por WhatsApp"
        >
          <Image src="/images/whapp.png" alt="WhatsApp" width={60} height={60} priority />
        </a>
      </body>
    </html>
  );
}
