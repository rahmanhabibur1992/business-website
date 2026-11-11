"use client";

import React from "react";
import Link from "next/link";
import { ChessPiece } from "./ChessPiece";
import { PROCESS_STAGES, ProcessStage } from "@/lib/academy-content";

interface ProcessSectionProps {
  stages?: ProcessStage[];
}

export function ProcessSection({ stages = PROCESS_STAGES }: ProcessSectionProps) {

  return (
    <section
      id="cta-assessment"
      className="py-20 px-4 lg:px-12 bg-surface-lowest border-y border-outline-subtle scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-high border border-primary/20 rounded text-primary text-xs font-mono uppercase mb-3">
            <span className="material-symbols-outlined text-sm">timeline</span>
            PEDAGOGY LIFECYCLE
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-on-surface">
            Master Progression Framework
          </h2>
          <p className="text-sm text-on-surface-variant mt-2">
            A structured, sequential four-stage trajectory transforming motivated learners into FIDE-ranked competitive masters.
          </p>
        </div>

        {/* 4-Step Strip */}
        <div className="relative mb-12">
          <div className="hidden md:block process-line" aria-hidden="true">
            <div className="process-line-fill" id="process-line-fill" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10" id="process-steps-container">
            {stages.map((stage) => (
              <div
                key={stage.step}
                className="bg-surface-low md:bg-transparent p-5 md:p-2 rounded-xl border border-outline-subtle md:border-none flex flex-col items-center text-center transition-all duration-500 opacity-90 hover:opacity-100"
              >
                <div className="w-14 h-14 rounded-full bg-surface-high border-2 border-primary/50 text-[var(--chess-accent)] flex items-center justify-center shadow-lg mb-4">
                  <div className="w-7 h-7">
                    <ChessPiece piece={stage.piece} />
                  </div>
                </div>
                <span
                  className={`font-mono text-xs font-bold tracking-widest uppercase ${
                    stage.step === "01" || stage.step === "03" ? "text-primary" : "text-secondary"
                  }`}
                >
                  Stage {stage.step} • {stage.code}
                </span>
                <h3 className="font-display text-lg font-bold text-on-surface mt-1">{stage.title}</h3>
                <p className="text-xs text-on-surface-variant mt-2 max-w-xs leading-relaxed">
                  {stage.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Final Call to Action Strip */}
        <div className="bg-gradient-to-r from-surface-low via-surface-container to-surface-low border border-primary/30 rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">
              Ready to promote your game?
            </h3>
            <p className="text-sm text-on-surface-variant max-w-lg">
              Take the first step across the board. Our senior trainers conduct a comprehensive diagnostic assessment before batch allotment.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/classes"
              className="px-6 py-3.5 bg-primary text-on-primary font-mono text-xs uppercase tracking-wider font-bold rounded-lg hover:opacity-90 transition-all shadow-[0_0_20px_rgba(242,202,80,0.3)] flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Classes</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
