"use client";

import React from "react";
import Link from "next/link";
import { HeroChessBackground } from "./HeroChessBackground";
import { HeroTag, SEED_HERO_TAGS } from "@/lib/academy-content";

interface HeroSectionProps {
  tags?: HeroTag[];
}

export function HeroSection({ tags = SEED_HERO_TAGS }: HeroSectionProps) {

  return (
    <section
      id="hero"
      className="relative isolate w-full min-h-[620px] lg:min-h-[680px] pt-24 pb-16 lg:py-24 px-4 lg:px-12 overflow-hidden border-b border-outline-subtle bg-gradient-to-b from-surface-lowest via-surface to-surface-low scroll-mt-28"
    >
      {/* Decorative animated dynamic chessboard field */}
      <HeroChessBackground />

      {/* Radiant ambient blur spots */}
      <div className="absolute -top-32 right-1/4 w-[550px] h-[550px] bg-primary/10 rounded-full blur-[140px] pointer-events-none z-[1]" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none z-[1]" />

      <div className="max-w-7xl mx-auto w-full relative z-10 flex items-center min-h-[460px] lg:min-h-[480px]">
        {/* Hero Copy Column */}
        <div className="hero-copy flex flex-col gap-6">
          <div className="space-y-3">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-on-surface leading-[1.1]">
              Build a{" "}
              <span className="text-primary relative inline-block underline decoration-primary/40 underline-offset-8">
                Champion’s Mind,
              </span>{" "}
              <br/>
              One Move at a Time.
              {/* Build a Champion’s Mind, One Move at a Time. */}
            </h1>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-xl leading-relaxed pt-1">
              Structured syllabi from basic pawn fundamentals to master-level prophylactic calculations. Personalized 1-on-1 coaching, weekend Blitz arena tournaments, and engine-augmented review.             </p>
          </div>

          {/* Value Highlights Pill Row (Dynamic from Firestore with fallback) */}
          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-high/60 border border-outline-subtle text-on-surface"
              >
                <span
                  className={`material-symbols-outlined text-sm ${
                    tag.tone === "secondary" ? "text-secondary" : "text-primary"
                  }`}
                >
                  {tag.icon}
                </span>
                <span>{tag.label}</span>
              </div>
            ))}
          </div>

          {/* CTA Group */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/classes"
              className="px-6 py-3.5 bg-primary text-on-primary font-mono text-xs uppercase tracking-wider font-bold rounded-lg hover:opacity-90 transition-all shadow-[0_0_20px_rgba(242,202,80,0.3)] flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Classes</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
            <Link
              className="px-5 py-3.5 bg-surface-high border border-outline-subtle hover:border-primary/60 text-on-surface font-mono text-xs uppercase tracking-wider font-bold rounded-lg transition-colors flex items-center gap-2"
              href="/#classes"
            >
              <span className="material-symbols-outlined text-base text-secondary">explore</span>
              <span>Explore Programs</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
