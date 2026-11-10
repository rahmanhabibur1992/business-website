"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useEnquiryModal } from "./EnquiryContext";
import { ChessPiece } from "./ChessPiece";
import { buildEnquiryWhatsAppUrl } from "@/lib/site-config";

interface FieldErrors {
  studentName?: string;
  age?: string;
}

export function EnquiryModal() {
  const { isOpen, targetType, closeModal } = useEnquiryModal();
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [studentName, setStudentName] = useState("");
  const [age, setAge] = useState("");
  const [whatsappFallbackUrl, setWhatsappFallbackUrl] = useState<string | null>(null);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derive human-readable enquiry topic from targetType
  const enquiryTopic = useMemo(() => {
    if (!targetType || targetType === "assessment") {
      return "Free Diagnostic Assessment";
    }
    if (targetType.startsWith("coach-")) {
      const coachName = targetType.replace("coach-", "").replace(/-/g, " ");
      return `Consultation with ${coachName.toUpperCase()}`;
    }
    if (targetType.startsWith("tournament-") || targetType.startsWith("event-")) {
      const eventName = targetType.replace(/^(tournament|event)-/, "").replace(/-/g, " ");
      return `Tournament seat: ${eventName}`;
    }
    if (targetType === "prospectus" || targetType === "consult") {
      return "Request Academy Prospectus";
    }
    return `Enquiry: ${targetType}`;
  }, [targetType]);

  const handleClose = React.useCallback(() => {
    setErrors({});
    setIsSubmitted(false);
    setWhatsappFallbackUrl(null);
    closeModal();
  }, [closeModal]);

  // Body scroll lock & focus trap
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      firstInputRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl?.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl?.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FieldErrors = {};

    const trimmedName = studentName.trim();
    if (!trimmedName) {
      newErrors.studentName = "Illegal move. Check your student full name.";
    }

    const numAge = parseInt(age, 10);
    if (!age.trim() || isNaN(numAge) || numAge < 5 || numAge > 65) {
      newErrors.age = "Illegal move. Check your student age (5–65).";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const waUrl = buildEnquiryWhatsAppUrl({
      enquiry: enquiryTopic,
      name: trimmedName,
      age: numAge,
    });
    setWhatsappFallbackUrl(waUrl);

    // Open WhatsApp in new tab
    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }

    setIsSubmitting(false);
    setIsSubmitted(true);

    setTimeout(() => {
      handleClose();
      setStudentName("");
      setAge("");
    }, 4500);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      id="enquiry-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-lowest/85 backdrop-blur-md overflow-y-auto"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-surface-lowest border border-outline-subtle rounded-xl p-6 md:p-8 shadow-2xl my-auto"
      >
        <button
          aria-label="Close Enquiry Dialog"
          type="button"
          className="absolute top-5 right-5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          onClick={handleClose}
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-primary font-mono text-xs uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Online Assessment &amp; Mentorship
          </div>
          <h2 id="enquiry-modal-title" className="font-display text-2xl font-bold text-on-surface">
            {enquiryTopic}
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Fill in student details. We dispatch your structured request directly via WhatsApp.
          </p>
        </div>

        {/* Live Feedback Banner for Microcopy */}
        <div aria-live="polite">
          {isSubmitted && (
            <div className="mb-4 p-4 rounded-lg border border-[var(--chess-success)] bg-[var(--chess-success)]/10 flex items-center gap-4 transition-all duration-300">
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 text-[var(--chess-accent)]" title="Winning Queen">
                  <ChessPiece piece="queen" />
                </div>
                <div className="w-8 h-8 text-[var(--chess-ink)] king-topple" title="Defeated King toppled">
                  <ChessPiece piece="king" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-mono text-sm font-bold text-[var(--chess-success)]">
                  Checkmate. Opening WhatsApp to send your request.
                </h4>
                {whatsappFallbackUrl && (
                  <p className="text-xs text-on-surface font-mono mt-1">
                    Popup blocked?{" "}
                    <a
                      href={whatsappFallbackUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-primary font-bold hover:text-secondary"
                    >
                      Click here to Open WhatsApp
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <form className="space-y-4" noValidate onSubmit={handleSubmit}>
          {/* Student Name */}
          <div>
            <label className="block text-xs font-mono uppercase text-secondary mb-1" htmlFor="studentName">
              Student Full Name *
            </label>
            <div className="relative">
              <input
                ref={firstInputRef}
                id="studentName"
                type="text"
                required
                maxLength={60}
                placeholder="e.g. Aarav Sharma"
                value={studentName}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  if (errors.studentName) setErrors((prev) => ({ ...prev, studentName: undefined }));
                }}
                className={`w-full bg-surface-low border rounded px-3 py-2 text-sm text-on-surface focus:outline-none transition-colors ${
                  errors.studentName
                    ? "border-[var(--chess-error)] field-error-shake"
                    : "border-outline-subtle focus:border-primary"
                }`}
              />
              {errors.studentName && (
                <span
                  className="field-error-icon absolute right-3 top-2.5 w-4 h-4 text-[var(--chess-error)] field-error-shake"
                  aria-hidden="true"
                >
                  <ChessPiece piece="pawn" />
                </span>
              )}
            </div>
            {errors.studentName && (
              <p className="font-mono text-[11px] text-[var(--chess-error)] mt-1">{errors.studentName}</p>
            )}
          </div>

          {/* Student Age */}
          <div>
            <label className="block text-xs font-mono uppercase text-secondary mb-1" htmlFor="studentAge">
              Student Age (5–65) *
            </label>
            <div className="relative">
              <input
                id="studentAge"
                type="number"
                min={5}
                max={65}
                required
                placeholder="e.g. 11"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                  if (errors.age) setErrors((prev) => ({ ...prev, age: undefined }));
                }}
                className={`w-full bg-surface-low border rounded px-3 py-2 text-sm text-on-surface focus:outline-none transition-colors ${
                  errors.age
                    ? "border-[var(--chess-error)] field-error-shake"
                    : "border-outline-subtle focus:border-primary"
                }`}
              />
              {errors.age && (
                <span
                  className="field-error-icon absolute right-3 top-2.5 w-4 h-4 text-[var(--chess-error)] field-error-shake"
                  aria-hidden="true"
                >
                  <ChessPiece piece="pawn" />
                </span>
              )}
            </div>
            {errors.age && (
              <p className="font-mono text-[11px] text-[var(--chess-error)] mt-1">{errors.age}</p>
            )}
          </div>

          <div className="p-3 bg-surface-low rounded border border-outline-subtle flex items-center justify-between text-xs font-mono text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-base">verified</span>
              100% Online Global Academy
            </span>
            <span className="text-primary font-bold">Via WhatsApp</span>
          </div>

          <div className="pt-2">
            <button
              id="submit-enquiry-btn"
              type="submit"
              disabled={isSubmitting || isSubmitted}
              className="w-full py-3 bg-primary text-on-primary font-mono text-sm uppercase tracking-wider font-bold rounded hover:opacity-90 transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-80"
            >
              <span>{isSubmitted ? "Opening WhatsApp..." : "Send via WhatsApp"}</span>
              <span className="material-symbols-outlined text-base">chat</span>
            </button>
            <p className="text-center text-[11px] text-on-surface-variant font-mono mt-2">
              Opens WhatsApp directly • No spam guarantee
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
