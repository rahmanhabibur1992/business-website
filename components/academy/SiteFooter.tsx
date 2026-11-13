"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONTACT } from "@/lib/site-config";
import { ACADEMY_CONFIG } from "@/lib/academy-content";

export function SiteFooter() {
  const currentYear = ACADEMY_CONFIG.copyrightYear;

  return (
    <footer className="w-full bg-surface-lowest border-t border-outline-subtle text-on-surface-variant">
      <div className="max-w-7xl mx-auto px-4 lg:px-12 py-16 flex flex-col gap-12">
        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-12">
          {/* Brand info */}
          <div className="flex flex-col gap-3 max-w-md">
            <div className="flex items-center gap-2 text-on-surface font-display text-lg font-bold">
              <div className="w-10 h-10 rounded-lg bg-surface-high border border-primary/40 flex items-center justify-center overflow-hidden group-hover:border-primary transition-colors shadow-[0_0_15px_rgba(242,202,80,0.15)] relative">
                <Image
                  src="/logo.jpeg"
                  alt="Rahman Chess Academy Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <span>RAHMAN CHESS ACADEMY</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Elite international pedagogical institution providing structured FIDE titled development, neural engine training, and Master apprenticeships. 100% Online Global Academy.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-2 font-mono text-xs">
            <span className="text-primary font-bold uppercase tracking-wider mb-1">Navigation</span>
            <Link className="hover:text-primary transition-colors" href="/classes">
              Curriculum &amp; Enrollment
            </Link>
            <Link className="hover:text-primary transition-colors" href="/#classes">
              Classes &amp; Tracks
            </Link>
            <Link className="hover:text-primary transition-colors" href="/#coaches">
              Master Faculty
            </Link>
            <Link className="hover:text-primary transition-colors" href="/#tournaments">
              Tournament Arena
            </Link>
            <Link className="hover:text-primary transition-colors" href="/#gallery">
              Gallery &amp; Events
            </Link>
            <Link className="hover:text-primary transition-colors" href="/#testimonials">
              Verified Testimonials
            </Link>
          </div>

          {/* Contacts & Academy Info */}
          <div className="flex flex-col gap-2 font-mono text-xs">
            <span className="text-primary font-bold uppercase tracking-wider mb-1">
              Contact &amp; Delivery
            </span>
            <p className="text-on-surface">Mode: 100% Online Interactive</p>
            <p>
              Phone:{" "}
              <a className="hover:text-primary text-on-surface" href={`tel:${SITE_CONTACT.phoneTel}`}>
                {SITE_CONTACT.phone}
              </a>
            </p>
            <p>
              WhatsApp:{" "}
              <a
                className="hover:text-primary text-on-surface"
                href={SITE_CONTACT.whatsappMentorshipUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {SITE_CONTACT.phone}
              </a>
            </p>
            <p className="text-secondary">Hours: {SITE_CONTACT.hours}</p>
          </div>
        </div>

        <div className="pt-8 border-t border-outline-subtle flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-on-surface-variant">
          <div>© {currentYear} Rahman Chess Academy. </div>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center sm:justify-end">
            <a className="text-on-surface-variant" href={"https://antyk-technology.vercel.app/"} target="_blank">Made with ♥️ by ANTYK Technologies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
