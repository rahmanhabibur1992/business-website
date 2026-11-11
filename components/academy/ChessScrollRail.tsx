"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { ChessPiece } from "./ChessPiece";
import {
  useActiveSection,
  TRACKED_SECTIONS,
} from "./ActiveSectionContext";

export function ChessScrollRail() {
  const {
    activeRankIdx,
    progressFraction,
    isPromoted,
    isMobilePromoted,
    scrollToSection,
  } = useActiveSection();

  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ridingPieceRef = useRef<HTMLDivElement | null>(null);

  const updateRidingPosition = useCallback(() => {
    const targetStep = stepRefs.current[activeRankIdx];
    if (targetStep && ridingPieceRef.current) {
      ridingPieceRef.current.style.top = `${targetStep.offsetTop + 3}px`;
    }
  }, [activeRankIdx]);

  useEffect(() => {
    updateRidingPosition();

    if (activeRankIdx === TRACKED_SECTIONS.length - 1 && ridingPieceRef.current) {
      ridingPieceRef.current.classList.add("promote-pop");
      const timer = setTimeout(() => {
        ridingPieceRef.current?.classList.remove("promote-pop");
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [activeRankIdx, updateRidingPosition]);

  useEffect(() => {
    window.addEventListener("resize", updateRidingPosition);
    return () => window.removeEventListener("resize", updateRidingPosition);
  }, [updateRidingPosition]);

  return (
    <>
      {/* MOBILE HORIZONTAL PROGRESS BAR (<1024px) - sits flush under header with its own 20px strip */}
      <div
        aria-hidden="true"
        className="lg:hidden fixed left-0 w-full h-5 bg-surface-lowest/90 backdrop-blur-md border-b border-outline-subtle/50 z-30 pointer-events-none flex items-center px-2"
        style={{ top: "var(--header-h, 4rem)" }}
      >
        <div className="relative w-full h-[2px] bg-[var(--rail-ink-line)]">
          <div
            id="mobile-progress-bar"
            className="h-full bg-[var(--chess-accent)] relative transition-all duration-150"
            style={{ width: `${Math.max(4, Math.min(100, progressFraction * 100))}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 text-[var(--chess-accent)] filter drop-shadow flex items-center justify-center">
              <ChessPiece
                piece={isMobilePromoted ? "queen" : "pawn"}
                className="w-3.5 h-3.5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP VERTICAL SCROLL PROGRESS RAIL (>=1024px only) */}
      <aside
        id="chess-scroll-rail"
        aria-label="Page scroll progress by chess rank"
        className="!hidden lg:!flex"
      >
        <div className="rail-track-line" />

        {/* Riding Piece (Pawn travels down from Rank 1 and promotes to Queen at Rank 8) */}
        <div
          id="rail-riding-piece"
          ref={ridingPieceRef}
          aria-hidden="true"
          style={{ top: "6px" }}
        >
          <div className="w-6 h-6">
            <ChessPiece
              piece={isPromoted ? "queen" : "pawn"}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* 8 Ranks (Rank 1 top to Rank 8 bottom) */}
        {TRACKED_SECTIONS.map((sec, renderIdx) => {
          const isActive = activeRankIdx === renderIdx;

          return (
            <div
              key={sec.id}
              ref={(el) => {
                stepRefs.current[renderIdx] = el;
              }}
              className={`rail-step ${isActive ? "active" : ""}`}
              data-target={sec.id}
              onClick={() => scrollToSection(sec.id)}
            >
              <div className="rail-square">{sec.rank}</div>
              <div className="rail-tooltip">{sec.name}</div>
            </div>
          );
        })}
      </aside>
    </>
  );
}
