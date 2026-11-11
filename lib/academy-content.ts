import { SITE_CONTACT, SiteContactConfig } from "./site-config";

export type AcademyContactConfig = SiteContactConfig;

export interface ClassTrack {
  id: string;
  slug: string;
  badge?: string;
  level: string;
  levelTone?: "primary" | "secondary";
  mode: string;
  ratingRange?: string;
  ratingLabel?: string;
  title: string;
  description: string;
  batchSize: string;
  modules: string[];
  perks?: string;
  formKey?: string;
  order?: number;
  visible?: boolean;
}

export interface CoachProfile {
  id: string;
  name: string;
  role?: string;
  roleLine?: string;
  peakRating: string;
  badge?: string;
  bio: string;
  specializations?: string[];
  specialties?: string[];
  image?: string;
  imageUrl?: string;
  imagePublicId?: string;
  imageAlt?: string;
  formKey?: string;
  order?: number;
  visible?: boolean;
}

export interface TournamentEvent {
  id: string;
  statusBadge?: {
    label: string;
    isLive?: boolean;
    style?: "live" | "upcoming" | "monthly";
  };
  statusLabel?: string;
  statusTone?: "live" | "upcoming" | "monthly";
  platform: string;
  title: string;
  description: string;
  format: string;
  timeControl: string;
  dayTime: string;
  ctaLabel?: string;
  ctaUrl?: string;
  order?: number;
  visible?: boolean;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  imagePublicId?: string;
  width?: number;
  height?: number;
  imageAlt?: string;
  order: number;
  visible: boolean;
}

export type JournalPost = GalleryImage;

export interface TestimonialItem {
  id: string;
  rating?: number;
  stars?: number;
  quote: string;
  author?: string;
  name?: string;
  role?: string;
  relation?: string;
  cohort?: string;
  classLabel?: string;
  consentBadge?: string;
  consentConfirmed?: boolean;
  order?: number;
  visible?: boolean;
}

export interface ProcessStage {
  step: string;
  code: string;
  title: string;
  description: string;
  piece: "pawn" | "knight" | "rook" | "queen";
}

export interface HeroTag {
  id: string;
  icon: string;
  label: string;
  tone: "primary" | "secondary";
}

export interface HeroContent {
  tags: HeroTag[];
}

export interface ClassesSectionContent {
  pillLabel: string;
  heading: string;
  description: string;
}

export const SEED_HERO_TAGS: HeroTag[] = [
  { id: "tag-1", icon: "bolt", label: "1-on-1 Master Mentorship", tone: "primary" },
  { id: "tag-2", icon: "psychology", label: "Syzygy & Stockfish 16 Prep", tone: "secondary" },
  { id: "tag-3", icon: "trophy", label: "Rated Arena Competitions", tone: "primary" },
];

export const SEED_CLASSES_SECTION: ClassesSectionContent = {
  pillLabel: "Curriculum Tracks",
  heading: "Structured Progression Syllabi",
  description:
    "Designed by our Master to systematically eliminate calculation weaknesses, reconstruct positional instincts, and build high-precision tournament opening repertoires.",
};

export const ACADEMY_CONFIG = {
  brandName: "Rahman Chess Academy",
  shortName: "Rahman Chess",
  suffix: "ACADEMY",
  subtitle: "Master Mentorship Academy",
  pageTitle: "RAHMAN CHESS ACADEMY | Master Mentorship & FIDE Apprenticeship",
  metaDescription:
    "Structured syllabi from basic pawn fundamentals to master-level prophylactic calculations. Personalized 1-on-1 coaching, weekend Blitz arena tournaments, and engine-augmented review.",
  copyrightYear: 2026,
  contact: SITE_CONTACT,
};

export const CLASSES_DATA: ClassTrack[] = [
  {
    id: "basic",
    slug: "basic",
    level: "Basic",
    levelTone: "secondary",
    mode: "Online",
    ratingRange: "Beginner to Club 1400",
    ratingLabel: "Beginner to Club 1400",
    title: "Chess Foundations & Tactics Primer",
    description:
      "Comprehensive training for novices and junior club players. Establishes tactical hygiene, piece coordination, checkmating patterns, and basic opening principles.",
    batchSize: "Max 6 Students",
    modules: [
      "Forks & Pins Mastery",
      "King Safety & Castling",
      "Basic Rook Endgames",
      "Opening Traps Defense",
    ],
    perks: "Includes weekly puzzle sheets & Lichess sparring",
    formKey: "program-basic",
    order: 1,
    visible: true,
  },
  {
    id: "advanced",
    slug: "advanced",
    badge: "Competition Prep Track",
    level: "Advanced",
    levelTone: "primary",
    mode: "Online",
    ratingRange: "ELO 1600 - 2200+",
    ratingLabel: "ELO 1600 - 2200+",
    title: "Master Repertoire & Endgame Praxis",
    description:
      "High-intensity positional refinement. Modern opening preparation with ChessBase & Stockfish 16, Syzygy tablebases, psychological time-trouble training, and blindfold drills.",
    batchSize: "Max 4 Students",
    modules: [
      "Catalan & Sicilian Repertoire",
      "Exchange Sacrifices (Petrosian)",
      "Dvoretsky Rook Endings",
      "Anti-Computer Prep",
    ],
    perks: "1-on-1 Monthly Master Game Review & PGN Library",
    formKey: "program-advanced",
    order: 2,
    visible: true,
  },
];

export const COACHES_DATA: CoachProfile[] = [
  {
    id: "sarkisov",
    name: "Levon Sarkisov",
    role: "Senior Trainer • 18 Years Exp",
    roleLine: "Senior Trainer • 18 Years Exp",
    peakRating: "PEAK 2785",
    badge: "Master Coach",
    bio: "Trained two World Championship Candidates. Master pedagogue specializing in sharp tactical imbalances and dynamic compensation in closed pawn chains.",
    specializations: ["Sicilian Defense", "Kingside Attacks"],
    specialties: ["Sicilian Defense", "Kingside Attacks"],
    image: "/images/academy/coach-levon.svg",
    imageUrl: "/images/academy/coach-levon.svg",
    imagePublicId: "coach-levon",
    imageAlt: "Levon Sarkisov - Chess Coach",
    formKey: "coach-sarkisov",
    order: 1,
    visible: true,
  },
];

export const TOURNAMENTS_DATA: TournamentEvent[] = [
  {
    id: "friday-rapid",
    statusBadge: {
      label: "Live Tomorrow",
      isLive: true,
      style: "live",
    },
    statusLabel: "Live Tomorrow",
    statusTone: "live",
    platform: "classroom.com",
    title: "Rahman Friday Rapid Arena",
    description:
      "Open to academy students & invited national rated candidates.",
    format: "Rapid (Swiss 5 Rounds)",
    timeControl: "10 min + 5 sec inc",
    dayTime: "Every Friday, 20:00 IST",
    ctaLabel: "Join on Lichess",
    ctaUrl: "https://lichess.org/tournament",
    order: 1,
    visible: true,
  },
];

export const GALLERY_DATA: GalleryImage[] = [
  {
    id: "gallery-1",
    imageUrl: "/images/academy/journal-tournaments.svg",
    imagePublicId: "gallery-tournaments",
    imageAlt: "Rahman Chess Academy online chess class – photo 1",
    width: 800,
    height: 600,
    order: 1,
    visible: true,
  },
  {
    id: "gallery-2",
    imageUrl: "/images/academy/journal-classes.svg",
    imagePublicId: "gallery-classes",
    imageAlt: "Rahman Chess Academy online chess class – photo 2",
    width: 800,
    height: 600,
    order: 2,
    visible: true,
  },
  {
    id: "gallery-3",
    imageUrl: "/images/academy/journal-events.svg",
    imagePublicId: "gallery-events",
    imageAlt: "Rahman Chess Academy online chess class – photo 3",
    width: 800,
    height: 600,
    order: 3,
    visible: true,
  },
];

export const JOURNAL_POSTS = GALLERY_DATA;

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: "testimonial-1",
    stars: 5,
    rating: 5,
    quote:
      "“My son Aarav increased his rating by 240 points in just 7 months. The personalized feedback on his openings and the weekly Blitz arenas gave him tremendous psychological composure.”",
    author: "Sunita Sharma",
    name: "Sunita Sharma",
    role: "Parent of Aarav (U-12 State Champ)",
    relation: "Parent of Aarav (U-12 State Champ)",
    cohort: "Class: Advanced",
    classLabel: "Class: Advanced",
    consentBadge: "Consent Confirmed",
    consentConfirmed: true,
    order: 1,
    visible: true,
  },
  {
    id: "testimonial-2",
    stars: 5,
    rating: 5,
    quote:
      "“Coach Elena completely restructured how I perceive endgames. Before Rahman, I lost drawn rook and pawn endings. Now I turn equal positions into full points with surgical prophylaxis.”",
    author: "Rohan Iyer",
    name: "Rohan Iyer",
    role: "Tournament Player (Rating 2085)",
    relation: "Tournament Player (Rating 2085)",
    cohort: "Student Member",
    classLabel: "Student Member",
    consentBadge: "Consent Confirmed",
    consentConfirmed: true,
    order: 2,
    visible: true,
  },
  {
    id: "testimonial-3",
    stars: 5,
    rating: 5,
    quote:
      "“The coaches do not just teach moves; they nurture discipline, resilience, and calm decision making under time pressure. The small batch size of 4 to 6 ensures nobody gets left behind.”",
    author: "Dr. Rajesh Patel",
    name: "Dr. Rajesh Patel",
    role: "Parent of Diya (Age 10)",
    relation: "Parent of Diya (Age 10)",
    cohort: "Class: Basic",
    classLabel: "Class: Basic",
    consentBadge: "Consent Confirmed",
    consentConfirmed: true,
    order: 3,
    visible: true,
  },
];

export const PROCESS_STAGES: ProcessStage[] = [
  {
    step: "01",
    code: "OPENING",
    title: "Book Assessment",
    description:
      "Baseline diagnostic rating evaluation & opening repertoire audit by our Master.",
    piece: "pawn",
  },
  {
    step: "02",
    code: "MIDDLEGAME",
    title: "1-on-1 Mentorship",
    description:
      "Personalized calculation trees, prophylaxis drills & dynamic imbalance mastery under pressure.",
    piece: "knight",
  },
  {
    step: "03",
    code: "TACTICS",
    title: "Tournament Play",
    description:
      "Weekly rated Blitz arena praxis with real-time Master tactical breakdown.",
    piece: "rook",
  },
  {
    step: "04",
    code: "ENDGAME",
    title: "Mastery & Norms",
    description:
      "Theoretical tablebase conversion, anti-computer novelties & competitive coaching.",
    piece: "queen",
  },
];
