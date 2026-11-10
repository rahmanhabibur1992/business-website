"use client";

import { useAdminAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SyntheticEvent, useEffect, useState } from "react";
import { SITE_CONTACT } from "@/lib/site-config";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();
  const { login, user, loading } = useAdminAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/admin");
    }
  }, [loading, user, router]);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMessage("Please enter both your email address and password.");
      return;
    }

    setSubmitting(true);
    try {
      await login(cleanEmail, password);
      router.push("/admin");
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      console.error("Login attempt failed:", error);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        setErrorMessage(
          "The email or password you entered does not match our records. Please double-check for typos or Caps Lock."
        );
      } else if (error.code === "auth/too-many-requests") {
        setErrorMessage(
          "Too many unsuccessful login attempts. For security, please wait a couple of minutes before trying again."
        );
      } else {
        setErrorMessage(
          "Could not sign in at this time. Please check your internet connection and try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
          <p className="text-base text-white/70 font-sans">Checking session status...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative selection:bg-gold selection:text-black">
      {/* Background chess ambient decoration */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_20%,rgba(212,175,55,0.15),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="w-full max-w-lg relative z-10">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-gold transition-colors text-sm sm:text-base group font-medium"
          >
            <span className="text-gold text-lg transition-transform group-hover:-translate-x-1">
              ←
            </span>
            <span>Return to Public Website</span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-[#0f131c] border-2 border-gold/30 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl shadow-black/80">
          {/* Card Header with Academy Emblem */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl bg-gold/10 border-2 border-gold/40 flex items-center justify-center text-gold text-3xl sm:text-4xl shadow-inner">
              ♞
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary mb-2">
              Rahman Chess Academy
            </h1>
            <div className="inline-block px-3 py-1 bg-gold/15 border border-gold/40 rounded-full text-gold text-xs sm:text-sm font-semibold tracking-wider uppercase mb-3">
              Administrator Portal
            </div>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              Please enter your admin credentials to manage classes, coaches, tournaments, and website content.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-xl bg-red-950/60 border-2 border-red-500/60 text-red-200 text-sm sm:text-base flex items-start gap-3"
            >
              <span className="text-xl shrink-0" aria-hidden="true">
                ⚠️
              </span>
              <div className="leading-snug">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Email Field */}
            <div>
              <label
                htmlFor="admin-email"
                className="block text-sm sm:text-base font-semibold text-white/90 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full bg-[#181e2b] border-2 border-white/20 focus:border-gold rounded-xl px-4 py-3.5 text-base sm:text-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-colors"
                />
              </div>
              <p className="text-xs sm:text-sm text-white/50 mt-1.5">
                The Google or email account registered for academy administration.
              </p>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="admin-password"
                  className="block text-sm sm:text-base font-semibold text-white/90"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-xs sm:text-sm text-gold hover:text-gold-light focus:outline-none underline font-medium"
                >
                  {showPassword ? "Hide Password" : "Show Password"}
                </button>
              </div>
              <div className="relative">
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#181e2b] border-2 border-white/20 focus:border-gold rounded-xl px-4 py-3.5 text-base sm:text-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-lg p-1"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <p className="text-xs sm:text-sm text-white/50 mt-1.5">
                Click &quot;Show Password&quot; if you want to verify what you typed.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gold hover:bg-gold-light text-[#07090e] font-bold text-base sm:text-lg py-4 px-6 rounded-xl shadow-lg shadow-gold/20 hover:shadow-gold/30 active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-3 border-[#07090e]/30 border-t-[#07090e] rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span className="text-primary">Sign In to Admin Portal</span>
                  <span className="text-xl" aria-hidden="true">
                    →
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Help Box for non-technical users */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Having trouble signing in?
              <br />
              Contact academy support via WhatsApp:{" "}
              <a
                href={SITE_CONTACT.whatsappChatUrl(
                  "Hello Rahman Chess Academy, I need help signing in to the admin portal."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold font-semibold underline hover:text-gold-light inline-block mt-1"
              >
                {SITE_CONTACT.phoneDisplay}
              </a>
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-white/40 mt-6">
          Rahman Chess Academy • 100% Online Coaching Portal
        </p>
      </div>
    </main>
  );
}
