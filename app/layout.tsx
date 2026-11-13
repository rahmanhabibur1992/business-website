import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AdminAuthProvider } from "@/lib/auth-context";
import { WhatsAppFloatingButton } from "@/components/academy/WhatsAppFloatingButton";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#0c0e14",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rahmanchess.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "RAHMAN CHESS ACADEMY | Master Mentorship & FIDE Apprenticeship",
  description:
    "Elite international pedagogical institution providing structured FIDE titled development, neural engine training, and Master apprenticeships. 100% Online.",
  icons: {
    icon: [
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "RAHMAN CHESS ACADEMY | Master Mentorship & FIDE Apprenticeship",
    description:
      "Structured syllabi from basic pawn fundamentals to master-level prophylactic calculations. Personalized 1-on-1 coaching, weekend Blitz arena tournaments, and engine-augmented review. 100% Online.",
    siteName: "Rahman Chess Academy",
    locale: "en_US",
    type: "website",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Rahman Chess Academy",
  url: siteUrl,
  description:
    "Elite international pedagogical institution providing structured FIDE titled development, neural engine training, and Master apprenticeships. 100% Online.",
  telephone: "+917200051588",
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Worldwide (Online)",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${manrope.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        <script type="application/ld+json">
          {JSON.stringify(orgJsonLd)}
        </script>
      </head>
      <body className="min-h-full flex flex-col font-body antialiased selection:bg-primary selection:text-on-primary">
        <AdminAuthProvider>
          {children}
          <WhatsAppFloatingButton />
        </AdminAuthProvider>
      </body>
    </html>
  );
}
