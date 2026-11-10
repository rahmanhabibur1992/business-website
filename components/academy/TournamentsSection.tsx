"use client";

import React from "react";
import { HoverCard } from "./HoverCard";
import { useEnquiryModal } from "./EnquiryContext";
import { TOURNAMENTS_DATA, TournamentEvent } from "@/lib/academy-content";

interface TournamentsSectionProps {
  tournaments?: TournamentEvent[];
}

export function TournamentsSection({ tournaments = TOURNAMENTS_DATA }: TournamentsSectionProps) {
  const { openModal } = useEnquiryModal();
  const visibleTournaments = tournaments.filter((t) => t.visible !== false);
  const count = visibleTournaments.length;

  return (
    <section
      id="tournaments"
      className="w-full py-20 px-4 lg:px-12 border-b border-outline-subtle bg-surface-lowest scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col gap-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Online Tournament Circuit</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-on-surface">
            Rated Arena Battles &amp; Master Analysis
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            Every student competes in regular rated online arenas with live GM commentary, engine analysis briefs, and FIDE-style psychological pressure training.
          </p>
        </div>

        {/* Adaptive Tournaments Grid */}
        <div
          className={`grid gap-8 ${
            count === 1
              ? "grid-cols-1 max-w-xl mx-auto w-full"
              : count === 2
              ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto w-full"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {visibleTournaments.map((evt) => {
            const statusLabel = evt.statusLabel || evt.statusBadge?.label || "Online Arena";
            const statusTone = evt.statusTone || evt.statusBadge?.style || "live";
            const ctaType = evt.ctaType || (evt.action?.href ? "link" : "register");
            const ctaLabel = evt.ctaLabel || evt.action?.label || "Register Seat";
            const ctaUrl = evt.ctaUrl || evt.action?.href;

            return (
              <HoverCard
                key={evt.id}
                cornerPiece="rook"
                className="bg-surface rounded-xl p-6 sm:p-8 border border-outline-subtle flex flex-col justify-between gap-6"
              >
                <div className="flex flex-col gap-4 relative z-10">
                  {/* Status & Platform */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-xs font-bold uppercase tracking-wider ${
                        statusTone === "live"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : statusTone === "upcoming"
                          ? "bg-primary/15 text-primary border border-primary/30"
                          : "bg-surface-high text-on-surface-variant border border-outline-subtle"
                      }`}
                    >
                      {statusTone === "live" && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      )}
                      <span>{statusLabel}</span>
                    </span>

                    <span className="px-2 py-0.5 rounded bg-surface-high text-on-surface-variant font-mono text-xs">
                      {evt.platform || "Online Arena"}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-on-surface">
                      {evt.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>

                  {/* Format & Time Specs */}
                  <div className="space-y-2 py-3 border-y border-outline-subtle font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant">Format:</span>
                      <span className="text-on-surface font-semibold">{evt.format}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant">Time Control:</span>
                      <span className="text-primary font-semibold">{evt.timeControl}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant">Schedule:</span>
                      <span className="text-on-surface font-semibold">{evt.dayTime}</span>
                    </div>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-2 relative z-10">
                  {ctaType === "link" && ctaUrl ? (
                    <a
                      href={ctaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-primary text-on-primary font-mono text-xs uppercase tracking-wider font-bold rounded hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(242,202,80,0.2)]"
                    >
                      <span>{ctaLabel}</span>
                      <span className="material-symbols-outlined text-base">open_in_new</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="w-full py-2.5 bg-surface-high border border-outline-subtle hover:border-primary text-on-surface hover:text-primary font-mono text-xs uppercase tracking-wider font-bold rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      onClick={(e) =>
                        openModal(
                          `tournament-${evt.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
                          e.currentTarget
                        )
                      }
                    >
                      <span>{ctaLabel}</span>
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </button>
                  )}
                </div>
              </HoverCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
