import { Suspense } from "react";
import type { Metadata } from "next";
import { getClasses, getClassesSection } from "@/lib/content-service";
import { TopBar } from "@/components/academy/TopBar";
import { SiteHeader } from "@/components/academy/SiteHeader";
import { SiteFooter } from "@/components/academy/SiteFooter";
import { EnquiryModal } from "@/components/academy/EnquiryModal";
import { EnquiryProvider } from "@/components/academy/EnquiryContext";
import { ChessPieceSpriteDefs } from "@/components/academy/ChessPiece";
import { ClassesClientPage } from "./ClassesClientPage";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rahmanchess.com";

export const metadata: Metadata = {
  title: "Online Chess Classes & Curriculums | Rahman Chess Academy",
  description:
    "Explore structured online chess curriculum tracks from beginner tactics to master-level prophylactic calculations. 100% online master apprenticeship.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/classes",
  },
  openGraph: {
    title: "Online Chess Classes & Curriculums | Rahman Chess Academy",
    description:
      "Structured FIDE syllabi, master repertoire development, and 1-on-1 coaching for ambitious chess players worldwide.",
    url: `${siteUrl}/classes`,
    siteName: "Rahman Chess Academy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Chess Classes & Curriculums | Rahman Chess Academy",
    description:
      "Structured FIDE syllabi, master repertoire development, and 1-on-1 coaching for ambitious chess players worldwide.",
  },
};

export default async function ClassesPage() {
  const [classes, sectionContent] = await Promise.all([
    getClasses(true),
    getClassesSection(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Classes",
            item: `${siteUrl}/classes`,
          },
        ],
      },
      {
        "@type": "EducationalOrganization",
        name: "Rahman Chess Academy",
        url: siteUrl,
        telephone: "+917200051588",
        areaServed: {
          "@type": "AdministrativeArea",
          name: "Worldwide (Online)",
        },
      },
      {
        "@type": "ItemList",
        name: "Online Chess Classes",
        itemListElement: classes.map((c, idx) => ({
          "@type": "Course",
          position: idx + 1,
          name: c.title,
          description: c.description,
          courseMode: "online",
          provider: {
            "@type": "EducationalOrganization",
            name: "Rahman Chess Academy",
            url: siteUrl,
          },
        })),
      },
    ],
  };

  return (
    <EnquiryProvider>
      <ChessPieceSpriteDefs />
      <TopBar />
      <SiteHeader />
      <main className="w-full">
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
        <Suspense
          fallback={
            <div className="min-h-screen bg-surface-lowest p-12 text-center font-mono text-sm text-on-surface-variant">
              Loading syllabus tracks...
            </div>
          }
        >
          <ClassesClientPage classes={classes} sectionContent={sectionContent} />
        </Suspense>
      </main>
      <SiteFooter />
      <EnquiryModal />
    </EnquiryProvider>
  );
}
