"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

export const TRACKED_SECTIONS = [
  { id: "hero", rank: 1, name: "Rank 1: Academy Sanctuary" },
  { id: "classes", rank: 2, name: "Rank 2: Structured Classes" },
  { id: "coaches", rank: 3, name: "Rank 3: Master Faculty" },
  { id: "tournaments", rank: 4, name: "Rank 4: Tournament Circuit" },
  { id: "gallery", rank: 5, name: "Rank 5: Academy Gallery" },
  { id: "testimonials", rank: 6, name: "Rank 6: Verified Reviews" },
  { id: "cta-assessment", rank: 7, name: "Rank 7: Process & Assessment" },
] as const;

export type TrackedSectionId = (typeof TRACKED_SECTIONS)[number]["id"];

interface ActiveSectionContextType {
  activeRankIdx: number; // 0..6
  activeSectionId: TrackedSectionId;
  progressFraction: number; // 0..1
  isPromoted: boolean;
  isMobilePromoted: boolean;
  scrollToSection: (id: string) => void;
  setActiveSectionManually: (id: string) => void;
}

const ActiveSectionContext = createContext<ActiveSectionContextType>({
  activeRankIdx: 0,
  activeSectionId: "hero",
  progressFraction: 0,
  isPromoted: false,
  isMobilePromoted: false,
  scrollToSection: () => {},
  setActiveSectionManually: () => {},
});

export function ActiveSectionProvider({ children }: { children: ReactNode }) {
  const [activeRankIdx, setActiveRankIdx] = useState(0);
  const [progressFraction, setProgressFraction] = useState(0);
  const [isPromoted, setIsPromoted] = useState(false);

  const lastRankIndex = TRACKED_SECTIONS.length - 1;

  const scrollToSection = useCallback((id: string) => {
    const foundIdx = TRACKED_SECTIONS.findIndex((s) => s.id === id);
    if (foundIdx >= 0) {
      setActiveRankIdx(foundIdx);
      setIsPromoted(foundIdx === lastRankIndex);
    }

    const el = document.getElementById(id);
    if (el) {
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      el.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  }, [lastRankIndex]);

  const setActiveSectionManually = useCallback((id: string) => {
    const foundIdx = TRACKED_SECTIONS.findIndex((s) => s.id === id);
    if (foundIdx >= 0) {
      setActiveRankIdx(foundIdx);
      setIsPromoted(foundIdx === lastRankIndex);
    }
  }, [lastRankIndex]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const docHeight =
            document.documentElement.scrollHeight - window.innerHeight;
          const progress = Math.max(0, Math.min(1, scrollY / (docHeight || 1)));
          setProgressFraction(progress);

          // 45% of viewport activation rule
          let currentIdx = 0;
          TRACKED_SECTIONS.forEach((sec, idx) => {
            const el = document.getElementById(sec.id);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= window.innerHeight * 0.45) {
                currentIdx = idx;
              }
            }
          });

          // Only update state if active section index changed
          setActiveRankIdx((prev) => {
            if (prev !== currentIdx) {
              setIsPromoted(currentIdx === lastRankIndex);
              return currentIdx;
            }
            return prev;
          });

          // Process line fill at 70% viewport
          const lineFill = document.getElementById("process-line-fill");
          const processSec = document.getElementById("cta-assessment");
          if (lineFill && processSec) {
            const pRect = processSec.getBoundingClientRect();
            if (pRect.top <= window.innerHeight * 0.7) {
              lineFill.style.width = "100%";
            } else {
              lineFill.style.width = "0%";
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    // Initial check
    const t = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearTimeout(t);
    };
  }, [lastRankIndex]);

  const activeSectionId = TRACKED_SECTIONS[activeRankIdx]?.id || "hero";
  const isMobilePromoted = progressFraction >= 0.92;

  return (
    <ActiveSectionContext.Provider
      value={{
        activeRankIdx,
        activeSectionId,
        progressFraction,
        isPromoted,
        isMobilePromoted,
        scrollToSection,
        setActiveSectionManually,
      }}
    >
      {children}
    </ActiveSectionContext.Provider>
  );
}

export function useActiveSection() {
  return useContext(ActiveSectionContext);
}
