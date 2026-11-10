import type { Metadata } from "next";
import { getAllPublicContent } from "@/lib/content-service";
import { EnquiryProvider } from "@/components/academy/EnquiryContext";
import { ActiveSectionProvider } from "@/components/academy/ActiveSectionContext";
import { ChessPieceSpriteDefs } from "@/components/academy/ChessPiece";
import { ChessScrollRail } from "@/components/academy/ChessScrollRail";
import { SiteHeader } from "@/components/academy/SiteHeader";
import { HeroSection } from "@/components/academy/HeroSection";
import { ClassesSection } from "@/components/academy/ClassesSection";
import { CoachesSection } from "@/components/academy/CoachesSection";
import { TournamentsSection } from "@/components/academy/TournamentsSection";
import { GallerySection } from "@/components/academy/GallerySection";
import { TestimonialsSection } from "@/components/academy/TestimonialsSection";
import { ProcessSection } from "@/components/academy/ProcessSection";
import { SiteFooter } from "@/components/academy/SiteFooter";
import { EnquiryModal } from "@/components/academy/EnquiryModal";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rahmanchess.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "RAHMAN CHESS ACADEMY | Grandmaster Mentorship & FIDE Apprenticeship",
  description:
    "Elite international pedagogical institution providing structured FIDE titled development, neural engine training, and Grandmaster apprenticeships. 100% Online.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "RAHMAN CHESS ACADEMY | Grandmaster Mentorship & FIDE Apprenticeship",
    description:
      "Structured syllabi from basic pawn fundamentals to master-level prophylactic calculations. Personalized 1-on-1 coaching, weekend Blitz arena tournaments, and engine-augmented review. 100% Online.",
    url: siteUrl,
    siteName: "Rahman Chess Academy",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RAHMAN CHESS ACADEMY | Grandmaster Mentorship & FIDE Apprenticeship",
    description:
      "Structured syllabi from basic pawn fundamentals to master-level prophylactic calculations. Personalized 1-on-1 coaching, weekend Blitz arena tournaments, and engine-augmented review. 100% Online.",
  },
};

export default async function HomePage() {
  const content = await getAllPublicContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "Rahman Chess Academy",
        url: siteUrl,
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
        name: "Online Chess Courses",
        itemListElement: content.classes.map((c, idx) => ({
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
      ...content.coaches.map((coach) => ({
        "@type": "Person",
        name: coach.name,
        jobTitle: coach.roleLine || coach.role,
        image: coach.imageUrl || coach.image,
        worksFor: {
          "@type": "EducationalOrganization",
          name: "Rahman Chess Academy",
          url: siteUrl,
        },
      })),
    ],
  };

  return (
    <EnquiryProvider>
      <ActiveSectionProvider>
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
        <ChessPieceSpriteDefs />
        {/* Scroll rail renders only on homepage */}
        <ChessScrollRail />
        {/* <TopBar /> */}
        <SiteHeader />
        <main className="w-full">
          <HeroSection tags={content.heroTags} />
          <ClassesSection
            classes={content.classes}
            sectionContent={content.classesSection}
          />
          <CoachesSection coaches={content.coaches} />
          <TournamentsSection tournaments={content.tournaments} />
          <GallerySection posts={content.gallery} />
          <TestimonialsSection testimonials={content.testimonials} />
          <ProcessSection />
        </main>
        <SiteFooter />
        <EnquiryModal />
      </ActiveSectionProvider>
    </EnquiryProvider>
  );
}
