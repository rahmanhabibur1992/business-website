"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEnquiryModal } from "./EnquiryContext";
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
  const { openModal } = useEnquiryModal();
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
    // While hero is active, no link is highlighted
    if (activeSectionId === "hero") {
      return false;
    }
    // gallery and journal both map to Gallery link
    if (item.id === "gallery") {
      return activeSectionId === "gallery" || activeSectionId === "journal";
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
    <header className="sticky top-0 w-full z-40 bg-surface-lowest/90 backdrop-blur-xl border-b border-outline-subtle">
      <div className="max-w-7xl mx-auto h-20 px-4 lg:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          className="flex items-center gap-3 group"
          href="/#hero"
          onClick={(e) => {
            if (isHomePage) {
              e.preventDefault();
              scrollToSection("hero");
            }
          }}
        >
          <div className="w-10 h-10 rounded-lg bg-surface-high border border-primary/40 flex items-center justify-center overflow-hidden group-hover:border-primary transition-colors shadow-[0_0_15px_rgba(242,202,80,0.15)] relative">
            <Image
              src="/logo.jpeg"
              alt="Rahman Chess Academy Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg md:text-xl font-bold tracking-tight text-on-surface group-hover:text-primary transition-colors">
              RAHMAN CHESS <span className="hidden sm:inline">ACADEMY</span>
            </span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-secondary">
              Mentorship Academy • 100% Online
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-8 text-sm font-medium"
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
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="px-5 py-2.5 bg-primary text-on-primary text-xs uppercase tracking-wider font-bold rounded hover:opacity-90 transition-all shadow-[0_0_20px_rgba(242,202,80,0.25)] flex items-center gap-1.5 cursor-pointer font-mono"
            onClick={(e) => openModal("assessment", e.currentTarget)}
          >
            <span className="material-symbols-outlined text-base">calendar_month</span>
            <span>Book Assessment</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-lg bg-surface border border-outline-subtle text-on-surface hover:text-primary cursor-pointer flex items-center justify-center"
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
          className="lg:hidden bg-surface-lowest border-b border-outline-subtle px-6 py-4 flex flex-col gap-3 font-mono text-sm shadow-2xl"
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
