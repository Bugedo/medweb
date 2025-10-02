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
    default: 'Prepaga Argentina - Cobertura Médica Premium Sin Carencias',
    template: '%s | Prepaga Argentina',
  },
  description:
    'Prepaga Argentina ofrece la mejor cobertura médica para familias y empresas. Sin carencias, atención 24/7, más de 200.000 profesionales. Planes empresariales y familiares.',
  keywords: [
    'prepaga argentina',
    'cobertura médica',
    'plan médico',
    'seguro médico',
    'atención médica 24/7',
    'planes empresariales',
    'cobertura familiar',
    'sin carencias',
    'red médica',
    'emergencias médicas',
  ],
  authors: [{ name: 'Prepaga Argentina' }],
  creator: 'Prepaga Argentina',
  publisher: 'Prepaga Argentina',
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
    title: 'Prepaga Argentina - Cobertura Médica Premium Sin Carencias',
    description:
      'La mejor cobertura médica para tu familia. Sin carencias, atención 24/7 en todo el país.',
    siteName: 'Prepaga Argentina',
    images: [
      {
        url: '/images/hero/hero3.jpg',
        width: 1200,
        height: 630,
        alt: 'Prepaga Argentina - Cobertura Médica Familiar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prepaga Argentina - Cobertura Médica Premium',
    description: 'La mejor cobertura médica para tu familia. Sin carencias, atención 24/7.',
    images: ['/images/hero/hero3.jpg'],
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
              name: 'Prepaga Argentina',
              description:
                'Cobertura médica premium para familias y empresas. Sin carencias, atención 24/7.',
              url: 'https://prepagaargentina.com',
              logo: 'https://prepagaargentina.com/images/prepagaargentina.png',
              image: 'https://prepagaargentina.com/images/hero/hero3.jpg',
              telephone: '+54-11-1234-5678',
              email: 'info@prepagaargentina.com',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'AR',
                addressLocality: 'Buenos Aires',
              },
              sameAs: [
                'https://www.facebook.com/prepagaargentina',
                'https://www.instagram.com/prepagaargentina',
                'https://www.linkedin.com/company/prepagaargentina',
              ],
              service: {
                '@type': 'Service',
                name: 'Cobertura Médica',
                description: 'Planes médicos para familias y empresas con cobertura nacional',
                provider: {
                  '@type': 'Organization',
                  name: 'Prepaga Argentina',
                },
                areaServed: 'Argentina',
                availableChannel: {
                  '@type': 'ServiceChannel',
                  serviceUrl: 'https://prepagaargentina.com',
                  serviceSmsNumber: '+54-11-1234-5678',
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
