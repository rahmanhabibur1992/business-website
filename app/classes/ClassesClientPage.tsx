"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChessPiece } from "@/components/academy/ChessPiece";
import { ClassTrack, ClassesSectionContent } from "@/lib/academy-content";
import {
  buildEnrollWhatsAppUrl,
  buildGeneralEnquiryWhatsAppUrl,
} from "@/lib/site-config";

interface ClassesClientPageProps {
  classes: ClassTrack[];
  sectionContent?: ClassesSectionContent;
}

interface FormErrors {
  studentName?: string;
  age?: string;
  studentLevel?: string;
}

const LEVEL_OPTIONS = [
  { value: "beginner", label: "Beginner", desc: "New to chess or just learning the rules" },
  { value: "intermediate", label: "Intermediate", desc: "Knows openings, working on tactics & strategy" },
  { value: "advanced", label: "Advanced", desc: "Rated player, serious tournament preparation" },
];

export function ClassesClientPage({ classes }: ClassesClientPageProps) {
  const searchParams = useSearchParams();
  const queryClass = searchParams.get("class");

  const [selectedSlug, setSelectedSlug] = useState<string>(() => queryClass || "");
  const [isClassListOpen, setIsClassListOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [age, setAge] = useState("");
  const [studentLevel, setStudentLevel] = useState("");
  const [wantCallback, setWantCallback] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsappFallbackUrl, setWhatsappFallbackUrl] = useState<string | null>(null);

  const activeSlug = selectedSlug || "";

  const selectedClass = classes.find(
    (c) => c.slug === activeSlug || c.id === activeSlug
  );

  const handleSelectClass = (track: ClassTrack) => {
    setSelectedSlug(track.slug || track.id);
    setIsClassListOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    const trimmedName = studentName.trim();
    if (!trimmedName) {
      newErrors.studentName = "Illegal move. Check your student full name.";
    }

    const numAge = parseInt(age, 10);
    if (!age.trim() || isNaN(numAge) || numAge < 5 || numAge > 65) {
      newErrors.age = "Illegal move. Check your student age (5-65).";
    }

    if (!studentLevel) {
      newErrors.studentLevel = "Please select your current chess level.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const levelLabel = LEVEL_OPTIONS.find((l) => l.value === studentLevel)?.label || studentLevel;

    let waUrl = "";
    if (selectedClass) {
      waUrl = buildEnrollWhatsAppUrl({
        title: selectedClass.title,
        level: selectedClass.level,
        name: trimmedName,
        age: numAge,
        studentLevel: levelLabel,
        wantCallback,
      });
    } else {
      waUrl = buildGeneralEnquiryWhatsAppUrl({
        name: trimmedName,
        age: numAge,
        studentLevel: levelLabel,
        wantCallback,
      });
    }

    setWhatsappFallbackUrl(waUrl);

    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="w-full py-8 md:py-12 px-4 lg:px-12 bg-surface-lowest min-h-[calc(100vh-160px)]">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        {/* Heading */}
        <div className="flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Online Chess Enrollment</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
            Online Chess Classes
          </h1>
        </div>

        {/* Selected-Class Summary */}
        <div className="flex flex-col gap-3">
          {selectedClass ? (
            <div className="bg-surface rounded-xl p-4 sm:p-5 border border-primary/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded font-mono text-xs font-bold uppercase bg-primary/15 text-primary border border-primary/30">
                  {selectedClass.level}
                </span>
                <div>
                  <div className="font-display font-bold text-base text-on-surface">
                    {selectedClass.title}
                  </div>
                  <div className="text-xs font-mono text-on-surface-variant">
                    {selectedClass.ratingLabel || selectedClass.ratingRange} &bull; {selectedClass.batchSize} &bull; {selectedClass.mode || "Online"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsClassListOpen((prev) => !prev)}
                  className="text-xs font-mono text-primary hover:underline font-semibold cursor-pointer"
                >
                  {isClassListOpen ? "Hide class list" : "Change class (optional)"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSlug("")}
                  className="text-xs font-mono text-on-surface-variant hover:text-chess-error cursor-pointer"
                  title="Clear class selection for general enquiry"
                >
                  X Clear
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-surface rounded-xl p-4 sm:p-5 border border-outline-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="font-display font-semibold text-sm text-on-surface">
                  No specific class selected (General Enquiry)
                </div>
                <div className="text-xs text-on-surface-variant">
                  You can submit directly below or pick a specific class track.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsClassListOpen((prev) => !prev)}
                className="text-xs font-mono text-primary hover:underline font-semibold cursor-pointer shrink-0 self-start sm:self-auto"
              >
                {isClassListOpen ? "Hide class list" : "Browse class tracks"}
              </button>
            </div>
          )}

          {/* Expanded Class List */}
          {isClassListOpen && (
            <div className="space-y-3 pt-2">
              <div className="text-xs font-mono text-on-surface-variant uppercase tracking-wider">
                Select a class track below (optional):
              </div>
              <div className="grid grid-cols-1 gap-3">
                {classes.map((track) => {
                  const classSlug = track.slug || track.id;
                  const isSelected = activeSlug === classSlug;
                  return (
                    <div
                      key={track.id}
                      onClick={() => handleSelectClass(track)}
                      className={`cursor-pointer rounded-xl p-4 border transition-all ${
                        isSelected
                          ? "bg-surface-high border-primary ring-1 ring-primary"
                          : "bg-surface border-outline-subtle hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded font-mono text-xs font-bold uppercase bg-primary/15 text-primary border border-primary/30">
                            {track.level}
                          </span>
                          <span className="font-display font-bold text-sm text-on-surface">
                            {track.title}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-primary font-semibold">
                          {isSelected ? "Selected v" : "Select this class >"}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant line-clamp-2">
                        {track.description}
                      </p>
                      <div className="mt-2 text-[11px] font-mono text-on-surface-variant/80">
                        {track.ratingLabel || track.ratingRange} &bull; {track.batchSize} &bull; {track.mode || "Online"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Enquiry Form */}
        <div className="bg-surface rounded-xl p-6 sm:p-8 border border-outline-subtle shadow-xl flex flex-col gap-5">
          {isSubmitted && (
            <div className="p-4 rounded-lg border border-[var(--chess-success)] bg-[var(--chess-success)]/10 flex items-center gap-3">
              <div className="w-7 h-7 text-[var(--chess-accent)] shrink-0">
                <ChessPiece piece="queen" />
              </div>
              <div className="flex-1">
                <div className="font-mono text-xs font-bold text-[var(--chess-success)]">
                  Checkmate. Opening WhatsApp to send your request.
                </div>
                {whatsappFallbackUrl && (
                  <div className="text-[11px] font-mono mt-1">
                    Popup blocked?{" "}
                    <a
                      href={whatsappFallbackUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-primary font-bold hover:text-secondary"
                    >
                      Open WhatsApp Fallback
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          <form className="space-y-5" noValidate onSubmit={handleSubmit}>
            {/* Student Name */}
            <div>
              <label
                className="block text-xs font-mono uppercase text-secondary mb-1"
                htmlFor="classesStudentName"
              >
                Student Name *
              </label>
              <div className="relative">
                <input
                  id="classesStudentName"
                  type="text"
                  required
                  maxLength={60}
                  placeholder="e.g. Ramesh Iyer"
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    if (errors.studentName) setErrors((prev) => ({ ...prev, studentName: undefined }));
                  }}
                  className={`w-full bg-surface-low border rounded px-3.5 py-2.5 text-sm text-on-surface focus:outline-none transition-colors ${
                    errors.studentName
                      ? "border-[var(--chess-error)] field-error-shake"
                      : "border-outline-subtle focus:border-primary"
                  }`}
                />
                {errors.studentName && (
                  <span className="field-error-icon absolute right-3 top-2.5 w-4 h-4 text-[var(--chess-error)]" aria-hidden="true">
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
              <label
                className="block text-xs font-mono uppercase text-secondary mb-1"
                htmlFor="classesAge"
              >
                Student Age (5-65) *
              </label>
              <div className="relative">
                <input
                  id="classesAge"
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
                  className={`w-full bg-surface-low border rounded px-3.5 py-2.5 text-sm text-on-surface focus:outline-none transition-colors ${
                    errors.age
                      ? "border-[var(--chess-error)] field-error-shake"
                      : "border-outline-subtle focus:border-primary"
                  }`}
                />
                {errors.age && (
                  <span className="field-error-icon absolute right-3 top-2.5 w-4 h-4 text-[var(--chess-error)]" aria-hidden="true">
                    <ChessPiece piece="pawn" />
                  </span>
                )}
              </div>
              {errors.age && (
                <p className="font-mono text-[11px] text-[var(--chess-error)] mt-1">{errors.age}</p>
              )}
            </div>

            {/* Current Level */}
            <div>
              <label className="block text-xs font-mono uppercase text-secondary mb-2">
                Current Chess Level *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {LEVEL_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setStudentLevel(opt.value);
                      if (errors.studentLevel) setErrors((prev) => ({ ...prev, studentLevel: undefined }));
                    }}
                    className={`flex flex-col items-start gap-0.5 px-4 py-3 rounded-lg border text-left transition-all cursor-pointer ${
                      studentLevel === opt.value
                        ? "border-primary bg-primary/10 ring-1 ring-primary"
                        : "border-outline-subtle bg-surface-low hover:border-primary/50"
                    }`}
                  >
                    <span className="font-mono font-bold text-xs uppercase tracking-wider text-on-surface">
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-on-surface-variant leading-snug">{opt.desc}</span>
                  </button>
                ))}
              </div>
              {errors.studentLevel && (
                <p className="font-mono text-[11px] text-[var(--chess-error)] mt-1">{errors.studentLevel}</p>
              )}
            </div>

            {/* Contact Back Checklist */}
            <div className="rounded-lg border border-outline-subtle bg-surface-low px-4 py-3">
              <label className="flex items-start gap-3 cursor-pointer select-none" htmlFor="wantCallback">
                <div className="relative mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={wantCallback}
                    onChange={(e) => setWantCallback(e.target.checked)}
                    id="wantCallback"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center cursor-pointer ${
                      wantCallback ? "bg-primary border-primary" : "border-outline-subtle bg-surface"
                    }`}
                    aria-hidden="true"
                  >
                    {wantCallback && (
                      <svg className="w-3 h-3 text-on-primary" fill="none" viewBox="0 0 12 12">
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-on-surface">
                    Contact me back immediately
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    Tick this if you need a quick call-back or want us to reach out as soon as possible.
                  </span>
                </div>
              </label>
            </div>

            {/* Submit */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-primary text-on-primary font-mono text-xs uppercase tracking-wider font-bold rounded hover:opacity-90 transition-all shadow-[0_0_20px_rgba(242,202,80,0.3)] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-80"
              >
                <span>{isSubmitted ? "Opening WhatsApp..." : "Send via WhatsApp"}</span>
                <span className="material-symbols-outlined text-base">chat</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
