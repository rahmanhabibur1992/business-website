"use client";

import React from "react";
import Link from "next/link";
import { HoverCard } from "./HoverCard";
import {
  CLASSES_DATA,
  SEED_CLASSES_SECTION,
  ClassTrack,
  ClassesSectionContent,
} from "@/lib/academy-content";

interface ClassesSectionProps {
  classes?: ClassTrack[];
  sectionContent?: ClassesSectionContent;
}

export function ClassesSection({
  classes = CLASSES_DATA,
  sectionContent = SEED_CLASSES_SECTION,
}: ClassesSectionProps) {
  const visibleClasses = classes.filter((c) => c.visible !== false);

  return (
    <section
      id="classes"
      className="w-full py-20 px-4 lg:px-12 border-b border-outline-subtle bg-surface-lowest scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col gap-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>{sectionContent.pillLabel}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-on-surface">
            {sectionContent.heading}
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            {sectionContent.description}
          </p>
        </div>

        {/* 2-Column Class Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {visibleClasses.map((track) => {
            const perkText = track.perks;
            const classSlug = track.slug || track.id;

            return (
              <HoverCard
                key={track.id}
                cornerPiece="pawn"
                className="bg-surface rounded-xl p-6 sm:p-8 border border-outline-subtle flex flex-col justify-between gap-6"
              >
                <div className="flex flex-col gap-4 relative z-10">
                  {/* Card Header Pills */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded font-mono text-xs font-bold uppercase tracking-wider ${
                          track.levelTone === "secondary"
                            ? "bg-secondary/15 text-secondary border border-secondary/30"
                            : "bg-primary/15 text-primary border border-primary/30"
                        }`}
                      >
                        {track.level}
                      </span>
                      {track.badge && (
                        <span className="px-2.5 py-1 rounded bg-surface-high text-on-surface-variant font-mono text-xs border border-outline-subtle">
                          {track.badge}
                        </span>
                      )}
                    </div>
                    <span className="px-2 py-0.5 rounded bg-surface-high text-on-surface-variant font-mono text-xs uppercase">
                      Mode: {track.mode || "Online"}
                    </span>
                  </div>

                  {/* Title & Rating */}
                  <div>
                    <div className="text-xs font-mono text-secondary mb-1">
                      {track.ratingLabel || track.ratingRange}
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-on-surface">
                      {track.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {track.description}
                  </p>

                  {/* 4 Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-3 border-y border-outline-subtle font-mono text-xs">
                    <div>
                      <div className="text-[10px] text-on-surface-variant uppercase">Duration</div>
                      <div className="text-on-surface font-semibold">{track.duration}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-on-surface-variant uppercase">Session</div>
                      <div className="text-on-surface font-semibold">{track.sessionLength}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-on-surface-variant uppercase">Batch Size</div>
                      <div className="text-on-surface font-semibold">{track.batchSize}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-on-surface-variant uppercase">Schedule</div>
                      <div className="text-on-surface font-semibold">{track.schedule}</div>
                    </div>
                  </div>

                  {/* Syllabus Modules List */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-mono uppercase text-secondary font-semibold tracking-wider">
                      Core Syllabus Modules
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-on-surface-variant">
                      {track.modules.map((mod, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px] text-primary">
                            check_circle
                          </span>
                          <span>{mod}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Optional Perks Line & Link to /classes */}
                <div className="pt-4 border-t border-outline-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                  <div className="min-h-[20px]">
                    {perkText && (
                      <div className="text-xs text-on-surface-variant font-mono">
                        {perkText}
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/classes?class=${classSlug}`}
                    className="px-5 py-2.5 bg-primary text-on-primary font-mono text-xs uppercase tracking-wider font-bold rounded hover:opacity-90 transition-all shadow-[0_0_15px_rgba(242,202,80,0.2)] flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <span>Enroll / Enquire</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </Link>
                </div>
              </HoverCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
