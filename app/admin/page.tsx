"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/auth-context";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  ALLOWED_MATERIAL_ICONS,
  ClassesSectionContentSchema,
  ClassTrackSchema,
  CoachProfileSchema,
  TournamentEventSchema,
  GalleryItemSchema,
  TestimonialItemSchema,
} from "@/lib/schemas";
import {
  HeroTag,
  ClassesSectionContent,
  ClassTrack,
  CoachProfile,
  TournamentEvent,
  JournalPost,
  TestimonialItem,
  SEED_HERO_TAGS,
  SEED_CLASSES_SECTION,
} from "@/lib/academy-content";
import { SITE_CONTACT } from "@/lib/site-config";

type AdminTab = "classes" | "coaches" | "tournaments" | "gallery" | "testimonials" | "hero";

export default function AdminPage() {
  const { user, logout, loading: authLoading } = useAdminAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AdminTab>("classes");
  const [dataLoading, setDataLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Content states
  const [heroTags, setHeroTags] = useState<HeroTag[]>(SEED_HERO_TAGS);
  const [classesSection, setClassesSection] = useState<ClassesSectionContent>(SEED_CLASSES_SECTION);
  const [classes, setClasses] = useState<ClassTrack[]>([]);
  const [coaches, setCoaches] = useState<CoachProfile[]>([]);
  const [tournaments, setTournaments] = useState<TournamentEvent[]>([]);
  const [gallery, setGallery] = useState<JournalPost[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

  // Editing state for modals
  const [editingClass, setEditingClass] = useState<ClassTrack | null>(null);
  const [editingCoach, setEditingCoach] = useState<CoachProfile | null>(null);
  const [editingTournament, setEditingTournament] = useState<TournamentEvent | null>(null);
  const [editingGallery, setEditingGallery] = useState<JournalPost | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);

  // New item chip buffers
  const [moduleInput, setModuleInput] = useState("");
  const [specialtyInput, setSpecialtyInput] = useState("");

  // Inline errors map
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  }, []);

  const getIdToken = useCallback(async (): Promise<string | null> => {
    if (!user) return null;
    return await user.getIdToken();
  }, [user]);

  // Auth gate check
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/admin/login");
    }
  }, [user, authLoading, router]);

  // Fetch all content on mount
  const fetchAllData = useCallback(async () => {
    if (!user) return;
    setDataLoading(true);
    try {
      const token = await user.getIdToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [heroRes, classesRes, coachesRes, tournRes, galleryRes, testRes] = await Promise.all([
        fetch("/api/admin/hero", { headers }),
        fetch("/api/admin/classes", { headers }),
        fetch("/api/admin/coaches", { headers }),
        fetch("/api/admin/tournaments", { headers }),
        fetch("/api/admin/gallery", { headers }),
        fetch("/api/admin/testimonials", { headers }),
      ]);

      const [heroData, classesData, coachesData, tournData, galleryData, testData] =
        await Promise.all([
          heroRes.json(),
          classesRes.json(),
          coachesRes.json(),
          tournRes.json(),
          galleryRes.json(),
          testRes.json(),
        ]);

      if (heroData.success && heroData.data?.tags) setHeroTags(heroData.data.tags);
      if (classesData.success) {
        if (classesData.data?.classes) setClasses(classesData.data.classes);
        if (classesData.data?.section) setClassesSection(classesData.data.section);
      }
      if (coachesData.success && coachesData.data?.coaches) setCoaches(coachesData.data.coaches);
      if (tournData.success && tournData.data?.tournaments)
        setTournaments(tournData.data.tournaments);
      if (galleryData.success && galleryData.data?.gallery) setGallery(galleryData.data.gallery);
      if (testData.success && testData.data?.testimonials)
        setTestimonials(testData.data.testimonials);
    } catch (err) {
      console.error("Failed to load admin content", err);
      showToast("Could not load fresh data from server. Working with saved content.", "error");
    } finally {
      setDataLoading(false);
    }
  }, [user, showToast]);

  useEffect(() => {
    let isSubscribed = true;
    if (user) {
      (async () => {
        try {
          const token = await user.getIdToken();
          const headers = { Authorization: `Bearer ${token}` };

          const [heroRes, classesRes, coachesRes, tournRes, galleryRes, testRes] = await Promise.all([
            fetch("/api/admin/hero", { headers }),
            fetch("/api/admin/classes", { headers }),
            fetch("/api/admin/coaches", { headers }),
            fetch("/api/admin/tournaments", { headers }),
            fetch("/api/admin/gallery", { headers }),
            fetch("/api/admin/testimonials", { headers }),
          ]);

          if (!isSubscribed) return;

          const [heroData, classesData, coachesData, tournData, galleryData, testData] =
            await Promise.all([
              heroRes.json(),
              classesRes.json(),
              coachesRes.json(),
              tournRes.json(),
              galleryRes.json(),
              testRes.json(),
            ]);

          if (!isSubscribed) return;

          if (heroData.success && heroData.data?.tags) setHeroTags(heroData.data.tags);
          if (classesData.success) {
            if (classesData.data?.classes) setClasses(classesData.data.classes);
            if (classesData.data?.section) setClassesSection(classesData.data.section);
          }
          if (coachesData.success && coachesData.data?.coaches) setCoaches(coachesData.data.coaches);
          if (tournData.success && tournData.data?.tournaments)
            setTournaments(tournData.data.tournaments);
          if (galleryData.success && galleryData.data?.gallery) setGallery(galleryData.data.gallery);
          if (testData.success && testData.data?.testimonials)
            setTestimonials(testData.data.testimonials);
        } catch (err) {
          console.error("Failed to load admin content", err);
          if (isSubscribed) showToast("Could not load fresh data from server", "error");
        } finally {
          if (isSubscribed) setDataLoading(false);
        }
      })();
    }
    return () => {
      isSubscribed = false;
    };
  }, [user, showToast]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-surface-lowest text-on-surface flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <h2 className="text-xl font-bold text-on-surface">Opening Admin Portal...</h2>
          <p className="text-sm text-on-surface-variant">Verifying your secure credentials, please wait a moment.</p>
        </div>
      </div>
    );
  }

  // --- ACTIONS ---

  const handleSeedDefaults = async () => {
    if (
      !confirm(
        "Are you sure you want to restore default academy content? This will reset the baseline text, classes, and master profiles."
      )
    ) {
      return;
    }
    setSaving(true);
    try {
      const token = await getIdToken();
      const res = await fetch("/api/admin/seed", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Seed failed");
      showToast("Baseline default content has been successfully restored!");
      await fetchAllData();
    } catch (err: unknown) {
      const error = err as Error;
      showToast(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // 1. HERO TAGS
  const handleSaveHeroTags = async () => {
    setFieldErrors({});
    setSaving(true);
    try {
      const token = await getIdToken();
      const res = await fetch("/api/admin/hero", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tags: heroTags }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Save failed");
      }
      showToast("Hero badges saved! The website header is now updated.");
    } catch (err: unknown) {
      const error = err as Error;
      showToast(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAddHeroTag = () => {
    const newId = `tag-${Date.now()}`;
    setHeroTags((prev) => [
      ...prev,
      { id: newId, icon: "trophy", label: "New Achievement", tone: "primary" },
    ]);
  };

  // 2. CLASSES SECTION INTRO & CLASSES
  const handleSaveClassesSectionIntro = async () => {
    setSaving(true);
    setFieldErrors({});
    const parsed = ClassesSectionContentSchema.safeParse(classesSection);
    if (!parsed.success) {
      const errMap: Record<string, string> = {};
      parsed.error.issues.forEach((iss) => {
        errMap[iss.path.join(".")] = iss.message;
      });
      setFieldErrors(errMap);
      setSaving(false);
      showToast("Please check the section intro inputs.", "error");
      return;
    }

    try {
      const token = await getIdToken();
      const res = await fetch("/api/admin/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: "section", section: classesSection }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed");
      showToast("Class section intro text updated successfully!");
    } catch (err: unknown) {
      const error = err as Error;
      showToast(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveClass = async (track: ClassTrack) => {
    setSaving(true);
    setFieldErrors({});
    const parsed = ClassTrackSchema.safeParse(track);
    if (!parsed.success) {
      const errMap: Record<string, string> = {};
      parsed.error.issues.forEach((iss) => {
        errMap[iss.path.join(".")] = iss.message;
      });
      setFieldErrors(errMap);
      setSaving(false);
      showToast("Please fill in the required fields highlighted below.", "error");
      return;
    }

    try {
      const token = await getIdToken();
      const res = await fetch("/api/admin/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed");
      showToast(`Class "${parsed.data.title}" saved! Website updated.`);
      setEditingClass(null);
      await fetchAllData();
    } catch (err: unknown) {
      const error = err as Error;
      showToast(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClass = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove the class "${title}"?`)) return;
    setSaving(true);
    try {
      const token = await getIdToken();
      const res = await fetch(`/api/admin/classes?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Delete failed");
      showToast(`Class "${title}" removed.`);
      await fetchAllData();
    } catch (err: unknown) {
      const error = err as Error;
      showToast(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleVisible = async (
    collection: "classes" | "coaches" | "tournaments" | "gallery" | "testimonials",
    item: { id: string; visible?: boolean }
  ) => {
    const updatedVisible = item.visible === false ? true : false;
    const token = await getIdToken();
    try {
      await fetch(`/api/admin/${collection}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...item, visible: updatedVisible }),
      });
      showToast(
        `Item is now ${updatedVisible ? "Visible on Website" : "Hidden from Website"}.`
      );
      await fetchAllData();
    } catch {
      showToast("Failed to toggle visibility.", "error");
    }
  };

  // Reorder helper
  const handleReorder = async (
    collection: "classes" | "coaches" | "tournaments" | "gallery" | "testimonials",
    index: number,
    direction: "up" | "down"
  ) => {
    const listMap = {
      classes,
      coaches,
      tournaments,
      gallery,
      testimonials,
    };
    const list = [...listMap[collection]] as { id: string; order?: number }[];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    const payload = list.map((item, idx) => ({ id: item.id, order: idx + 1 }));
    const token = await getIdToken();
    try {
      await fetch(`/api/admin/${collection}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: "reorder", items: payload }),
      });
      showToast("Order updated successfully!");
      await fetchAllData();
    } catch {
      showToast("Failed to reorder items.", "error");
    }
  };

  // 3. MASTERS / COACHES
  const handleSaveCoach = async (coach: CoachProfile) => {
    setSaving(true);
    setFieldErrors({});
    const parsed = CoachProfileSchema.safeParse(coach);
    if (!parsed.success) {
      const errMap: Record<string, string> = {};
      parsed.error.issues.forEach((iss) => {
        errMap[iss.path.join(".")] = iss.message;
      });
      setFieldErrors(errMap);
      setSaving(false);
      showToast("Please fill in the required coach fields.", "error");
      return;
    }

    try {
      const token = await getIdToken();
      const res = await fetch("/api/admin/coaches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed");
      showToast(`Coach "${parsed.data.name}" profile saved!`);
      setEditingCoach(null);
      await fetchAllData();
    } catch (err: unknown) {
      const error = err as Error;
      showToast(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCoach = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove coach "${name}"?`)) return;
    setSaving(true);
    try {
      const token = await getIdToken();
      const res = await fetch(`/api/admin/coaches?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Delete failed");
      showToast(`Coach "${name}" removed.`);
      await fetchAllData();
    } catch (err: unknown) {
      const error = err as Error;
      showToast(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // 4. TOURNAMENTS
  const handleSaveTournament = async (tournament: TournamentEvent) => {
    setSaving(true);
    setFieldErrors({});
    const parsed = TournamentEventSchema.safeParse(tournament);
    if (!parsed.success) {
      const errMap: Record<string, string> = {};
      parsed.error.issues.forEach((iss) => {
        errMap[iss.path.join(".")] = iss.message;
      });
      setFieldErrors(errMap);
      setSaving(false);
      showToast("Please fill in the tournament fields.", "error");
      return;
    }

    try {
      const token = await getIdToken();
      const res = await fetch("/api/admin/tournaments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed");
      showToast(`Tournament "${parsed.data.title}" saved!`);
      setEditingTournament(null);
      await fetchAllData();
    } catch (err: unknown) {
      const error = err as Error;
      showToast(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTournament = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete tournament "${title}"?`)) return;
    setSaving(true);
    try {
      const token = await getIdToken();
      const res = await fetch(`/api/admin/tournaments?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Delete failed");
      showToast(`Tournament "${title}" deleted.`);
      await fetchAllData();
    } catch (err: unknown) {
      const error = err as Error;
      showToast(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // 5. GALLERY
  const handleSaveGallery = async (item: JournalPost) => {
    setSaving(true);
    setFieldErrors({});
    const parsed = GalleryItemSchema.safeParse(item);
    if (!parsed.success) {
      const errMap: Record<string, string> = {};
      parsed.error.issues.forEach((iss) => {
        errMap[iss.path.join(".")] = iss.message;
      });
      setFieldErrors(errMap);
      setSaving(false);
      showToast("Please fill in the gallery item fields.", "error");
      return;
    }

    try {
      const token = await getIdToken();
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed");
      showToast(`Gallery post "${parsed.data.title}" saved!`);
      setEditingGallery(null);
      await fetchAllData();
    } catch (err: unknown) {
      const error = err as Error;
      showToast(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGallery = async (id: string, title: string) => {
    if (!confirm(`Delete gallery post "${title}"?`)) return;
    setSaving(true);
    try {
      const token = await getIdToken();
      const res = await fetch(`/api/admin/gallery?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Delete failed");
      showToast(`Gallery post "${title}" deleted.`);
      await fetchAllData();
    } catch (err: unknown) {
      const error = err as Error;
      showToast(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // 6. TESTIMONIALS / REVIEWS
  const handleSaveTestimonial = async (t: TestimonialItem) => {
    setSaving(true);
    setFieldErrors({});
    const parsed = TestimonialItemSchema.safeParse({
      ...t,
      name: t.name || t.author,
      relation: t.relation || t.role,
      classLabel: t.classLabel || t.cohort,
      rating: Number(t.rating || t.stars || 5),
    });

    if (!parsed.success) {
      const errMap: Record<string, string> = {};
      parsed.error.issues.forEach((iss) => {
        errMap[iss.path.join(".")] = iss.message;
      });
      setFieldErrors(errMap);
      setSaving(false);
      showToast("Please fill in the review fields.", "error");
      return;
    }

    try {
      const token = await getIdToken();
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed");
      showToast(`Review by "${parsed.data.name}" saved!`);
      setEditingTestimonial(null);
      await fetchAllData();
    } catch (err: unknown) {
      const error = err as Error;
      showToast(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTestimonial = async (id: string, name: string) => {
    if (!confirm(`Delete student review by "${name}"?`)) return;
    setSaving(true);
    try {
      const token = await getIdToken();
      const res = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Delete failed");
      showToast(`Review by "${name}" deleted.`);
      await fetchAllData();
    } catch (err: unknown) {
      const error = err as Error;
      showToast(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-lowest text-on-surface flex flex-col font-sans selection:bg-primary selection:text-on-primary">
      {/* Toast Notification Box with chess-success and chess-error tokens */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 px-5 py-4 rounded-xl shadow-2xl border-2 flex items-center gap-3 transition-all max-w-md ${
            toast.type === "error"
              ? "bg-surface border-chess-error text-chess-error"
              : "bg-surface border-chess-success text-chess-success"
          }`}
        >
          <span className="text-2xl shrink-0" aria-hidden="true">
            {toast.type === "error" ? "⚠️" : "✅"}
          </span>
          <div className="text-sm sm:text-base font-medium flex-1 text-on-surface">
            {toast.message}
          </div>
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setToast(null)}
            className="text-on-surface-variant hover:text-on-surface p-1 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-outline-subtle px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Academy Name */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-surface-high border border-primary/40 flex items-center justify-center text-primary text-2xl font-bold shadow-inner">
            ♞
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg sm:text-xl text-on-surface tracking-tight">
                Rahman Chess Academy
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-bold uppercase tracking-wider">
                Admin
              </span>
            </div>
            <div className="text-xs sm:text-sm text-on-surface-variant">
              Signed in as: <strong className="text-on-surface">{user.email}</strong>
            </div>
          </div>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {/* View Live Website Button */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl border border-primary text-primary hover:bg-primary/10 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            <span aria-hidden="true">🌐</span>
            <span>View Live Website</span>
            <span className="text-xs opacity-70">↗</span>
          </Link>

          {/* Seed Defaults Button */}
          <button
            type="button"
            disabled={saving}
            onClick={handleSeedDefaults}
            className="px-3.5 py-2 rounded-xl bg-surface-high hover:bg-surface-highest border border-outline-subtle text-on-surface text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            title="Restore baseline academy content if something was deleted by mistake"
          >
            <span aria-hidden="true">🔄</span>
            <span className="hidden md:inline">Restore Defaults</span>
          </button>

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 rounded-xl border border-chess-error text-chess-error hover:bg-chess-error/10 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            <span aria-hidden="true">🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Page Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Friendly Non-Technical Welcome Banner */}
        <div className="bg-surface border border-outline-subtle rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <h1 className="text-lg sm:text-xl font-bold text-on-surface flex items-center gap-2">
              <span>👋</span>
              <span>Website Content Manager</span>
            </h1>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed max-w-2xl">
              Easily update your online chess courses, coaches, tournaments, and reviews. Click any category tab below to make your changes, then click the green <strong>Save</strong> button.
            </p>
          </div>
          <div className="shrink-0 bg-primary/10 border border-primary/30 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-primary">
            <span>Need Help? WhatsApp Support: </span>
            <a
              href={SITE_CONTACT.whatsappChatUrl(
                "Hello Rahman Chess Academy support, I need guidance with updating the website."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline hover:text-secondary"
            >
              {SITE_CONTACT.phone}
            </a>
          </div>
        </div>

        {/* Category Navigation Tabs */}
        <nav
          aria-label="Management Categories"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5"
        >
          {[
            {
              id: "classes",
              label: "Classes",
              subtitle: "Courses & Curricula",
              icon: "♟️",
              count: classes.length,
            },
            {
              id: "coaches",
              label: "Coaches",
              subtitle: "Grandmasters & Faculty",
              icon: "👨‍🏫",
              count: coaches.length,
            },
            {
              id: "tournaments",
              label: "Tournaments",
              subtitle: "Online Arenas",
              icon: "🏆",
              count: tournaments.length,
            },
            {
              id: "gallery",
              label: "Gallery",
              subtitle: "Photos & Moments",
              icon: "📸",
              count: gallery.length,
            },
            {
              id: "testimonials",
              label: "Reviews",
              subtitle: "Student Testimonials",
              icon: "⭐",
              count: testimonials.length,
            },
            {
              id: "hero",
              label: "Badges",
              subtitle: "Header Highlights",
              icon: "🏷️",
              count: heroTags.length,
            },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`p-3.5 sm:p-4 rounded-xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between gap-1.5 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
                  isActive
                    ? "bg-primary text-on-primary border-primary border-l-[4px] shadow-lg shadow-primary/20 scale-[1.02] font-semibold"
                    : "bg-surface text-on-surface border-outline-subtle hover:border-primary/50 hover:bg-surface-high"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-2xl">{tab.icon}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive ? "bg-black/20 text-on-primary" : "bg-surface-high text-on-surface-variant"
                    }`}
                  >
                    {tab.count}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-base sm:text-lg leading-tight">{tab.label}</div>
                  <div
                    className={`text-xs truncate ${
                      isActive ? "text-on-primary/80" : "text-on-surface-variant"
                    }`}
                  >
                    {tab.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Content Pane */}
        <main className="bg-surface border border-outline-subtle rounded-2xl p-4 sm:p-6 lg:p-8">
          {dataLoading ? (
            <div className="py-24 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-base text-on-surface-variant font-medium">Loading content...</p>
            </div>
          ) : (
            <>
              {/* ========================================================= */}
              {/* TAB 1: CLASSES & PROGRAMS */}
              {/* ========================================================= */}
              {activeTab === "classes" && (
                <div className="space-y-8">
                  {/* Class Section Intro Card */}
                  <div className="bg-surface-low border border-outline-subtle rounded-xl p-5 sm:p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-subtle pb-3">
                      <div>
                        <h2 className="text-lg font-bold text-on-surface">Classes Section Heading</h2>
                        <p className="text-xs sm:text-sm text-on-surface-variant">
                          The headline and description that appear above the classes list on the website.
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={handleSaveClassesSectionIntro}
                        className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:brightness-110 active:brightness-95 transition-all cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                      >
                        {saving ? "Saving..." : "Save Intro Heading"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-on-surface mb-1.5">
                          Top Badge Text (e.g. CURRICULUM & PATHWAYS)
                        </label>
                        <input
                          type="text"
                          value={classesSection.pillLabel}
                          onChange={(e) =>
                            setClassesSection((p) => ({ ...p, pillLabel: e.target.value }))
                          }
                          className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                        />
                        {fieldErrors.pillLabel && (
                          <p className="text-xs text-chess-error mt-1 font-semibold">
                            {fieldErrors.pillLabel}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-on-surface mb-1.5">
                          Main Heading (e.g. Master-Led Chess Coaching)
                        </label>
                        <input
                          type="text"
                          value={classesSection.heading}
                          onChange={(e) =>
                            setClassesSection((p) => ({ ...p, heading: e.target.value }))
                          }
                          className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                        />
                        {fieldErrors.heading && (
                          <p className="text-xs text-chess-error mt-1 font-semibold">
                            {fieldErrors.heading}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-on-surface mb-1.5">
                        Intro Description (1-2 sentences about your training)
                      </label>
                      <textarea
                        rows={2}
                        value={classesSection.description}
                        onChange={(e) =>
                          setClassesSection((p) => ({ ...p, description: e.target.value }))
                        }
                        className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                      />
                      {fieldErrors.description && (
                        <p className="text-xs text-chess-error mt-1 font-semibold">
                          {fieldErrors.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Classes List Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-subtle pb-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-on-surface flex items-center gap-2">
                        <span>♟️</span>
                        <span>Your Online Chess Classes</span>
                      </h2>
                      <p className="text-sm text-on-surface-variant">
                        All classes are conducted 100% online. Pricing is kept private; visitors enroll via WhatsApp.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newClass: ClassTrack = {
                          id: `class-${Date.now()}`,
                          slug: `new-track-${Date.now()}`,
                          title: "New Chess Program",
                          level: "Intermediate",
                          levelTone: "primary",
                          mode: "Online",
                          ratingRange: "Club 1400 - 1800",
                          ratingLabel: "Club 1400 - 1800",
                          description:
                            "Comprehensive interactive coaching covering tactical precision, opening repertoire, and endgame mastery.",
                          duration: "16 Weeks",
                          sessionLength: "75 Mins",
                          batchSize: "Max 5 Students",
                          schedule: "Mon & Fri 18:00 IST",
                          modules: ["Positional Play", "Tactics & Calculation", "Endgame Technique"],
                          perks: "Includes weekly homework sheets & Lichess sparring",
                          formKey: `program-${Date.now()}`,
                          order: classes.length + 1,
                          visible: true,
                        };
                        setEditingClass(newClass);
                      }}
                      className="px-5 py-3 rounded-xl bg-primary text-on-primary font-bold text-base hover:brightness-110 active:brightness-95 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                    >
                      <span className="text-lg">➕</span>
                      <span>Add a New Class</span>
                    </button>
                  </div>

                  {/* Classes Cards List */}
                  <div className="space-y-4">
                    {classes.map((cls, idx) => {
                      const isBeingEdited = editingClass?.id === cls.id;

                      return (
                        <div
                          key={cls.id}
                          className={`rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all border ${
                            isBeingEdited
                              ? "bg-surface-high border-primary ring-1 ring-primary shadow-lg shadow-primary/15"
                              : "bg-surface-low border-outline-subtle hover:border-primary/40"
                          }`}
                        >
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary font-bold text-xs uppercase tracking-wider">
                                {cls.level}
                              </span>
                              <h3 className="font-serif font-bold text-lg sm:text-xl text-on-surface">
                                {cls.title}
                              </h3>
                              {isBeingEdited && (
                                <span className="px-2.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/40 text-xs font-bold uppercase tracking-wider">
                                  Editing
                                </span>
                              )}
                              {cls.visible === false ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-surface-high text-on-surface-variant text-xs font-semibold border border-outline-subtle">
                                  👁️ Hidden from Website
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full bg-chess-success/15 border border-chess-success/40 text-chess-success text-xs font-semibold">
                                  ✅ Visible on Website
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-on-surface-variant line-clamp-2">{cls.description}</p>
                            <div className="flex items-center gap-4 text-xs sm:text-sm text-on-surface-variant/80 flex-wrap">
                              <span>📅 Schedule: <strong className="text-on-surface">{cls.schedule}</strong></span>
                              <span>👥 Batch: <strong className="text-on-surface">{cls.batchSize}</strong></span>
                              <span>⏱️ Duration: <strong className="text-on-surface">{cls.duration}</strong></span>
                            </div>
                          </div>

                          {/* Card Action Buttons */}
                          <div className="flex items-center gap-2 flex-wrap shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-outline-subtle">
                            {/* Move Up */}
                            <button
                              type="button"
                              aria-label={`Move ${cls.title} up`}
                              title="Move Up"
                              onClick={() => handleReorder("classes", idx, "up")}
                              disabled={idx === 0}
                              className="px-3 py-2 rounded-xl bg-surface-high hover:bg-surface-highest border border-outline-subtle disabled:opacity-40 disabled:cursor-not-allowed text-on-surface text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            >
                              ⬆️ Move Up
                            </button>
                            {/* Move Down */}
                            <button
                              type="button"
                              aria-label={`Move ${cls.title} down`}
                              title="Move Down"
                              onClick={() => handleReorder("classes", idx, "down")}
                              disabled={idx === classes.length - 1}
                              className="px-3 py-2 rounded-xl bg-surface-high hover:bg-surface-highest border border-outline-subtle disabled:opacity-40 disabled:cursor-not-allowed text-on-surface text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            >
                              ⬇️ Move Down
                            </button>
                            {/* Visibility Toggle */}
                            <button
                              type="button"
                              aria-label={cls.visible === false ? "Show on website" : "Hide from website"}
                              title={cls.visible === false ? "Show on website" : "Hide from website"}
                              onClick={() => handleToggleVisible("classes", cls)}
                              className="px-3.5 py-2 rounded-xl bg-surface-high hover:bg-surface-highest border border-outline-subtle text-on-surface text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            >
                              {cls.visible === false ? "👁️ Show" : "👁️ Hide"}
                            </button>
                            {/* Edit Button */}
                            <button
                              type="button"
                              aria-label={`Edit ${cls.title}`}
                              onClick={() => setEditingClass(cls)}
                              className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs sm:text-sm hover:brightness-110 active:brightness-95 transition-all shadow-md cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            >
                              <span>✏️</span>
                              <span>Edit Class</span>
                            </button>
                            {/* Delete Button */}
                            <button
                              type="button"
                              aria-label={`Delete ${cls.title}`}
                              onClick={() => handleDeleteClass(cls.id, cls.title)}
                              className="px-3.5 py-2 rounded-xl border border-chess-error text-chess-error hover:bg-chess-error/10 text-xs font-semibold cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Class Edit Modal */}
                  {editingClass && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                      <div className="bg-surface border-2 border-primary/50 rounded-2xl p-6 sm:p-8 max-w-3xl w-full my-auto space-y-6 shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-outline-subtle pb-4">
                          <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-on-surface flex items-center gap-2">
                              <span>✏️</span>
                              <span>
                                {classes.some((c) => c.id === editingClass.id)
                                  ? `Editing: ${editingClass.title}`
                                  : "Add a New Chess Class"}
                              </span>
                            </h3>
                            <p className="text-xs sm:text-sm text-on-surface-variant">
                              Fill in the details below. All academy classes are strictly Online.
                            </p>
                          </div>
                          <button
                            type="button"
                            aria-label="Close dialog"
                            onClick={() => setEditingClass(null)}
                            className="w-9 h-9 rounded-full bg-surface-high hover:bg-surface-highest text-on-surface flex items-center justify-center font-bold text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-5">
                          {/* Title and Web Address */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Class Name *
                              </label>
                              <p className="text-xs text-on-surface-variant mb-1.5">
                                The prominent title students see on the website.
                              </p>
                              <input
                                type="text"
                                value={editingClass.title}
                                onChange={(e) => {
                                  const title = e.target.value;
                                  const autoSlug = title
                                    .toLowerCase()
                                    .replace(/[^a-z0-9]+/g, "-")
                                    .replace(/^-|-$/g, "");
                                  setEditingClass({
                                    ...editingClass,
                                    title,
                                    slug: editingClass.slug ? editingClass.slug : autoSlug,
                                  });
                                }}
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                              {fieldErrors.title && (
                                <p className="text-xs text-chess-error mt-1 font-semibold">
                                  {fieldErrors.title}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Web Address Name (Slug) *
                              </label>
                              <p className="text-xs text-on-surface-variant mb-1.5">
                                Used in the link (lowercase, e.g. fide-prep-track).
                              </p>
                              <input
                                type="text"
                                value={editingClass.slug}
                                onChange={(e) =>
                                  setEditingClass({
                                    ...editingClass,
                                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                                  })
                                }
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                              {fieldErrors.slug && (
                                <p className="text-xs text-chess-error mt-1 font-semibold">
                                  {fieldErrors.slug}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Level & Rating */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Skill Level *
                              </label>
                              <p className="text-xs text-on-surface-variant mb-1.5">
                                e.g. Absolute Beginner, Intermediate
                              </p>
                              <input
                                type="text"
                                value={editingClass.level}
                                onChange={(e) =>
                                  setEditingClass({ ...editingClass, level: e.target.value })
                                }
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Target Rating Range *
                              </label>
                              <p className="text-xs text-on-surface-variant mb-1.5">
                                e.g. Rating 1200 - 1600 or Unrated
                              </p>
                              <input
                                type="text"
                                value={editingClass.ratingLabel || editingClass.ratingRange}
                                onChange={(e) =>
                                  setEditingClass({
                                    ...editingClass,
                                    ratingLabel: e.target.value,
                                    ratingRange: e.target.value,
                                  })
                                }
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Optional Badge
                              </label>
                              <p className="text-xs text-on-surface-variant mb-1.5">
                                e.g. Most Popular, Tournament Prep
                              </p>
                              <input
                                type="text"
                                value={editingClass.badge || ""}
                                onChange={(e) =>
                                  setEditingClass({ ...editingClass, badge: e.target.value })
                                }
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                            </div>
                          </div>

                          {/* Schedule, Duration, Batch */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Weekly Schedule *
                              </label>
                              <p className="text-xs text-on-surface-variant mb-1.5">
                                e.g. Mon & Wed 18:00 IST
                              </p>
                              <input
                                type="text"
                                value={editingClass.schedule}
                                onChange={(e) =>
                                  setEditingClass({ ...editingClass, schedule: e.target.value })
                                }
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Total Course Duration
                              </label>
                              <p className="text-xs text-on-surface-variant mb-1.5">
                                e.g. 12 Weeks or Ongoing
                              </p>
                              <input
                                type="text"
                                value={editingClass.duration}
                                onChange={(e) =>
                                  setEditingClass({ ...editingClass, duration: e.target.value })
                                }
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Batch Size
                              </label>
                              <p className="text-xs text-on-surface-variant mb-1.5">
                                e.g. Max 6 Students or 1-on-1
                              </p>
                              <input
                                type="text"
                                value={editingClass.batchSize}
                                onChange={(e) =>
                                  setEditingClass({ ...editingClass, batchSize: e.target.value })
                                }
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <label className="block text-sm font-semibold text-on-surface mb-1">
                              Class Description *
                            </label>
                            <p className="text-xs text-on-surface-variant mb-1.5">
                              Explain what students achieve and how sessions are taught.
                            </p>
                            <textarea
                              rows={3}
                              value={editingClass.description}
                              onChange={(e) =>
                                setEditingClass({ ...editingClass, description: e.target.value })
                              }
                              className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            />
                            {fieldErrors.description && (
                              <p className="text-xs text-chess-error mt-1 font-semibold">
                                {fieldErrors.description}
                              </p>
                            )}
                          </div>

                          {/* Topics / Modules Chips */}
                          <div className="space-y-2.5">
                            <label className="block text-sm font-semibold text-on-surface">
                              Key Topics Taught in this Class
                            </label>
                            <p className="text-xs text-on-surface-variant">
                              Click &quot;Remove&quot; to delete a topic, or type a new one and click &quot;Add Topic&quot;.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {editingClass.modules.map((mod, mIdx) => (
                                <span
                                  key={mIdx}
                                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/15 border border-primary/40 text-primary text-sm font-semibold"
                                >
                                  <span>{mod}</span>
                                  <button
                                    type="button"
                                    aria-label={`Remove topic ${mod}`}
                                    onClick={() => {
                                      setEditingClass({
                                        ...editingClass,
                                        modules: editingClass.modules.filter((_, i) => i !== mIdx),
                                      });
                                    }}
                                    className="text-chess-error hover:text-white font-bold text-base cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
                                    title="Remove this topic"
                                  >
                                    ✕
                                  </button>
                                </span>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="e.g. Tactical Calculation & Endgame Principles"
                                value={moduleInput}
                                onChange={(e) => setModuleInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    if (moduleInput.trim()) {
                                      setEditingClass({
                                        ...editingClass,
                                        modules: [...editingClass.modules, moduleInput.trim()],
                                      });
                                      setModuleInput("");
                                    }
                                  }
                                }}
                                className="flex-1 bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (moduleInput.trim()) {
                                    setEditingClass({
                                      ...editingClass,
                                      modules: [...editingClass.modules, moduleInput.trim()],
                                    });
                                    setModuleInput("");
                                  }
                                }}
                                className="px-5 py-2.5 rounded-xl border border-primary text-primary hover:bg-primary/10 font-bold text-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              >
                                ➕ Add Topic
                              </button>
                            </div>
                          </div>

                          {/* Perks */}
                          <div>
                            <label className="block text-sm font-semibold text-on-surface mb-1">
                              Included Perks (Optional)
                            </label>
                            <p className="text-xs text-on-surface-variant mb-1.5">
                              e.g. Includes weekly homework sheets & Lichess sparring
                            </p>
                            <input
                              type="text"
                              value={editingClass.perks || ""}
                              onChange={(e) =>
                                setEditingClass({ ...editingClass, perks: e.target.value })
                              }
                              className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            />
                          </div>

                          {/* Show on website toggle with distinct ON (gold) vs OFF (grey) states */}
                          <div className="pt-2">
                            <label className="flex items-center gap-3.5 cursor-pointer select-none">
                              <button
                                type="button"
                                role="switch"
                                aria-checked={editingClass.visible !== false}
                                onClick={() =>
                                  setEditingClass({
                                    ...editingClass,
                                    visible: editingClass.visible === false ? true : false,
                                  })
                                }
                                className={`w-14 h-8 rounded-full p-1 transition-colors relative border ${
                                  editingClass.visible !== false
                                    ? "bg-primary border-primary"
                                    : "bg-surface-highest border-outline-subtle"
                                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface`}
                              >
                                <span
                                  className={`block w-6 h-6 rounded-full transition-transform ${
                                    editingClass.visible !== false
                                      ? "translate-x-6 bg-on-primary"
                                      : "translate-x-0 bg-on-surface-variant"
                                  }`}
                                />
                              </button>
                              <span className="text-base font-semibold text-on-surface">
                                {editingClass.visible !== false
                                  ? "✅ Visible on Website (Public)"
                                  : "👁️ Hidden from Website (Draft)"}
                              </span>
                            </label>
                          </div>
                        </div>

                        {/* Modal Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-5 border-t border-outline-subtle">
                          <button
                            type="button"
                            onClick={() => setEditingClass(null)}
                            className="px-5 py-3 rounded-xl bg-surface-high hover:bg-surface-highest border border-outline-subtle text-on-surface font-semibold text-base transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => handleSaveClass(editingClass)}
                            className="px-6 py-3 rounded-xl bg-primary text-on-primary font-bold text-base hover:brightness-110 active:brightness-95 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                          >
                            <span>💾</span>
                            <span>{saving ? "Saving..." : "Save Changes to Website"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 2: GRANDMASTERS & COACHES */}
              {/* ========================================================= */}
              {activeTab === "coaches" && (
                <div className="space-y-6">
                  {/* Coaches Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-subtle pb-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-on-surface flex items-center gap-2">
                        <span>👨‍🏫</span>
                        <span>Grandmasters & Faculty</span>
                      </h2>
                      <p className="text-sm text-on-surface-variant">
                        Manage your academy coaches, titles, FIDE ratings, and photo portraits.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newCoach: CoachProfile = {
                          id: `coach-${Date.now()}`,
                          name: "Grandmaster Coach",
                          imageUrl: "/coaches/coach-levon.webp",
                          imagePublicId: "coach-levon",
                          imageAlt: "Grandmaster Coach teaching chess online",
                          roleLine: "FIDE Senior Trainer • 15+ Years Experience",
                          role: "FIDE Senior Trainer • 15+ Years Experience",
                          peakRating: "PEAK 2650 FIDE",
                          badge: "International GM",
                          bio: "Dedicated master instructor specializing in tactical mastery, dynamic attacking principles, and personalized student development.",
                          specialties: ["Attacking Chess", "Endgame Technique", "Repertoire Building"],
                          order: coaches.length + 1,
                          visible: true,
                        };
                        setEditingCoach(newCoach);
                      }}
                      className="px-5 py-3 rounded-xl bg-primary text-on-primary font-bold text-base hover:brightness-110 active:brightness-95 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                    >
                      <span className="text-lg">➕</span>
                      <span>Add a New Coach</span>
                    </button>
                  </div>

                  {/* Coaches List */}
                  <div className="space-y-4">
                    {coaches.map((c, idx) => {
                      const isBeingEdited = editingCoach?.id === c.id;

                      return (
                        <div
                          key={c.id}
                          className={`rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all border ${
                            isBeingEdited
                              ? "bg-surface-high border-primary ring-1 ring-primary shadow-lg shadow-primary/15"
                              : "bg-surface-low border-outline-subtle hover:border-primary/40"
                          }`}
                        >
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary font-bold text-xs uppercase tracking-wider">
                                {c.peakRating}
                              </span>
                              <h3 className="font-serif font-bold text-lg sm:text-xl text-on-surface">
                                {c.name}
                              </h3>
                              {isBeingEdited && (
                                <span className="px-2.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/40 text-xs font-bold uppercase tracking-wider">
                                  Editing
                                </span>
                              )}
                              {c.badge && (
                                <span className="px-2.5 py-0.5 rounded-full bg-surface-high text-on-surface-variant text-xs font-semibold border border-outline-subtle">
                                  {c.badge}
                                </span>
                              )}
                              {c.visible === false ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-surface-high text-on-surface-variant text-xs font-semibold border border-outline-subtle">
                                  👁️ Hidden from Website
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full bg-chess-success/15 border border-chess-success/40 text-chess-success text-xs font-semibold">
                                  ✅ Visible on Website
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-on-surface font-medium">
                              {c.roleLine || c.role}
                            </p>
                            <p className="text-sm text-on-surface-variant line-clamp-2">{c.bio}</p>
                          </div>

                          {/* Coach Actions */}
                          <div className="flex items-center gap-2 flex-wrap shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-outline-subtle">
                            <button
                              type="button"
                              aria-label={`Move ${c.name} up`}
                              title="Move Up"
                              onClick={() => handleReorder("coaches", idx, "up")}
                              disabled={idx === 0}
                              className="px-3 py-2 rounded-xl bg-surface-high hover:bg-surface-highest border border-outline-subtle disabled:opacity-40 disabled:cursor-not-allowed text-on-surface text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            >
                              ⬆️ Move Up
                            </button>
                            <button
                              type="button"
                              aria-label={`Move ${c.name} down`}
                              title="Move Down"
                              onClick={() => handleReorder("coaches", idx, "down")}
                              disabled={idx === coaches.length - 1}
                              className="px-3 py-2 rounded-xl bg-surface-high hover:bg-surface-highest border border-outline-subtle disabled:opacity-40 disabled:cursor-not-allowed text-on-surface text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            >
                              ⬇️ Move Down
                            </button>
                            <button
                              type="button"
                              aria-label={c.visible === false ? "Show on website" : "Hide from website"}
                              title={c.visible === false ? "Show on website" : "Hide from website"}
                              onClick={() => handleToggleVisible("coaches", c)}
                              className="px-3.5 py-2 rounded-xl bg-surface-high hover:bg-surface-highest border border-outline-subtle text-on-surface text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            >
                              {c.visible === false ? "👁️ Show" : "👁️ Hide"}
                            </button>
                            <button
                              type="button"
                              aria-label={`Edit ${c.name}`}
                              onClick={() => setEditingCoach(c)}
                              className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs sm:text-sm hover:brightness-110 active:brightness-95 transition-all shadow-md cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            >
                              <span>✏️</span>
                              <span>Edit Profile</span>
                            </button>
                            <button
                              type="button"
                              aria-label={`Delete ${c.name}`}
                              onClick={() => handleDeleteCoach(c.id, c.name)}
                              className="px-3.5 py-2 rounded-xl border border-chess-error text-chess-error hover:bg-chess-error/10 text-xs font-semibold cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Coach Edit Modal */}
                  {editingCoach && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                      <div className="bg-surface border-2 border-primary/50 rounded-2xl p-6 sm:p-8 max-w-3xl w-full my-auto space-y-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-outline-subtle pb-4">
                          <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-on-surface flex items-center gap-2">
                              <span>👨‍🏫</span>
                              <span>
                                {coaches.some((c) => c.id === editingCoach.id)
                                  ? `Editing: ${editingCoach.name}`
                                  : "Add a New Coach"}
                              </span>
                            </h3>
                            <p className="text-xs sm:text-sm text-on-surface-variant">
                              Upload their photo and describe their chess pedigree.
                            </p>
                          </div>
                          <button
                            type="button"
                            aria-label="Close dialog"
                            onClick={() => setEditingCoach(null)}
                            className="w-9 h-9 rounded-full bg-surface-high hover:bg-surface-highest text-on-surface flex items-center justify-center font-bold text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="space-y-5">
                          {/* Photo Upload */}
                          <div>
                            <label className="block text-sm font-semibold text-on-surface mb-1.5">
                              Coach Portrait Photo
                            </label>
                            <ImageUploader
                              value={editingCoach.imageUrl}
                              publicId={editingCoach.imagePublicId}
                              folderType="coaches"
                              getToken={getIdToken}
                              onChange={(imageUrl, imagePublicId) =>
                                setEditingCoach({ ...editingCoach, imageUrl, imagePublicId })
                              }
                            />
                            {fieldErrors.imageUrl && (
                              <p className="text-xs text-chess-error mt-1 font-semibold">
                                {fieldErrors.imageUrl}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Full Name *
                              </label>
                              <input
                                type="text"
                                value={editingCoach.name}
                                onChange={(e) =>
                                  setEditingCoach({ ...editingCoach, name: e.target.value })
                                }
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                              {fieldErrors.name && (
                                <p className="text-xs text-chess-error mt-1 font-semibold">
                                  {fieldErrors.name}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Peak FIDE Rating *
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. PEAK 2785 FIDE"
                                value={editingCoach.peakRating}
                                onChange={(e) =>
                                  setEditingCoach({ ...editingCoach, peakRating: e.target.value })
                                }
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Title / Experience Line *
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. FIDE Senior Trainer • 18 Years Exp"
                                value={editingCoach.roleLine || editingCoach.role}
                                onChange={(e) =>
                                  setEditingCoach({
                                    ...editingCoach,
                                    roleLine: e.target.value,
                                    role: e.target.value,
                                  })
                                }
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Optional Badge
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Super GM, Former National Champion"
                                value={editingCoach.badge || ""}
                                onChange={(e) =>
                                  setEditingCoach({ ...editingCoach, badge: e.target.value })
                                }
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-on-surface mb-1">
                              Coach Biography *
                            </label>
                            <textarea
                              rows={3}
                              value={editingCoach.bio}
                              onChange={(e) =>
                                setEditingCoach({ ...editingCoach, bio: e.target.value })
                              }
                              className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            />
                            {fieldErrors.bio && (
                              <p className="text-xs text-chess-error mt-1 font-semibold">
                                {fieldErrors.bio}
                              </p>
                            )}
                          </div>

                          {/* Specialties */}
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-on-surface">
                              Teaching Specialties
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {(editingCoach.specialties || []).map((sp, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/15 border border-primary/40 text-primary text-sm font-semibold"
                                >
                                  <span>{sp}</span>
                                  <button
                                    type="button"
                                    aria-label={`Remove specialty ${sp}`}
                                    onClick={() => {
                                      const cur = editingCoach.specialties || [];
                                      setEditingCoach({
                                        ...editingCoach,
                                        specialties: cur.filter((_, i) => i !== sIdx),
                                      });
                                    }}
                                    className="text-chess-error hover:text-white font-bold text-base cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
                                  >
                                    ✕
                                  </button>
                                </span>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="e.g. Sicilian Defense, Queen Endgames"
                                value={specialtyInput}
                                onChange={(e) => setSpecialtyInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    if (specialtyInput.trim()) {
                                      const cur = editingCoach.specialties || [];
                                      setEditingCoach({
                                        ...editingCoach,
                                        specialties: [...cur, specialtyInput.trim()],
                                      });
                                      setSpecialtyInput("");
                                    }
                                  }
                                }}
                                className="flex-1 bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (specialtyInput.trim()) {
                                    const cur = editingCoach.specialties || [];
                                    setEditingCoach({
                                      ...editingCoach,
                                      specialties: [...cur, specialtyInput.trim()],
                                    });
                                    setSpecialtyInput("");
                                  }
                                }}
                                className="px-5 py-2.5 rounded-xl border border-primary text-primary hover:bg-primary/10 font-bold text-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              >
                                ➕ Add Specialty
                              </button>
                            </div>
                          </div>

                          {/* Toggle */}
                          <div className="pt-2">
                            <label className="flex items-center gap-3.5 cursor-pointer select-none">
                              <button
                                type="button"
                                role="switch"
                                aria-checked={editingCoach.visible !== false}
                                onClick={() =>
                                  setEditingCoach({
                                    ...editingCoach,
                                    visible: editingCoach.visible === false ? true : false,
                                  })
                                }
                                className={`w-14 h-8 rounded-full p-1 transition-colors relative border ${
                                  editingCoach.visible !== false
                                    ? "bg-primary border-primary"
                                    : "bg-surface-highest border-outline-subtle"
                                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface`}
                              >
                                <span
                                  className={`block w-6 h-6 rounded-full transition-transform ${
                                    editingCoach.visible !== false
                                      ? "translate-x-6 bg-on-primary"
                                      : "translate-x-0 bg-on-surface-variant"
                                  }`}
                                />
                              </button>
                              <span className="text-base font-semibold text-on-surface">
                                {editingCoach.visible !== false
                                  ? "✅ Visible on Website (Public)"
                                  : "👁️ Hidden from Website (Draft)"}
                              </span>
                            </label>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-5 border-t border-outline-subtle">
                          <button
                            type="button"
                            onClick={() => setEditingCoach(null)}
                            className="px-5 py-3 rounded-xl bg-surface-high hover:bg-surface-highest border border-outline-subtle text-on-surface font-semibold text-base transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => handleSaveCoach(editingCoach)}
                            className="px-6 py-3 rounded-xl bg-primary text-on-primary font-bold text-base hover:brightness-110 active:brightness-95 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                          >
                            <span>💾</span>
                            <span>{saving ? "Saving..." : "Save Coach to Website"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 3: TOURNAMENTS */}
              {/* ========================================================= */}
              {activeTab === "tournaments" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-subtle pb-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-on-surface flex items-center gap-2">
                        <span>🏆</span>
                        <span>Online Tournaments & Battles</span>
                      </h2>
                      <p className="text-sm text-on-surface-variant">
                        Manage arena battles on Lichess or Chess.com for your academy students.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newTourn: TournamentEvent = {
                          id: `tourn-${Date.now()}`,
                          statusLabel: "Weekly Arena",
                          statusTone: "upcoming",
                          platform: "Lichess.org",
                          title: "Rahman Sunday Blitz Arena",
                          description:
                            "Weekly Swiss blitz competition with live master tactical analysis.",
                          format: "Blitz (Swiss 7 Rounds)",
                          timeControl: "3 min + 2 sec inc",
                          dayTime: "Every Sunday, 19:30 IST",
                          ctaType: "link",
                          ctaLabel: "Join on Lichess",
                          ctaUrl: "https://lichess.org",
                          order: tournaments.length + 1,
                          visible: true,
                        };
                        setEditingTournament(newTourn);
                      }}
                      className="px-5 py-3 rounded-xl bg-primary text-on-primary font-bold text-base hover:brightness-110 active:brightness-95 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                    >
                      <span className="text-lg">➕</span>
                      <span>Add a Tournament</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {tournaments.map((t, idx) => {
                      const isBeingEdited = editingTournament?.id === t.id;

                      return (
                        <div
                          key={t.id}
                          className={`rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all border ${
                            isBeingEdited
                              ? "bg-surface-high border-primary ring-1 ring-primary shadow-lg shadow-primary/15"
                              : "bg-surface-low border-outline-subtle hover:border-primary/40"
                          }`}
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary font-bold text-xs uppercase tracking-wider">
                                {t.statusLabel}
                              </span>
                              <h3 className="font-serif font-bold text-lg sm:text-xl text-on-surface">
                                {t.title}
                              </h3>
                              {isBeingEdited && (
                                <span className="px-2.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/40 text-xs font-bold uppercase tracking-wider">
                                  Editing
                                </span>
                              )}
                              {t.visible === false ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-surface-high text-on-surface-variant text-xs font-semibold border border-outline-subtle">
                                  👁️ Hidden from Website
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full bg-chess-success/15 border border-chess-success/40 text-chess-success text-xs font-semibold">
                                  ✅ Visible on Website
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-on-surface-variant">{t.description}</p>
                            <div className="flex items-center gap-4 text-xs sm:text-sm text-on-surface-variant/80 flex-wrap">
                              <span>Platform: <strong className="text-on-surface">{t.platform}</strong></span>
                              <span>Format: <strong className="text-on-surface">{t.format}</strong></span>
                              <span>Time: <strong className="text-on-surface">{t.dayTime}</strong></span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-outline-subtle">
                            <button
                              type="button"
                              aria-label={`Move ${t.title} up`}
                              title="Move Up"
                              onClick={() => handleReorder("tournaments", idx, "up")}
                              disabled={idx === 0}
                              className="px-3 py-2 rounded-xl bg-surface-high hover:bg-surface-highest border border-outline-subtle disabled:opacity-40 disabled:cursor-not-allowed text-on-surface text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            >
                              ⬆️ Move Up
                            </button>
                            <button
                              type="button"
                              aria-label={`Move ${t.title} down`}
                              title="Move Down"
                              onClick={() => handleReorder("tournaments", idx, "down")}
                              disabled={idx === tournaments.length - 1}
                              className="px-3 py-2 rounded-xl bg-surface-high hover:bg-surface-highest border border-outline-subtle disabled:opacity-40 disabled:cursor-not-allowed text-on-surface text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            >
                              ⬇️ Move Down
                            </button>
                            <button
                              type="button"
                              aria-label={t.visible === false ? "Show on website" : "Hide from website"}
                              title={t.visible === false ? "Show on website" : "Hide from website"}
                              onClick={() => handleToggleVisible("tournaments", t)}
                              className="px-3.5 py-2 rounded-xl bg-surface-high hover:bg-surface-highest border border-outline-subtle text-on-surface text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            >
                              {t.visible === false ? "👁️ Show" : "👁️ Hide"}
                            </button>
                            <button
                              type="button"
                              aria-label={`Edit ${t.title}`}
                              onClick={() => setEditingTournament(t)}
                              className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs sm:text-sm hover:brightness-110 active:brightness-95 transition-all shadow-md cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            >
                              <span>✏️</span>
                              <span>Edit Event</span>
                            </button>
                            <button
                              type="button"
                              aria-label={`Delete ${t.title}`}
                              onClick={() => handleDeleteTournament(t.id, t.title)}
                              className="px-3.5 py-2 rounded-xl border border-chess-error text-chess-error hover:bg-chess-error/10 text-xs font-semibold cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Tournament Edit Modal */}
                  {editingTournament && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                      <div className="bg-surface border-2 border-primary/50 rounded-2xl p-6 sm:p-8 max-w-3xl w-full my-auto space-y-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-outline-subtle pb-4">
                          <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-on-surface flex items-center gap-2">
                              <span>🏆</span>
                              <span>
                                {tournaments.some((t) => t.id === editingTournament.id)
                                  ? `Editing: ${editingTournament.title}`
                                  : "Add a New Tournament"}
                              </span>
                            </h3>
                            <p className="text-xs sm:text-sm text-on-surface-variant">
                              Configure the competition format, time control, and platform.
                            </p>
                          </div>
                          <button
                            type="button"
                            aria-label="Close dialog"
                            onClick={() => setEditingTournament(null)}
                            className="w-9 h-9 rounded-full bg-surface-high hover:bg-surface-highest text-on-surface flex items-center justify-center font-bold text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="space-y-5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Tournament Title *
                              </label>
                              <input
                                type="text"
                                value={editingTournament.title}
                                onChange={(e) =>
                                  setEditingTournament({
                                    ...editingTournament,
                                    title: e.target.value,
                                  })
                                }
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Platform (e.g. Lichess.org, Chess.com) *
                              </label>
                              <input
                                type="text"
                                value={editingTournament.platform}
                                onChange={(e) =>
                                  setEditingTournament({
                                    ...editingTournament,
                                    platform: e.target.value,
                                  })
                                }
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Status Badge Text *
                              </label>
                              <input
                                type="text"
                                placeholder="Weekly Arena, Live Now"
                                value={editingTournament.statusLabel}
                                onChange={(e) =>
                                  setEditingTournament({
                                    ...editingTournament,
                                    statusLabel: e.target.value,
                                  })
                                }
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Badge Style
                              </label>
                              <select
                                value={editingTournament.statusTone}
                                onChange={(e) =>
                                  setEditingTournament({
                                    ...editingTournament,
                                    statusTone: e.target.value as "live" | "upcoming" | "monthly",
                                  })
                                }
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              >
                                <option value="upcoming">Upcoming (Gold Accent)</option>
                                <option value="live">Live Now (Red Glow)</option>
                                <option value="monthly">Monthly Event (Amber)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Time Control *
                              </label>
                              <input
                                type="text"
                                placeholder="3 min + 2 sec inc"
                                value={editingTournament.timeControl}
                                onChange={(e) =>
                                  setEditingTournament({
                                    ...editingTournament,
                                    timeControl: e.target.value,
                                  })
                                }
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Competition Format *
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Blitz (Swiss 7 Rounds)"
                                value={editingTournament.format}
                                onChange={(e) =>
                                  setEditingTournament({
                                    ...editingTournament,
                                    format: e.target.value,
                                  })
                                }
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Day & Schedule *
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Every Sunday, 19:30 IST"
                                value={editingTournament.dayTime}
                                onChange={(e) =>
                                  setEditingTournament({
                                    ...editingTournament,
                                    dayTime: e.target.value,
                                  })
                                }
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-on-surface mb-1">
                              Description *
                            </label>
                            <textarea
                              rows={2}
                              value={editingTournament.description}
                              onChange={(e) =>
                                setEditingTournament({
                                  ...editingTournament,
                                  description: e.target.value,
                                })
                              }
                              className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Button Text *
                              </label>
                              <input
                                type="text"
                                placeholder="Join on Lichess"
                                value={editingTournament.ctaLabel}
                                onChange={(e) =>
                                  setEditingTournament({
                                    ...editingTournament,
                                    ctaLabel: e.target.value,
                                  })
                                }
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Tournament Link URL
                              </label>
                              <input
                                type="url"
                                placeholder="https://lichess.org/tournament/..."
                                value={editingTournament.ctaUrl || ""}
                                onChange={(e) =>
                                  setEditingTournament({
                                    ...editingTournament,
                                    ctaUrl: e.target.value,
                                  })
                                }
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                            </div>
                          </div>

                          {/* Toggle */}
                          <div className="pt-2">
                            <label className="flex items-center gap-3.5 cursor-pointer select-none">
                              <button
                                type="button"
                                role="switch"
                                aria-checked={editingTournament.visible !== false}
                                onClick={() =>
                                  setEditingTournament({
                                    ...editingTournament,
                                    visible: editingTournament.visible === false ? true : false,
                                  })
                                }
                                className={`w-14 h-8 rounded-full p-1 transition-colors relative border ${
                                  editingTournament.visible !== false
                                    ? "bg-primary border-primary"
                                    : "bg-surface-highest border-outline-subtle"
                                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface`}
                              >
                                <span
                                  className={`block w-6 h-6 rounded-full transition-transform ${
                                    editingTournament.visible !== false
                                      ? "translate-x-6 bg-on-primary"
                                      : "translate-x-0 bg-on-surface-variant"
                                  }`}
                                />
                              </button>
                              <span className="text-base font-semibold text-on-surface">
                                {editingTournament.visible !== false
                                  ? "✅ Visible on Website (Public)"
                                  : "👁️ Hidden from Website (Draft)"}
                              </span>
                            </label>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-5 border-t border-outline-subtle">
                          <button
                            type="button"
                            onClick={() => setEditingTournament(null)}
                            className="px-5 py-3 rounded-xl bg-surface-high hover:bg-surface-highest border border-outline-subtle text-on-surface font-semibold text-base transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => handleSaveTournament(editingTournament)}
                            className="px-6 py-3 rounded-xl bg-primary text-on-primary font-bold text-base hover:brightness-110 active:brightness-95 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                          >
                            <span>💾</span>
                            <span>{saving ? "Saving..." : "Save Tournament to Website"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 4: GALLERY & DISPATCHES */}
              {/* ========================================================= */}
              {activeTab === "gallery" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-subtle pb-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-on-surface flex items-center gap-2">
                        <span>📸</span>
                        <span>Photo Gallery & Dispatches</span>
                      </h2>
                      <p className="text-sm text-on-surface-variant">
                        Share highlights from online matches, simuls, and academy announcements.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newPost: JournalPost = {
                          id: `gallery-${Date.now()}`,
                          category: "classes",
                          imageUrl: "/coaches/coach-levon.webp",
                          imagePublicId: "gallery-sample",
                          imageAlt: "Chess tactical seminar",
                          dateLabel: "Spring 2026",
                          kicker: "Grandmaster Seminar",
                          title: "Mastering Queen's Indian Dynamics",
                          excerpt:
                            "Interactive group analysis with academy grandmasters examining critical middlegame plans.",
                          order: gallery.length + 1,
                          visible: true,
                        };
                        setEditingGallery(newPost);
                      }}
                      className="px-5 py-3 rounded-xl bg-primary text-on-primary font-bold text-base hover:brightness-110 active:brightness-95 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                    >
                      <span className="text-lg">➕</span>
                      <span>Add a Photo Post</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {gallery.map((g, idx) => {
                      const isBeingEdited = editingGallery?.id === g.id;

                      return (
                        <div
                          key={g.id}
                          className={`rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all border ${
                            isBeingEdited
                              ? "bg-surface-high border-primary ring-1 ring-primary shadow-lg shadow-primary/15"
                              : "bg-surface-low border-outline-subtle hover:border-primary/40"
                          }`}
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary font-bold text-xs uppercase tracking-wider">
                                {g.dateLabel}
                              </span>
                              <h3 className="font-serif font-bold text-lg sm:text-xl text-on-surface">
                                {g.title}
                              </h3>
                              {isBeingEdited && (
                                <span className="px-2.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/40 text-xs font-bold uppercase tracking-wider">
                                  Editing
                                </span>
                              )}
                              {g.visible === false ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-surface-high text-on-surface-variant text-xs font-semibold border border-outline-subtle">
                                  👁️ Hidden from Website
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full bg-chess-success/15 border border-chess-success/40 text-chess-success text-xs font-semibold">
                                  ✅ Visible on Website
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-on-surface-variant line-clamp-2">{g.excerpt}</p>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-outline-subtle">
                            <button
                              type="button"
                              aria-label={`Move ${g.title} up`}
                              title="Move Up"
                              onClick={() => handleReorder("gallery", idx, "up")}
                              disabled={idx === 0}
                              className="px-3 py-2 rounded-xl bg-surface-high hover:bg-surface-highest border border-outline-subtle disabled:opacity-40 disabled:cursor-not-allowed text-on-surface text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            >
                              ⬆️ Move Up
                            </button>
                            <button
                              type="button"
                              aria-label={`Move ${g.title} down`}
                              title="Move Down"
                              onClick={() => handleReorder("gallery", idx, "down")}
                              disabled={idx === gallery.length - 1}
                              className="px-3 py-2 rounded-xl bg-surface-high hover:bg-surface-highest border border-outline-subtle disabled:opacity-40 disabled:cursor-not-allowed text-on-surface text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            >
                              ⬇️ Move Down
                            </button>
                            <button
                              type="button"
                              aria-label={g.visible === false ? "Show on website" : "Hide from website"}
                              title={g.visible === false ? "Show on website" : "Hide from website"}
                              onClick={() => handleToggleVisible("gallery", g)}
                              className="px-3.5 py-2 rounded-xl bg-surface-high hover:bg-surface-highest border border-outline-subtle text-on-surface text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            >
                              {g.visible === false ? "👁️ Show" : "👁️ Hide"}
                            </button>
                            <button
                              type="button"
                              aria-label={`Edit ${g.title}`}
                              onClick={() => setEditingGallery(g)}
                              className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs sm:text-sm hover:brightness-110 active:brightness-95 transition-all shadow-md cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            >
                              <span>✏️</span>
                              <span>Edit Post</span>
                            </button>
                            <button
                              type="button"
                              aria-label={`Delete ${g.title}`}
                              onClick={() => handleDeleteGallery(g.id, g.title)}
                              className="px-3.5 py-2 rounded-xl border border-chess-error text-chess-error hover:bg-chess-error/10 text-xs font-semibold cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Gallery Edit Modal */}
                  {editingGallery && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                      <div className="bg-surface border-2 border-primary/50 rounded-2xl p-6 sm:p-8 max-w-3xl w-full my-auto space-y-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-outline-subtle pb-4">
                          <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-on-surface flex items-center gap-2">
                              <span>📸</span>
                              <span>
                                {gallery.some((g) => g.id === editingGallery.id)
                                  ? `Editing: ${editingGallery.title}`
                                  : "Add a Photo Dispatch"}
                              </span>
                            </h3>
                            <p className="text-xs sm:text-sm text-on-surface-variant">
                              Upload an image and write a short summary.
                            </p>
                          </div>
                          <button
                            type="button"
                            aria-label="Close dialog"
                            onClick={() => setEditingGallery(null)}
                            className="w-9 h-9 rounded-full bg-surface-high hover:bg-surface-highest text-on-surface flex items-center justify-center font-bold text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="space-y-5">
                          <div>
                            <label className="block text-sm font-semibold text-on-surface mb-1.5">
                              Photo Image
                            </label>
                            <ImageUploader
                              value={editingGallery.imageUrl}
                              publicId={editingGallery.imagePublicId}
                              folderType="gallery"
                              getToken={getIdToken}
                              onChange={(imageUrl, imagePublicId) =>
                                setEditingGallery({ ...editingGallery, imageUrl, imagePublicId })
                              }
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Title *
                              </label>
                              <input
                                type="text"
                                value={editingGallery.title}
                                onChange={(e) =>
                                  setEditingGallery({ ...editingGallery, title: e.target.value })
                                }
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Category *
                              </label>
                              <select
                                value={editingGallery.category}
                                onChange={(e) =>
                                  setEditingGallery({
                                    ...editingGallery,
                                    category: e.target.value as "classes" | "tournaments" | "events",
                                  })
                                }
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              >
                                <option value="classes">Classes & Masterclasses</option>
                                <option value="tournaments">Tournaments & Matches</option>
                                <option value="events">Events & Seminars</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Date Label *
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. October 2026"
                                value={editingGallery.dateLabel}
                                onChange={(e) =>
                                  setEditingGallery({ ...editingGallery, dateLabel: e.target.value })
                                }
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Tag / Kicker
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Masterclass, Junior Simul"
                                value={editingGallery.kicker}
                                onChange={(e) =>
                                  setEditingGallery({ ...editingGallery, kicker: e.target.value })
                                }
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-on-surface mb-1">
                              Summary / Excerpt *
                            </label>
                            <textarea
                              rows={3}
                              value={editingGallery.excerpt}
                              onChange={(e) =>
                                setEditingGallery({ ...editingGallery, excerpt: e.target.value })
                              }
                              className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            />
                          </div>

                          {/* Toggle */}
                          <div className="pt-2">
                            <label className="flex items-center gap-3.5 cursor-pointer select-none">
                              <button
                                type="button"
                                role="switch"
                                aria-checked={editingGallery.visible !== false}
                                onClick={() =>
                                  setEditingGallery({
                                    ...editingGallery,
                                    visible: editingGallery.visible === false ? true : false,
                                  })
                                }
                                className={`w-14 h-8 rounded-full p-1 transition-colors relative border ${
                                  editingGallery.visible !== false
                                    ? "bg-primary border-primary"
                                    : "bg-surface-highest border-outline-subtle"
                                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface`}
                              >
                                <span
                                  className={`block w-6 h-6 rounded-full transition-transform ${
                                    editingGallery.visible !== false
                                      ? "translate-x-6 bg-on-primary"
                                      : "translate-x-0 bg-on-surface-variant"
                                  }`}
                                />
                              </button>
                              <span className="text-base font-semibold text-on-surface">
                                {editingGallery.visible !== false
                                  ? "✅ Visible on Website (Public)"
                                  : "👁️ Hidden from Website (Draft)"}
                              </span>
                            </label>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-5 border-t border-outline-subtle">
                          <button
                            type="button"
                            onClick={() => setEditingGallery(null)}
                            className="px-5 py-3 rounded-xl bg-surface-high hover:bg-surface-highest border border-outline-subtle text-on-surface font-semibold text-base transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => handleSaveGallery(editingGallery)}
                            className="px-6 py-3 rounded-xl bg-primary text-on-primary font-bold text-base hover:brightness-110 active:brightness-95 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                          >
                            <span>💾</span>
                            <span>{saving ? "Saving..." : "Save Post to Website"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 5: STUDENT REVIEWS & TESTIMONIALS */}
              {/* ========================================================= */}
              {activeTab === "testimonials" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-subtle pb-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-on-surface flex items-center gap-2">
                        <span>⭐</span>
                        <span>Student & Parent Reviews</span>
                      </h2>
                      <p className="text-sm text-on-surface-variant">
                        Display trusted parent reviews and student rating achievements.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newTest: TestimonialItem = {
                          id: `review-${Date.now()}`,
                          name: "Parent / Student Name",
                          relation: "Parent of U-12 State Champion",
                          classLabel: "Intermediate Track",
                          rating: 5,
                          quote:
                            "The grandmaster mentorship and structured online opening prep transformed my child's tournament confidence within 4 months.",
                          consentConfirmed: true,
                          order: testimonials.length + 1,
                          visible: true,
                        };
                        setEditingTestimonial(newTest);
                      }}
                      className="px-5 py-3 rounded-xl bg-primary text-on-primary font-bold text-base hover:brightness-110 active:brightness-95 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                    >
                      <span className="text-lg">➕</span>
                      <span>Add a Review</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {testimonials.map((t, idx) => {
                      const isBeingEdited = editingTestimonial?.id === t.id;

                      return (
                        <div
                          key={t.id}
                          className={`rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all border ${
                            isBeingEdited
                              ? "bg-surface-high border-primary ring-1 ring-primary shadow-lg shadow-primary/15"
                              : "bg-surface-low border-outline-subtle hover:border-primary/40"
                          }`}
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-primary font-bold text-base">
                                {"★".repeat(t.rating || t.stars || 5)}
                              </span>
                              <h3 className="font-serif font-bold text-lg sm:text-xl text-on-surface">
                                {t.name || t.author}
                              </h3>
                              {isBeingEdited && (
                                <span className="px-2.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/40 text-xs font-bold uppercase tracking-wider">
                                  Editing
                                </span>
                              )}
                              <span className="text-xs sm:text-sm text-on-surface-variant">
                                ({t.relation || t.role} • {t.classLabel || t.cohort})
                              </span>
                              {t.visible === false ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-surface-high text-on-surface-variant text-xs font-semibold border border-outline-subtle">
                                  👁️ Hidden from Website
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full bg-chess-success/15 border border-chess-success/40 text-chess-success text-xs font-semibold">
                                  ✅ Visible on Website
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-on-surface-variant italic line-clamp-2">
                              &quot;{t.quote}&quot;
                            </p>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-outline-subtle">
                            <button
                              type="button"
                              aria-label={`Move review by ${t.name || t.author} up`}
                              title="Move Up"
                              onClick={() => handleReorder("testimonials", idx, "up")}
                              disabled={idx === 0}
                              className="px-3 py-2 rounded-xl bg-surface-high hover:bg-surface-highest border border-outline-subtle disabled:opacity-40 disabled:cursor-not-allowed text-on-surface text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            >
                              ⬆️ Move Up
                            </button>
                            <button
                              type="button"
                              aria-label={`Move review by ${t.name || t.author} down`}
                              title="Move Down"
                              onClick={() => handleReorder("testimonials", idx, "down")}
                              disabled={idx === testimonials.length - 1}
                              className="px-3 py-2 rounded-xl bg-surface-high hover:bg-surface-highest border border-outline-subtle disabled:opacity-40 disabled:cursor-not-allowed text-on-surface text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            >
                              ⬇️ Move Down
                            </button>
                            <button
                              type="button"
                              aria-label={t.visible === false ? "Show on website" : "Hide from website"}
                              title={t.visible === false ? "Show on website" : "Hide from website"}
                              onClick={() => handleToggleVisible("testimonials", t)}
                              className="px-3.5 py-2 rounded-xl bg-surface-high hover:bg-surface-highest border border-outline-subtle text-on-surface text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            >
                              {t.visible === false ? "👁️ Show" : "👁️ Hide"}
                            </button>
                            <button
                              type="button"
                              aria-label={`Edit review by ${t.name || t.author}`}
                              onClick={() => setEditingTestimonial(t)}
                              className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs sm:text-sm hover:brightness-110 active:brightness-95 transition-all shadow-md cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            >
                              <span>✏️</span>
                              <span>Edit Review</span>
                            </button>
                            <button
                              type="button"
                              aria-label={`Delete review by ${t.name || t.author}`}
                              onClick={() => handleDeleteTestimonial(t.id, t.name || t.author || "Review")}
                              className="px-3.5 py-2 rounded-xl border border-chess-error text-chess-error hover:bg-chess-error/10 text-xs font-semibold cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Review Edit Modal */}
                  {editingTestimonial && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                      <div className="bg-surface border-2 border-primary/50 rounded-2xl p-6 sm:p-8 max-w-2xl w-full my-auto space-y-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-outline-subtle pb-4">
                          <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-on-surface flex items-center gap-2">
                              <span>⭐</span>
                              <span>
                                {testimonials.some((t) => t.id === editingTestimonial.id)
                                  ? `Editing: ${editingTestimonial.name || editingTestimonial.author}`
                                  : "Add a Student Review"}
                              </span>
                            </h3>
                            <p className="text-xs sm:text-sm text-on-surface-variant">
                              Add genuine parent or student feedback.
                            </p>
                          </div>
                          <button
                            type="button"
                            aria-label="Close dialog"
                            onClick={() => setEditingTestimonial(null)}
                            className="w-9 h-9 rounded-full bg-surface-high hover:bg-surface-highest text-on-surface flex items-center justify-center font-bold text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="space-y-5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Author Name *
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Ramesh K."
                                value={editingTestimonial.name || editingTestimonial.author || ""}
                                onChange={(e) =>
                                  setEditingTestimonial({
                                    ...editingTestimonial,
                                    name: e.target.value,
                                    author: e.target.value,
                                  })
                                }
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Star Rating (1 to 5) *
                              </label>
                              <select
                                value={editingTestimonial.rating || editingTestimonial.stars || 5}
                                onChange={(e) =>
                                  setEditingTestimonial({
                                    ...editingTestimonial,
                                    rating: Number(e.target.value),
                                    stars: Number(e.target.value),
                                  })
                                }
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              >
                                <option value={5}>★★★★★ (5 Stars)</option>
                                <option value={4}>★★★★☆ (4 Stars)</option>
                                <option value={3}>★★★☆☆ (3 Stars)</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Relation / Role *
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Parent of U-12 State Champion"
                                value={editingTestimonial.relation || editingTestimonial.role || ""}
                                onChange={(e) =>
                                  setEditingTestimonial({
                                    ...editingTestimonial,
                                    relation: e.target.value,
                                    role: e.target.value,
                                  })
                                }
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-on-surface mb-1">
                                Program Enrolled In *
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Intermediate Track, 1-on-1 Mentorship"
                                value={
                                  editingTestimonial.classLabel || editingTestimonial.cohort || ""
                                }
                                onChange={(e) =>
                                  setEditingTestimonial({
                                    ...editingTestimonial,
                                    classLabel: e.target.value,
                                    cohort: e.target.value,
                                  })
                                }
                                className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-on-surface mb-1">
                              Review Quote *
                            </label>
                            <textarea
                              rows={4}
                              value={editingTestimonial.quote}
                              onChange={(e) =>
                                setEditingTestimonial({
                                  ...editingTestimonial,
                                  quote: e.target.value,
                                })
                              }
                              className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            />
                          </div>

                          <div className="pt-2 flex flex-col gap-2">
                            {/* Toggle */}
                            <label className="flex items-center gap-3.5 cursor-pointer select-none">
                              <button
                                type="button"
                                role="switch"
                                aria-checked={editingTestimonial.visible !== false}
                                onClick={() =>
                                  setEditingTestimonial({
                                    ...editingTestimonial,
                                    visible: editingTestimonial.visible === false ? true : false,
                                  })
                                }
                                className={`w-14 h-8 rounded-full p-1 transition-colors relative border ${
                                  editingTestimonial.visible !== false
                                    ? "bg-primary border-primary"
                                    : "bg-surface-highest border-outline-subtle"
                                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface`}
                              >
                                <span
                                  className={`block w-6 h-6 rounded-full transition-transform ${
                                    editingTestimonial.visible !== false
                                      ? "translate-x-6 bg-on-primary"
                                      : "translate-x-0 bg-on-surface-variant"
                                  }`}
                                />
                              </button>
                              <span className="text-base font-semibold text-on-surface">
                                {editingTestimonial.visible !== false
                                  ? "✅ Visible on Website (Public)"
                                  : "👁️ Hidden from Website (Draft)"}
                              </span>
                            </label>

                            <label className="flex items-center gap-3.5 cursor-pointer select-none mt-2">
                              <input
                                type="checkbox"
                                checked={editingTestimonial.consentConfirmed !== false}
                                onChange={(e) =>
                                  setEditingTestimonial({
                                    ...editingTestimonial,
                                    consentConfirmed: e.target.checked,
                                  })
                                }
                                className="w-5 h-5 accent-primary cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                              />
                              <span className="text-sm text-on-surface-variant font-medium">
                                Parent / Student confirmed consent to publish review
                              </span>
                            </label>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-5 border-t border-outline-subtle">
                          <button
                            type="button"
                            onClick={() => setEditingTestimonial(null)}
                            className="px-5 py-3 rounded-xl bg-surface-high hover:bg-surface-highest border border-outline-subtle text-on-surface font-semibold text-base transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => handleSaveTestimonial(editingTestimonial)}
                            className="px-6 py-3 rounded-xl bg-primary text-on-primary font-bold text-base hover:brightness-110 active:brightness-95 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                          >
                            <span>💾</span>
                            <span>{saving ? "Saving..." : "Save Review to Website"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 6: HERO BADGES */}
              {/* ========================================================= */}
              {activeTab === "hero" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-subtle pb-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-on-surface flex items-center gap-2">
                        <span>🏷️</span>
                        <span>Hero Headline Badges</span>
                      </h2>
                      <p className="text-sm text-on-surface-variant">
                        Feature badges appearing under the main hero headline on your homepage.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleAddHeroTag}
                        className="px-4 py-2.5 rounded-xl border border-primary text-primary hover:bg-primary/10 font-bold text-sm transition-all flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                      >
                        <span>➕</span>
                        <span>Add Badge</span>
                      </button>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={handleSaveHeroTags}
                        className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:brightness-110 active:brightness-95 transition-all shadow-md cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                      >
                        <span>💾</span>
                        <span>{saving ? "Saving..." : "Save Badges"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {heroTags.map((tag, idx) => (
                      <div
                        key={tag.id}
                        className="bg-surface-low border border-outline-subtle rounded-2xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center"
                      >
                        <div className="sm:col-span-1 text-primary font-bold text-lg">
                          #{idx + 1}
                        </div>

                        {/* Icon select */}
                        <div className="sm:col-span-3">
                          <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                            Symbol / Icon
                          </label>
                          <select
                            value={tag.icon}
                            onChange={(e) => {
                              const updated = [...heroTags];
                              updated[idx].icon = e.target.value as (typeof ALLOWED_MATERIAL_ICONS)[number];
                              setHeroTags(updated);
                            }}
                            className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-3 py-2 text-sm text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                          >
                            {ALLOWED_MATERIAL_ICONS.map((ic) => (
                              <option key={ic} value={ic}>
                                {ic}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Label */}
                        <div className="sm:col-span-4">
                          <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                            Badge Text
                          </label>
                          <input
                            type="text"
                            maxLength={50}
                            value={tag.label}
                            onChange={(e) => {
                              const updated = [...heroTags];
                              updated[idx].label = e.target.value;
                              setHeroTags(updated);
                            }}
                            className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-3 py-2 text-sm text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                          />
                        </div>

                        {/* Tone */}
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                            Color Style
                          </label>
                          <select
                            value={tag.tone}
                            onChange={(e) => {
                              const updated = [...heroTags];
                              updated[idx].tone = e.target.value as "primary" | "secondary";
                              setHeroTags(updated);
                            }}
                            className="w-full bg-surface-low border border-outline-subtle focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-3 py-2 text-sm text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                          >
                            <option value="primary">Gold Accent</option>
                            <option value="secondary">Amber Warm</option>
                          </select>
                        </div>

                        {/* Remove */}
                        <div className="sm:col-span-2 flex justify-end">
                          <button
                            type="button"
                            aria-label={`Delete badge ${tag.label}`}
                            onClick={() => {
                              if (heroTags.length <= 1) {
                                showToast("At least one badge is required on the homepage.", "error");
                                return;
                              }
                              setHeroTags(heroTags.filter((_, i) => i !== idx));
                            }}
                            className="px-3 py-2 rounded-xl border border-chess-error text-chess-error hover:bg-chess-error/10 text-xs font-semibold cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-outline-subtle px-6 py-4 text-center text-xs text-on-surface-variant">
        Rahman Chess Academy Management Portal • 100% Online Academy • Support WhatsApp: {SITE_CONTACT.phone}
      </footer>
    </div>
  );
}
