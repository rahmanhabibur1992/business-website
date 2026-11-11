"use client";

import React from "react";
import Image from "next/image";
import { HoverCard } from "./HoverCard";
import { useEnquiryModal } from "./EnquiryContext";
import { COACHES_DATA, CoachProfile } from "@/lib/academy-content";

interface CoachesSectionProps {
  coaches?: CoachProfile[];
}

export function CoachesSection({ coaches = COACHES_DATA }: CoachesSectionProps) {
  const { openModal } = useEnquiryModal();
  const visibleCoaches = coaches.filter((c) => c.visible !== false);
  const count = visibleCoaches.length;

  return (
    <section
      id="coaches"
      className="w-full py-20 px-4 lg:px-12 border-b border-outline-subtle bg-surface scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Master Faculty</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-on-surface">
              Direct Apprenticeship with Master Faculty
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Personalized master-level training, deep tactical imbalance diagnostics, and live online coaching across global time zones.
            </p>
          </div>
          <button
            type="button"
            className="px-5 py-2.5 bg-surface-high border border-outline-subtle hover:border-primary text-on-surface font-mono text-xs uppercase tracking-wider font-bold rounded transition-colors self-start md:self-auto cursor-pointer flex items-center gap-1.5"
            onClick={(e) => openModal("assessment", e.currentTarget)}
          >
            <span className="material-symbols-outlined text-base text-primary">psychology</span>
            <span>Schedule Faculty Assessment</span>
          </button>
        </div>

        {/* Adaptive Coaches Grid: 1 centered, 2 split, 3+ grid */}
        <div
          className={`grid gap-8 ${
            count === 1
              ? "grid-cols-1 max-w-md mx-auto w-full"
              : count === 2
              ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto w-full"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {visibleCoaches.map((coach) => {
            const imgSrc = coach.imageUrl || coach.image || "/images/academy/coach-levon.svg";
            const specialtiesList = coach.specialties || coach.specializations || [];
            const role = coach.roleLine || coach.role;

            return (
              <HoverCard
                key={coach.id}
                cornerPiece="king"
                className="bg-surface-low rounded-xl border border-outline-subtle overflow-hidden flex flex-col"
              >
                {/* Coach Portrait */}
                <div className="relative w-full aspect-[4/3] bg-surface-container overflow-hidden">
                  <Image
                    src={imgSrc}
                    alt={coach.imageAlt || `${coach.name} - Chess Master`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-low via-surface-low/30 to-transparent" />

                  {/* Badges Over Image */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 font-mono text-[11px]">
                    <span className="px-2.5 py-1 rounded bg-surface-lowest/85 backdrop-blur-sm border border-outline-subtle text-primary font-bold">
                      {coach.peakRating}
                    </span>
                    {coach.badge && (
                      <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-bold uppercase tracking-wider text-[10px]">
                        {coach.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Coach Info Content */}
                <div className="p-6 flex flex-col flex-1 justify-between gap-6 relative z-10">
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-mono text-secondary">{role}</div>
                      <h3 className="font-display text-xl font-bold text-on-surface mt-0.5">
                        {coach.name}
                      </h3>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                      {coach.bio}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {specialtiesList.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-surface-high text-on-surface-variant font-mono text-[11px] border border-outline-subtle"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2.5 bg-surface-high border border-outline-subtle hover:border-primary text-on-surface hover:text-primary font-mono text-xs uppercase tracking-wider font-bold rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    onClick={(e) =>
                      openModal(
                        `coach-${coach.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
                        e.currentTarget
                      )
                    }
                  >
                    <span>Book Consultation</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                </div>
              </HoverCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
