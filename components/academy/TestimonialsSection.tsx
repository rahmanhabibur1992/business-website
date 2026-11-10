import React from "react";
import { TESTIMONIALS_DATA, TestimonialItem } from "@/lib/academy-content";

interface TestimonialsSectionProps {
  testimonials?: TestimonialItem[];
}

export function TestimonialsSection({
  testimonials = TESTIMONIALS_DATA,
}: TestimonialsSectionProps) {
  const visibleReviews = testimonials.filter((t) => t.visible !== false);

  return (
    <section
      id="testimonials"
      className="w-full py-20 px-4 lg:px-12 border-b border-outline-subtle bg-surface-lowest scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col gap-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Verified Student Reviews</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-on-surface">
            Proven Rating Gains &amp; Composure Under Pressure
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            Real outcomes from parents, titled contenders, and ambitious youth developing their chess careers through our 100% online mentorship cohorts.
          </p>
        </div>

        {/* 3-Column Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleReviews.map((item) => {
            const authorName = item.name || item.author;
            const authorRole = item.relation || item.role;
            const cohortLabel = item.classLabel || item.cohort;
            const starCount = item.rating || item.stars || 5;
            const showConsent = item.consentConfirmed ?? (item.consentBadge === "Consent Confirmed");

            return (
              <div
                key={item.id}
                className="bg-surface rounded-xl p-6 sm:p-8 border border-outline-subtle flex flex-col justify-between gap-6 hover:border-primary/40 transition-colors"
              >
                <div className="space-y-4">
                  {/* Rating Stars & Consent Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-0.5 text-primary">
                      {Array.from({ length: starCount }).map((_, idx) => (
                        <span
                          key={idx}
                          className="material-symbols-outlined text-base fill-1"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                      ))}
                    </div>
                    {showConsent && (
                      <span className="px-2 py-0.5 rounded bg-surface-high text-on-surface-variant font-mono text-[10px] border border-outline-subtle">
                        Consent Confirmed
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-on-surface-variant italic leading-relaxed">
                    {item.quote}
                  </p>
                </div>

                <div className="pt-4 border-t border-outline-subtle flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold text-on-surface">
                      {authorName}
                    </h4>
                    <div className="text-[11px] text-on-surface-variant font-mono mt-0.5">
                      {authorRole}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-high text-secondary">
                    {cohortLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
