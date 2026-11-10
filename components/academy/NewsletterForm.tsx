"use client";

import React, { useState } from "react";
import { ChessPiece } from "./ChessPiece";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Illegal move. Check your email.");
      setIsSuccess(false);
      return;
    }

    setError(null);
    setIsSuccess(true);
    setEmail("");

    setTimeout(() => {
      setIsSuccess(false);
    }, 5000);
  };

  return (
    <form className="space-y-1.5" noValidate onSubmit={handleSubmit}>
      <div className="flex items-center gap-1.5">
        <input
          id="newsletter-email"
          type="email"
          required
          placeholder="master@domain.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          className={`flex-1 bg-surface-container border rounded px-2.5 py-1.5 text-xs text-on-surface focus:outline-none transition-colors ${
            error
              ? "border-[var(--chess-error)] field-error-shake"
              : "border-outline-subtle focus:border-primary"
          }`}
        />
        <button
          type="submit"
          className="px-3 py-1.5 bg-primary text-on-primary font-bold rounded hover:opacity-90 transition-opacity text-xs cursor-pointer font-mono"
        >
          Join
        </button>
      </div>

      {error && (
        <div
          id="newsletter-feedback"
          className="flex font-mono text-[11px] items-center gap-1.5 pt-1 text-[var(--chess-error)]"
        >
          <span className="w-3.5 h-3.5 field-error-shake">
            <ChessPiece piece="pawn" />
          </span>
          <span>{error}</span>
        </div>
      )}

      {isSuccess && (
        <div
          id="newsletter-feedback"
          className="flex font-mono text-[11px] items-center gap-2 pt-1 text-[var(--chess-success)]"
        >
          <span className="w-4 h-4 text-[var(--chess-accent)]">
            <ChessPiece piece="queen" />
          </span>
          <span className="w-4 h-4 text-[var(--chess-ink)] king-topple">
            <ChessPiece piece="king" />
          </span>
          <span>Checkmate. We&apos;ll reply within 24 hours.</span>
        </div>
      )}
    </form>
  );
}
