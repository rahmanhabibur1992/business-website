"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActiveSection } from "./ActiveSectionContext";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const NAV_LINKS: NavItem[] = [
  { id: "classes", label: "Classes", href: "/#classes" },
  { id: "coaches", label: "Coaches", href: "/#coaches" },
  { id: "tournaments", label: "Tournaments", href: "/#tournaments" },
  { id: "gallery", label: "Gallery", href: "/#gallery" },
  { id: "testimonials", label: "Reviews", href: "/#testimonials" },
];

export function SiteHeader() {
  const { activeSectionId, scrollToSection } = useActiveSection();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isClassesPage = pathname === "/classes";
  const isHomePage = pathname === "/";

  const isLinkActive = (item: NavItem) => {
    if (isClassesPage) {
      return item.id === "classes";
    }
    if (!isHomePage) {
      return false;
    }
    if (activeSectionId === "hero") {
      return false;
    }
    return activeSectionId === item.id;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    setMobileMenuOpen(false);
    if (isHomePage) {
      e.preventDefault();
      scrollToSection(item.id);
    }
  };

  return (
    <header className="sticky top-0 w-full z-40 bg-surface-lowest/90 backdrop-blur-xl border-b border-outline-subtle h-[var(--header-h)]">
      <div className="max-w-7xl mx-auto h-full px-3 md:px-6 lg:px-12 flex items-center justify-between gap-2">
        {/* Brand Logo & Wordmark (at most 2 lines, whitespace-nowrap, min-w-0) */}
        <Link
          className="flex items-center gap-2 sm:gap-3 group min-w-0"
          href="/#hero"
          onClick={(e) => {
            if (isHomePage) {
              e.preventDefault();
              scrollToSection("hero");
            }
          }}
        >
          <div className="w-10 h-10 shrink-0 rounded-lg bg-surface-high border border-primary/40 flex items-center justify-center overflow-hidden group-hover:border-primary transition-colors shadow-[0_0_15px_rgba(242,202,80,0.15)] relative">
            <Image
              src="/logo.jpeg"
              alt="Rahman Chess Academy Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col min-w-0 justify-center">
            <span className="font-display text-sm sm:text-lg md:text-xl font-bold tracking-tight text-on-surface group-hover:text-primary transition-colors whitespace-nowrap truncate leading-tight">
              RAHMAN CHESS<span className="hidden sm:inline"> ACADEMY</span>
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] tracking-wider uppercase text-secondary whitespace-nowrap truncate leading-tight mt-0.5">
              <span className="sm:hidden">ACADEMY &bull; ONLINE</span>
              <span className="hidden sm:inline">Think&middot;Plan&middot;Move&middot;Win</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-8 text-sm font-medium shrink-0"
        >
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link);
            const ariaCurrent = isClassesPage && link.id === "classes"
              ? "page"
              : active
              ? "location"
              : undefined;

            return (
              <Link
                key={link.id}
                href={link.href}
                aria-current={ariaCurrent}
                onClick={(e) => handleNavClick(e, link)}
                className={`py-1 border-b-2 transition-all ${
                  active
                    ? "text-primary border-primary font-semibold"
                    : "text-on-surface-variant hover:text-primary border-transparent"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/classes"
            className="shrink-0 h-10 px-3 sm:px-4 bg-primary text-on-primary text-xs uppercase tracking-wider font-bold rounded hover:opacity-90 transition-all shadow-[0_0_20px_rgba(242,202,80,0.25)] flex items-center gap-1.5 font-mono whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-base">calendar_month</span>
            <span>
              <span className="sm:hidden">Book</span>
              <span className="hidden sm:inline">CLASS ROOM</span>
            </span>
          </Link>

          {/* Mobile hamburger button: vertically centered on same axis as CTA and Logo (40px) */}
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden h-10 w-10 shrink-0 rounded-lg bg-surface border border-outline-subtle text-on-surface hover:text-primary cursor-pointer flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="lg:hidden absolute top-[var(--header-h)] left-0 w-full bg-surface-lowest border-b border-outline-subtle px-4 py-4 flex flex-col gap-2 font-mono text-sm shadow-2xl"
        >
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link);
            const ariaCurrent = isClassesPage && link.id === "classes"
              ? "page"
              : active
              ? "location"
              : undefined;

            return (
              <Link
                key={link.id}
                href={link.href}
                aria-current={ariaCurrent}
                onClick={(e) => handleNavClick(e, link)}
                className={`py-2 px-3 rounded-lg transition-all ${
                  active
                    ? "bg-primary/15 text-primary border-l-4 border-primary font-bold"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
