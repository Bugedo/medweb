import '../styles/globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prepaga Argentina',
  description:
    'La mejor cobertura médica para tu familia. Sin carencias, atención 24/7 en todo el país.',
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
    <html lang="es">
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
      </head>
      <body>
        {children}

        {/* Botón flotante de WhatsApp */}
        <a
          href="https://wa.me/543513817823?text=Hola,%20me%20interesa%20conocer%20más%20sobre%20los%20planes%20de%20Prepaga%20Argentina"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-float animate-pulse"
          aria-label="Contactar por WhatsApp"
        >
          <img src="/images/whapp.png" alt="WhatsApp" />
        </a>
      </body>
    </html>
  );
}
