import React from "react";
import { SITE_CONTACT } from "@/lib/site-config";

export function TopBar() {
  return (
    <div className="w-full bg-surface-lowest border-b border-outline-subtle text-xs text-on-surface-variant px-4 lg:px-12 py-2">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 font-mono">
        <div className="flex flex-wrap items-center gap-4">
          <a
            className="hover:text-primary transition-colors flex items-center gap-1.5"
            href={`tel:${SITE_CONTACT.phoneTel}`}
          >
            <span className="material-symbols-outlined text-[15px] text-primary">call</span>{" "}
            {SITE_CONTACT.phone}
          </a>
          <a
            className="hover:text-primary transition-colors flex items-center gap-1.5"
            href={SITE_CONTACT.whatsappMentorshipUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="material-symbols-outlined text-[15px] text-primary">chat</span>{" "}
            WhatsApp Mentorship
          </a>
          <span className="hidden sm:inline text-outline-subtle">•</span>
          <span className="hidden lg:flex items-center gap-1.5 text-on-surface-variant">
            <span className="material-symbols-outlined text-[15px] text-secondary">schedule</span>{" "}
            {SITE_CONTACT.hours}
          </span>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <span className="text-secondary font-semibold text-[11px] uppercase tracking-wider">
            100% Online Academy
          </span>
        </div>
      </div>
    </div>
  );
}
