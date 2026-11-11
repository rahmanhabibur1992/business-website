"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { SITE_CONTACT } from "@/lib/site-config";

export function WhatsAppFloatingButton() {
  const pathname = usePathname();

  // Hide on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const whatsappUrl = SITE_CONTACT.whatsappChatUrl(
    "Hi Rahman Chess Academy 👋 I would like to enquire about your online chess classes."
  );

  return (
    <aside aria-label="WhatsApp Enquiry" className="fixed bottom-6 right-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp to enquire about chess classes"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-xl hover:shadow-[0_0_25px_rgba(37,211,102,0.55)] transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        {/* Pulse ring animation */}
        <span
          className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 pointer-events-none"
          aria-hidden="true"
        />

        {/* WhatsApp Icon */}
        <svg
          className="w-7 h-7 fill-current relative z-10"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M12.031 2C6.516 2 2.031 6.484 2.031 12c0 2.203.719 4.25 1.938 5.922L2 22l4.203-1.922A9.948 9.948 0 0012.031 22C17.547 22 22.031 17.516 22.031 12s-4.484-10-10-10zm0 18.281c-1.859 0-3.594-.594-5.016-1.609l-.359-.25-2.5.641.656-2.438-.234-.375a8.232 8.232 0 01-1.281-4.25c0-4.578 3.719-8.281 8.281-8.281s8.281 3.703 8.281 8.281-3.703 8.281-8.281 8.281zm4.547-6.203c-.25-.125-1.469-.719-1.688-.813-.234-.078-.406-.125-.578.125-.172.25-.672.813-.813.984-.156.172-.313.188-.563.063-.25-.125-1.063-.391-2.031-1.25-.75-.672-1.266-1.5-1.406-1.75-.156-.25-.016-.391.109-.516.109-.109.25-.281.375-.422.125-.141.172-.25.25-.406.078-.172.047-.328-.016-.453-.063-.125-.578-1.391-.797-1.906-.219-.516-.438-.438-.609-.438h-.516c-.172 0-.453.063-.688.328-.234.25-.906.891-.906 2.172s.922 2.516 1.047 2.688c.125.172 1.828 2.797 4.438 3.922.625.266 1.109.422 1.484.547.625.203 1.203.172 1.656.109.5-.078 1.469-.609 1.672-1.203.219-.594.219-1.094.156-1.203-.063-.109-.234-.172-.484-.297z" />
        </svg>

        {/* Hover Pill Tooltip */}
        <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-surface-highest text-on-surface border border-outline-subtle text-xs font-mono font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-xl">
          Hi! Enquire on WhatsApp 👋
        </span>
      </a>
    </aside>
  );
}
