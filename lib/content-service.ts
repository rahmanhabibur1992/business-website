import { unstable_cache } from "next/cache";
import fs from "fs";
import path from "path";
import { hasAdminCredentials, getAdminFirestore } from "./firebase-admin";
import {
  SEED_HERO_TAGS,
  SEED_CLASSES_SECTION,
  CLASSES_DATA,
  COACHES_DATA,
  TOURNAMENTS_DATA,
  GALLERY_DATA,
  TESTIMONIALS_DATA,
  HeroTag,
  ClassesSectionContent,
  ClassTrack,
  CoachProfile,
  TournamentEvent,
  GalleryImage,
  TestimonialItem,
} from "./academy-content";

interface AppContentStore {
  heroTags: HeroTag[];
  classesSection: ClassesSectionContent;
  classes: ClassTrack[];
  coaches: CoachProfile[];
  tournaments: TournamentEvent[];
  gallery: GalleryImage[];
  testimonials: TestimonialItem[];
  updatedAt?: string;
}

const rtdbUrl =
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
  "https://rahman-chess-academy-default-rtdb.asia-southeast1.firebasedatabase.app";

const localStorePath = path.join(process.cwd(), "data", "content-store.json");

function getInitialStore(): AppContentStore {
  return {
    heroTags: SEED_HERO_TAGS,
    classesSection: SEED_CLASSES_SECTION,
    classes: CLASSES_DATA,
    coaches: COACHES_DATA,
    tournaments: TOURNAMENTS_DATA,
    gallery: GALLERY_DATA,
    testimonials: TESTIMONIALS_DATA,
    updatedAt: new Date().toISOString(),
  };
}

function readLocalStore(): AppContentStore {
  try {
    if (fs.existsSync(localStorePath)) {
      const raw = fs.readFileSync(localStorePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Failed reading local content store:", err);
  }
  return getInitialStore();
}

function writeLocalStore(store: AppContentStore): void {
  try {
    const dir = path.dirname(localStorePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(localStorePath, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed writing local content store:", err);
  }
}

/**
 * Firebase RTDB Sync Helpers
 */
async function readFromRtdb<T>(endpoint: string): Promise<T | null> {
  if (!rtdbUrl) return null;
  try {
    const cleanBase = rtdbUrl.replace(/\/+$/, "");
    const res = await fetch(`${cleanBase}/${endpoint}.json`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return data as T;
    }
  } catch (err) {
    console.warn(`RTDB read error (${endpoint}):`, err);
  }
  return null;
}

async function writeToRtdb(endpoint: string, data: unknown): Promise<void> {
  if (!rtdbUrl) return;
  try {
    const cleanBase = rtdbUrl.replace(/\/+$/, "");
    await fetch(`${cleanBase}/${endpoint}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.warn(`RTDB write error (${endpoint}):`, err);
  }
}

/**
 * Read Content with Multiple Fallbacks:
 * 1. Firestore (if credentials exist and enabled)
 * 2. Firebase Realtime Database (active in this project)
 * 3. Local file store
 * 4. Codebase Seed Defaults
 */

async function fetchHeroTagsRaw(): Promise<HeroTag[]> {
  // 1. Try Firestore if credentials exist
  if (hasAdminCredentials()) {
    try {
      const fsDb = getAdminFirestore();
      if (fsDb) {
        const doc = await fsDb.collection("site_content").doc("hero").get();
        if (doc.exists && doc.data()?.tags?.length > 0) {
          return doc.data()!.tags as HeroTag[];
        }
      }
    } catch {
      // fallback
    }
  }

  // 2. Try Firebase Realtime Database
  const rtdbData = await readFromRtdb<HeroTag[]>("site_content/hero/tags");
  if (Array.isArray(rtdbData) && rtdbData.length > 0) {
    return rtdbData;
  }

  // 3. Try Local Store
  const local = readLocalStore();
  if (local.heroTags && local.heroTags.length > 0) {
    return local.heroTags;
  }

  return SEED_HERO_TAGS;
}

async function fetchClassesSectionRaw(): Promise<ClassesSectionContent> {
  if (hasAdminCredentials()) {
    try {
      const fsDb = getAdminFirestore();
      if (fsDb) {
        const doc = await fsDb.collection("site_content").doc("classesSection").get();
        if (doc.exists && doc.data()?.heading) {
          return doc.data() as ClassesSectionContent;
        }
      }
    } catch {
      // fallback
    }
  }

  const rtdbData = await readFromRtdb<ClassesSectionContent>("site_content/classesSection");
  if (rtdbData && rtdbData.heading) {
    return rtdbData;
  }

  const local = readLocalStore();
  if (local.classesSection && local.classesSection.heading) {
    return local.classesSection;
  }

  return SEED_CLASSES_SECTION;
}

function sanitizeClassTrack(raw: unknown): ClassTrack {
  if (!raw || typeof raw !== "object") return raw as unknown as ClassTrack;
  const clean = { ...(raw as Record<string, unknown>) };
  delete clean.duration;
  delete clean.sessionLength;
  delete clean.schedule;
  return clean as unknown as ClassTrack;
}

function sanitizeTournamentEvent(raw: unknown): TournamentEvent {
  if (!raw || typeof raw !== "object") return raw as unknown as TournamentEvent;
  const clean = { ...(raw as Record<string, unknown>) };
  delete clean.ctaType;
  delete clean.action;
  return clean as unknown as TournamentEvent;
}

function sanitizeGalleryImage(raw: unknown, index = 0): GalleryImage {
  const item = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    id: String(item.id || `gallery-${index + 1}`),
    imageUrl: String(item.imageUrl || item.image || ""),
    imagePublicId: (item.imagePublicId as string) || "",
    width: typeof item.width === "number" ? item.width : undefined,
    height: typeof item.height === "number" ? item.height : undefined,
    imageAlt: (item.imageAlt as string) || `Rahman Chess Academy online chess class – photo ${index + 1}`,
    order: typeof item.order === "number" ? item.order : index + 1,
    visible: item.visible !== false,
  };
}

async function fetchClassesRaw(): Promise<ClassTrack[]> {
  if (hasAdminCredentials()) {
    try {
      const fsDb = getAdminFirestore();
      if (fsDb) {
        const snap = await fsDb.collection("classes").get();
        if (!snap.empty) {
          const list = snap.docs.map((d) => sanitizeClassTrack({ id: d.id, ...d.data() }));
          list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          return list;
        }
      }
    } catch {
      // fallback
    }
  }

  const rtdbData = await readFromRtdb<Record<string, ClassTrack> | ClassTrack[]>("classes");
  if (rtdbData) {
    const list = Array.isArray(rtdbData) ? rtdbData.filter(Boolean) : Object.values(rtdbData);
    if (list.length > 0) {
      const sanitized = list.map(sanitizeClassTrack);
      sanitized.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      return sanitized;
    }
  }

  const local = readLocalStore();
  if (local.classes && local.classes.length > 0) {
    const sanitized = local.classes.map(sanitizeClassTrack);
    sanitized.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return sanitized;
  }

  return CLASSES_DATA.map(sanitizeClassTrack);
}

async function fetchCoachesRaw(): Promise<CoachProfile[]> {
  if (hasAdminCredentials()) {
    try {
      const fsDb = getAdminFirestore();
      if (fsDb) {
        const snap = await fsDb.collection("coaches").get();
        if (!snap.empty) {
          const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CoachProfile));
          list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          return list;
        }
      }
    } catch {
      // fallback
    }
  }

  const rtdbData = await readFromRtdb<Record<string, CoachProfile> | CoachProfile[]>("coaches");
  if (rtdbData) {
    const list = Array.isArray(rtdbData) ? rtdbData.filter(Boolean) : Object.values(rtdbData);
    if (list.length > 0) {
      list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      return list;
    }
  }

  const local = readLocalStore();
  if (local.coaches && local.coaches.length > 0) {
    local.coaches.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return local.coaches;
  }

  return COACHES_DATA;
}

async function fetchTournamentsRaw(): Promise<TournamentEvent[]> {
  if (hasAdminCredentials()) {
    try {
      const fsDb = getAdminFirestore();
      if (fsDb) {
        const snap = await fsDb.collection("tournaments").get();
        if (!snap.empty) {
          const list = snap.docs.map((d) => sanitizeTournamentEvent({ id: d.id, ...d.data() }));
          list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          return list;
        }
      }
    } catch {
      // fallback
    }
  }

  const rtdbData = await readFromRtdb<Record<string, TournamentEvent> | TournamentEvent[]>("tournaments");
  if (rtdbData) {
    const list = Array.isArray(rtdbData) ? rtdbData.filter(Boolean) : Object.values(rtdbData);
    if (list.length > 0) {
      const sanitized = list.map(sanitizeTournamentEvent);
      sanitized.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      return sanitized;
    }
  }

  const local = readLocalStore();
  if (local.tournaments && local.tournaments.length > 0) {
    const sanitized = local.tournaments.map(sanitizeTournamentEvent);
    sanitized.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return sanitized;
  }

  return TOURNAMENTS_DATA.map(sanitizeTournamentEvent);
}

async function fetchGalleryRaw(): Promise<GalleryImage[]> {
  if (hasAdminCredentials()) {
    try {
      const fsDb = getAdminFirestore();
      if (fsDb) {
        const snap = await fsDb.collection("gallery").get();
        if (!snap.empty) {
          const list = snap.docs.map((d, idx) => sanitizeGalleryImage({ id: d.id, ...d.data() }, idx));
          list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          return list;
        }
      }
    } catch {
      // fallback
    }
  }

  const rtdbData = await readFromRtdb<Record<string, GalleryImage> | GalleryImage[]>("gallery");
  if (rtdbData) {
    const list = Array.isArray(rtdbData) ? rtdbData.filter(Boolean) : Object.values(rtdbData);
    if (list.length > 0) {
      const sanitized = list.map((item, idx) => sanitizeGalleryImage(item, idx));
      sanitized.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      return sanitized;
    }
  }

  const local = readLocalStore();
  if (local.gallery && local.gallery.length > 0) {
    const sanitized = local.gallery.map((item, idx) => sanitizeGalleryImage(item, idx));
    sanitized.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return sanitized;
  }

  return GALLERY_DATA;
}

async function fetchTestimonialsRaw(): Promise<TestimonialItem[]> {
  if (hasAdminCredentials()) {
    try {
      const fsDb = getAdminFirestore();
      if (fsDb) {
        const snap = await fsDb.collection("testimonials").get();
        if (!snap.empty) {
          const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as TestimonialItem));
          list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          return list;
        }
      }
    } catch {
      // fallback
    }
  }

  const rtdbData = await readFromRtdb<Record<string, TestimonialItem> | TestimonialItem[]>("testimonials");
  if (rtdbData) {
    const list = Array.isArray(rtdbData) ? rtdbData.filter(Boolean) : Object.values(rtdbData);
    if (list.length > 0) {
      list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      return list;
    }
  }

  const local = readLocalStore();
  if (local.testimonials && local.testimonials.length > 0) {
    local.testimonials.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return local.testimonials;
  }

  return TESTIMONIALS_DATA;
}

/**
 * Public cached reads for Server Components with tagged cache "site-content"
 */

export const getHeroTags = unstable_cache(
  async () => {
    return await fetchHeroTagsRaw();
  },
  ["site-content-hero-tags"],
  { tags: ["site-content"], revalidate: 60 }
);

export const getClassesSection = unstable_cache(
  async () => {
    return await fetchClassesSectionRaw();
  },
  ["site-content-classes-section"],
  { tags: ["site-content"], revalidate: 60 }
);

export const getClasses = unstable_cache(
  async (visibleOnly = true) => {
    const list = await fetchClassesRaw();
    return visibleOnly ? list.filter((c) => c.visible !== false) : list;
  },
  ["site-content-classes"],
  { tags: ["site-content"], revalidate: 60 }
);

export const getCoaches = unstable_cache(
  async (visibleOnly = true) => {
    const list = await fetchCoachesRaw();
    return visibleOnly ? list.filter((c) => c.visible !== false) : list;
  },
  ["site-content-coaches"],
  { tags: ["site-content"], revalidate: 60 }
);

export const getTournaments = unstable_cache(
  async (visibleOnly = true) => {
    const list = await fetchTournamentsRaw();
    return visibleOnly ? list.filter((t) => t.visible !== false) : list;
  },
  ["site-content-tournaments"],
  { tags: ["site-content"], revalidate: 60 }
);

export const getGallery = unstable_cache(
  async (visibleOnly = true) => {
    const list = await fetchGalleryRaw();
    return visibleOnly ? list.filter((g) => g.visible !== false) : list;
  },
  ["site-content-gallery"],
  { tags: ["site-content"], revalidate: 60 }
);

export const getTestimonials = unstable_cache(
  async (visibleOnly = true) => {
    const list = await fetchTestimonialsRaw();
    return visibleOnly ? list.filter((t) => t.visible !== false) : list;
  },
  ["site-content-testimonials"],
  { tags: ["site-content"], revalidate: 60 }
);

export async function getAllPublicContent() {
  const [heroTags, classesSection, classes, coaches, tournaments, gallery, testimonials] =
    await Promise.all([
      getHeroTags(),
      getClassesSection(),
      getClasses(true),
      getCoaches(true),
      getTournaments(true),
      getGallery(true),
      getTestimonials(true),
    ]);

  return {
    heroTags,
    classesSection,
    classes,
    coaches,
    tournaments,
    gallery,
    testimonials,
  };
}

/**
 * Persist updates to Firebase Realtime Database + Firestore (if available) + Local Store
 */

export async function saveHeroTags(tags: HeroTag[]) {
  const store = readLocalStore();
  store.heroTags = tags;
  store.updatedAt = new Date().toISOString();
  writeLocalStore(store);

  // Sync to Firebase RTDB
  await writeToRtdb("site_content/hero/tags", tags);

  // Sync to Firestore if credentials exist
  if (hasAdminCredentials()) {
    try {
      const fsDb = getAdminFirestore();
      if (fsDb) {
        await fsDb.collection("site_content").doc("hero").set(
          { tags, updatedAt: store.updatedAt },
          { merge: true }
        );
      }
    } catch (e) {
      console.warn("Firestore sync error:", e);
    }
  }
}

export async function saveClassesSection(section: ClassesSectionContent) {
  const store = readLocalStore();
  store.classesSection = section;
  store.updatedAt = new Date().toISOString();
  writeLocalStore(store);

  await writeToRtdb("site_content/classesSection", section);

  if (hasAdminCredentials()) {
    try {
      const fsDb = getAdminFirestore();
      if (fsDb) {
        await fsDb.collection("site_content").doc("classesSection").set(
          { ...section, updatedAt: store.updatedAt },
          { merge: true }
        );
      }
    } catch (e) {
      console.warn("Firestore sync error:", e);
    }
  }
}

export async function saveClassTrack(track: ClassTrack) {
  const cleanTrack = sanitizeClassTrack(track);
  const store = readLocalStore();
  const existingIdx = store.classes.findIndex((c) => c.id === cleanTrack.id);
  if (existingIdx >= 0) {
    store.classes[existingIdx] = cleanTrack;
  } else {
    store.classes.push(cleanTrack);
  }
  store.classes.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  store.updatedAt = new Date().toISOString();
  writeLocalStore(store);

  await writeToRtdb(`classes/${cleanTrack.id}`, cleanTrack);

  if (hasAdminCredentials()) {
    try {
      const fsDb = getAdminFirestore();
      if (fsDb) {
        // Strip duration, sessionLength, schedule on next save by overwriting document
        await fsDb.collection("classes").doc(cleanTrack.id).set(
          { ...cleanTrack, updatedAt: store.updatedAt },
          { merge: false }
        );
      }
    } catch (e) {
      console.warn("Firestore sync error:", e);
    }
  }
}

export async function deleteClassTrack(id: string) {
  const store = readLocalStore();
  store.classes = store.classes.filter((c) => c.id !== id);
  writeLocalStore(store);

  if (rtdbUrl) {
    try {
      const cleanBase = rtdbUrl.replace(/\/+$/, "");
      await fetch(`${cleanBase}/classes/${id}.json`, { method: "DELETE" });
    } catch (e) {
      console.warn("RTDB delete error:", e);
    }
  }

  if (hasAdminCredentials()) {
    try {
      const fsDb = getAdminFirestore();
      if (fsDb) {
        await fsDb.collection("classes").doc(id).delete();
      }
    } catch (e) {
      console.warn("Firestore delete error:", e);
    }
  }
}

export async function saveCoachProfile(coach: CoachProfile) {
  const store = readLocalStore();
  const existingIdx = store.coaches.findIndex((c) => c.id === coach.id);
  if (existingIdx >= 0) {
    store.coaches[existingIdx] = { ...store.coaches[existingIdx], ...coach };
  } else {
    store.coaches.push(coach);
  }
  store.coaches.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  store.updatedAt = new Date().toISOString();
  writeLocalStore(store);

  await writeToRtdb(`coaches/${coach.id}`, coach);

  if (hasAdminCredentials()) {
    try {
      const fsDb = getAdminFirestore();
      if (fsDb) {
        await fsDb.collection("coaches").doc(coach.id).set(
          { ...coach, updatedAt: store.updatedAt },
          { merge: true }
        );
      }
    } catch (e) {
      console.warn("Firestore sync error:", e);
    }
  }
}

export async function deleteCoachProfile(id: string) {
  const store = readLocalStore();
  store.coaches = store.coaches.filter((c) => c.id !== id);
  writeLocalStore(store);

  if (rtdbUrl) {
    try {
      const cleanBase = rtdbUrl.replace(/\/+$/, "");
      await fetch(`${cleanBase}/coaches/${id}.json`, { method: "DELETE" });
    } catch (e) {
      console.warn("RTDB delete error:", e);
    }
  }

  if (hasAdminCredentials()) {
    try {
      const fsDb = getAdminFirestore();
      if (fsDb) {
        await fsDb.collection("coaches").doc(id).delete();
      }
    } catch (e) {
      console.warn("Firestore delete error:", e);
    }
  }
}

export async function saveTournamentEvent(tournament: TournamentEvent) {
  const cleanTourn = sanitizeTournamentEvent(tournament);
  const store = readLocalStore();
  const existingIdx = store.tournaments.findIndex((t) => t.id === cleanTourn.id);
  if (existingIdx >= 0) {
    store.tournaments[existingIdx] = cleanTourn;
  } else {
    store.tournaments.push(cleanTourn);
  }
  store.tournaments.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  store.updatedAt = new Date().toISOString();
  writeLocalStore(store);

  await writeToRtdb(`tournaments/${cleanTourn.id}`, cleanTourn);

  if (hasAdminCredentials()) {
    try {
      const fsDb = getAdminFirestore();
      if (fsDb) {
        await fsDb.collection("tournaments").doc(cleanTourn.id).set(
          { ...cleanTourn, updatedAt: store.updatedAt },
          { merge: false }
        );
      }
    } catch (e) {
      console.warn("Firestore sync error:", e);
    }
  }
}

export async function deleteTournamentEvent(id: string) {
  const store = readLocalStore();
  store.tournaments = store.tournaments.filter((t) => t.id !== id);
  writeLocalStore(store);

  if (rtdbUrl) {
    try {
      const cleanBase = rtdbUrl.replace(/\/+$/, "");
      await fetch(`${cleanBase}/tournaments/${id}.json`, { method: "DELETE" });
    } catch (e) {
      console.warn("RTDB delete error:", e);
    }
  }

  if (hasAdminCredentials()) {
    try {
      const fsDb = getAdminFirestore();
      if (fsDb) {
        await fsDb.collection("tournaments").doc(id).delete();
      }
    } catch (e) {
      console.warn("Firestore delete error:", e);
    }
  }
}

export async function saveGalleryItem(item: GalleryImage) {
  const cleanItem = sanitizeGalleryImage(item);
  const store = readLocalStore();
  const existingIdx = store.gallery.findIndex((g) => g.id === cleanItem.id);
  if (existingIdx >= 0) {
    store.gallery[existingIdx] = cleanItem;
  } else {
    store.gallery.push(cleanItem);
  }
  store.gallery.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  store.updatedAt = new Date().toISOString();
  writeLocalStore(store);

  await writeToRtdb(`gallery/${cleanItem.id}`, cleanItem);

  if (hasAdminCredentials()) {
    try {
      const fsDb = getAdminFirestore();
      if (fsDb) {
        // Firestore gallery/{id} holds only: imageUrl, imagePublicId, width, height, imageAlt, order, visible
        await fsDb.collection("gallery").doc(cleanItem.id).set(
          { ...cleanItem, updatedAt: store.updatedAt },
          { merge: false }
        );
      }
    } catch (e) {
      console.warn("Firestore sync error:", e);
    }
  }
}

export async function deleteGalleryItem(id: string) {
  const store = readLocalStore();
  store.gallery = store.gallery.filter((g) => g.id !== id);
  writeLocalStore(store);

  if (rtdbUrl) {
    try {
      const cleanBase = rtdbUrl.replace(/\/+$/, "");
      await fetch(`${cleanBase}/gallery/${id}.json`, { method: "DELETE" });
    } catch (e) {
      console.warn("RTDB delete error:", e);
    }
  }

  if (hasAdminCredentials()) {
    try {
      const fsDb = getAdminFirestore();
      if (fsDb) {
        await fsDb.collection("gallery").doc(id).delete();
      }
    } catch (e) {
      console.warn("Firestore delete error:", e);
    }
  }
}

export async function saveTestimonialItem(testimonial: TestimonialItem) {
  const store = readLocalStore();
  const existingIdx = store.testimonials.findIndex((t) => t.id === testimonial.id);
  if (existingIdx >= 0) {
    store.testimonials[existingIdx] = { ...store.testimonials[existingIdx], ...testimonial };
  } else {
    store.testimonials.push(testimonial);
  }
  store.testimonials.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  store.updatedAt = new Date().toISOString();
  writeLocalStore(store);

  await writeToRtdb(`testimonials/${testimonial.id}`, testimonial);

  if (hasAdminCredentials()) {
    try {
      const fsDb = getAdminFirestore();
      if (fsDb) {
        await fsDb.collection("testimonials").doc(testimonial.id).set(
          { ...testimonial, updatedAt: store.updatedAt },
          { merge: true }
        );
      }
    } catch (e) {
      console.warn("Firestore sync error:", e);
    }
  }
}

export async function deleteTestimonialItem(id: string) {
  const store = readLocalStore();
  store.testimonials = store.testimonials.filter((t) => t.id !== id);
  writeLocalStore(store);

  if (rtdbUrl) {
    try {
      const cleanBase = rtdbUrl.replace(/\/+$/, "");
      await fetch(`${cleanBase}/testimonials/${id}.json`, { method: "DELETE" });
    } catch (e) {
      console.warn("RTDB delete error:", e);
    }
  }

  if (hasAdminCredentials()) {
    try {
      const fsDb = getAdminFirestore();
      if (fsDb) {
        await fsDb.collection("testimonials").doc(id).delete();
      }
    } catch (e) {
      console.warn("Firestore delete error:", e);
    }
  }
}

export async function reorderItems(
  collection: "classes" | "coaches" | "tournaments" | "gallery" | "testimonials",
  items: { id: string; order: number }[]
) {
  const store = readLocalStore();
  const list = store[collection] as { id: string; order?: number }[];
  items.forEach(({ id, order }) => {
    const found = list.find((item) => item.id === id);
    if (found) found.order = order;
  });
  list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  store.updatedAt = new Date().toISOString();
  writeLocalStore(store);

  // Sync to RTDB
  const map: Record<string, unknown> = {};
  list.forEach((item) => {
    map[item.id] = item;
  });
  await writeToRtdb(collection, map);

  if (hasAdminCredentials()) {
    try {
      const fsDb = getAdminFirestore();
      if (fsDb) {
        const batch = fsDb.batch();
        items.forEach(({ id, order }) => {
          const ref = fsDb.collection(collection).doc(id);
          batch.update(ref, { order, updatedAt: store.updatedAt });
        });
        await batch.commit();
      }
    } catch (e) {
      console.warn("Firestore reorder error:", e);
    }
  }
}

/**
 * Seed defaults into Firebase & Local Store
 */
export async function seedDefaultsToFirestore() {
  const store = getInitialStore();
  writeLocalStore(store);

  // Sync to RTDB
  await writeToRtdb("site_content/hero/tags", SEED_HERO_TAGS);
  await writeToRtdb("site_content/classesSection", SEED_CLASSES_SECTION);

  const classesMap: Record<string, ClassTrack> = {};
  CLASSES_DATA.forEach((c) => (classesMap[c.id] = c));
  await writeToRtdb("classes", classesMap);

  const coachesMap: Record<string, CoachProfile> = {};
  COACHES_DATA.forEach((c) => (coachesMap[c.id] = c));
  await writeToRtdb("coaches", coachesMap);

  const tournamentsMap: Record<string, TournamentEvent> = {};
  TOURNAMENTS_DATA.forEach((t) => (tournamentsMap[t.id] = t));
  await writeToRtdb("tournaments", tournamentsMap);

  const galleryMap: Record<string, GalleryImage> = {};
  GALLERY_DATA.forEach((g) => (galleryMap[g.id] = g));
  await writeToRtdb("gallery", galleryMap);

  const testimonialsMap: Record<string, TestimonialItem> = {};
  TESTIMONIALS_DATA.forEach((t) => (testimonialsMap[t.id] = t));
  await writeToRtdb("testimonials", testimonialsMap);

  // Sync to Firestore if credentials configured
  if (hasAdminCredentials()) {
    try {
      const fsDb = getAdminFirestore();
      if (fsDb) {
        const batch = fsDb.batch();
        const now = new Date().toISOString();

        batch.set(fsDb.collection("site_content").doc("hero"), { tags: SEED_HERO_TAGS, updatedAt: now }, { merge: true });
        batch.set(fsDb.collection("site_content").doc("classesSection"), { ...SEED_CLASSES_SECTION, updatedAt: now }, { merge: true });

        CLASSES_DATA.forEach((c) => batch.set(fsDb.collection("classes").doc(c.id), { ...sanitizeClassTrack(c), updatedAt: now }, { merge: false }));
        COACHES_DATA.forEach((c) => batch.set(fsDb.collection("coaches").doc(c.id), { ...c, updatedAt: now }, { merge: true }));
        TOURNAMENTS_DATA.forEach((t) => batch.set(fsDb.collection("tournaments").doc(t.id), { ...sanitizeTournamentEvent(t), updatedAt: now }, { merge: false }));
        GALLERY_DATA.forEach((g) => batch.set(fsDb.collection("gallery").doc(g.id), { ...g, updatedAt: now }, { merge: false }));
        TESTIMONIALS_DATA.forEach((t) => batch.set(fsDb.collection("testimonials").doc(t.id), { ...t, updatedAt: now }, { merge: true }));

        await batch.commit();
      }
    } catch (e) {
      console.warn("Firestore seed error:", e);
    }
  }
}
