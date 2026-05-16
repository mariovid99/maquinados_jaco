import type { Metadata } from "next";
import { Bebas_Neue, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/shared/LenisProvider";
import Loader from "@/components/shared/Loader";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maquinados JACO | Manufactura CNC de Precisión en Monterrey",
  description: "Diseño y fabricación de componentes industriales con precisión milimétrica. Maquinados CNC, soldadura, diseño CAD/CAM y comercialización en Monterrey, N.L. Desde una sola pieza.",
  keywords: ["maquinados CNC", "manufactura de precisión", "Monterrey", "fixtures", "soldadura industrial", "CAD CAM", "torno CNC", "fresadora CNC"],
  authors: [{ name: "Mario Vidaña" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://maquinadosjaco.com"),
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "/",
    siteName: "Maquinados JACO",
    title: "Maquinados JACO | Manufactura CNC de Precisión en Monterrey",
    description: "Diseño y fabricación de componentes industriales con precisión milimétrica en Monterrey, N.L.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maquinados JACO | Manufactura CNC de Precisión",
    description: "Manufactura industrial de precisión en Monterrey, N.L.",
  },
  alternates: {
    canonical: "/",
  },
  other: {
    "geo.region": "MX-NL",
    "geo.placename": "Monterrey",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Maquinados JACO",
  description: "Manufactura CNC de precisión en Monterrey, N.L. Maquinados, soldadura, diseño CAD/CAM y comercialización industrial.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://maquinadosjaco.com",
  telephone: "+52-81-1488-3334",
  email: "contacto@maquinadosjaco.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Fresno 2112, Col. Moderna",
    addressLocality: "Monterrey",
    addressRegion: "Nuevo León",
    postalCode: "64530",
    addressCountry: "MX",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 25.6866,
    longitude: -100.3161,
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "08:00", closes: "18:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "09:00", closes: "13:00" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicios de Manufactura",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Manufactura CNC de Precisión" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Soldadura Industrial" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Diseño CAD/CAM" } },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${bebasNeue.variable} ${inter.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Analytics 4 stub */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script dangerouslySetInnerHTML={{ __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}} />
          </>
        )}
        {/* Meta Pixel stub */}
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <script dangerouslySetInnerHTML={{ __html: `
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}} />
        )}
      </head>
      <body className="font-sans antialiased">
        <a href="#main-content" className="skip-to-content">
          Ir al contenido principal
        </a>
        <Loader />
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
