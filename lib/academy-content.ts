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
  duration: string;
  sessionLength: string;
  batchSize: string;
  schedule: string;
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
    style: "live" | "upcoming" | "monthly";
  };
  statusLabel?: string;
  statusTone?: "live" | "upcoming" | "monthly";
  platform: string;
  title: string;
  description: string;
  format: string;
  timeControl: string;
  dayTime: string;
  action?: {
    label: string;
    href?: string;
    external?: boolean;
    isModalTrigger?: boolean;
    modalType?: string;
  };
  ctaType?: "link" | "register";
  ctaLabel?: string;
  ctaUrl?: string;
  order?: number;
  visible?: boolean;
}

export interface JournalPost {
  id: string;
  category: "tournaments" | "classes" | "events";
  categoryLabel?: string;
  dateAndType?: string;
  dateLabel?: string;
  kicker?: string;
  title: string;
  excerpt: string;
  image?: string;
  imageUrl?: string;
  imagePublicId?: string;
  imageAlt?: string;
  link?: string;
  linkUrl?: string;
  cornerPiece?: "bishop" | "knight";
  order?: number;
  visible?: boolean;
}

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
  { id: "tag-1", icon: "bolt", label: "1-on-1 GM Mentorship", tone: "primary" },
  { id: "tag-2", icon: "psychology", label: "Syzygy & Stockfish 16 Prep", tone: "secondary" },
  { id: "tag-3", icon: "trophy", label: "Rated FIDE & Lichess Arenas", tone: "primary" },
];

export const SEED_CLASSES_SECTION: ClassesSectionContent = {
  pillLabel: "Curriculum Tracks",
  heading: "Structured Progression Syllabi",
  description:
    "Designed by Grandmasters to systematically eliminate calculation weaknesses, reconstruct positional instincts, and build high-precision tournament opening repertoires.",
};

export const ACADEMY_CONFIG = {
  brandName: "Rahman Chess Academy",
  shortName: "Rahman Chess",
  suffix: "ACADEMY",
  subtitle: "Grandmaster Mentorship Academy",
  pageTitle: "RAHMAN CHESS ACADEMY | Grandmaster Mentorship & FIDE Apprenticeship",
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
    duration: "12 Weeks",
    sessionLength: "60 Mins",
    batchSize: "Max 6 Students",
    schedule: "Tue & Thu 17:30 IST",
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
    badge: "FIDE Prep Track",
    level: "Advanced",
    levelTone: "primary",
    mode: "Online",
    ratingRange: "ELO 1600 - 2200+",
    ratingLabel: "ELO 1600 - 2200+",
    title: "Grandmaster Repertoire & Endgame Praxis",
    description:
      "High-intensity positional refinement. Modern opening preparation with ChessBase & Stockfish 16, Syzygy tablebases, psychological time-trouble training, and blindfold drills.",
    duration: "24 Weeks",
    sessionLength: "90 Mins",
    batchSize: "Max 4 Students",
    schedule: "Wed & Sat 19:00 IST",
    modules: [
      "Catalan & Sicilian Repertoire",
      "Exchange Sacrifices (Petrosian)",
      "Dvoretsky Rook Endings",
      "Anti-Computer Prep",
    ],
    perks: "1-on-1 Monthly GM Game Review & PGN Library",
    formKey: "program-advanced",
    order: 2,
    visible: true,
  },
];

export const COACHES_DATA: CoachProfile[] = [
  {
    id: "sarkisov",
    name: "GM Levon Sarkisov",
    role: "FIDE Senior Trainer • 18 Years Exp",
    roleLine: "FIDE Senior Trainer • 18 Years Exp",
    peakRating: "PEAK 2785 FIDE",
    badge: "Super GM",
    bio: "Trained two World Championship Candidates. Master pedagogue specializing in sharp tactical imbalances and dynamic compensation in closed pawn chains.",
    specializations: ["Sicilian Defense", "Kingside Attacks"],
    specialties: ["Sicilian Defense", "Kingside Attacks"],
    image: "/images/academy/coach-levon.svg",
    imageUrl: "/images/academy/coach-levon.svg",
    imagePublicId: "coach-levon",
    imageAlt: "GM Levon Sarkisov - Grandmaster Chess Coach",
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
    platform: "Lichess.org",
    title: "Rahman Friday Rapid Arena",
    description:
      "Open to academy students & invited national rated candidates.",
    format: "Rapid (Swiss 5 Rounds)",
    timeControl: "10 min + 5 sec inc",
    dayTime: "Every Friday, 20:00 IST",
    action: {
      label: "Join on Lichess",
      href: "https://lichess.org/tournament",
      external: true,
    },
    ctaType: "link",
    ctaLabel: "Join on Lichess",
    ctaUrl: "https://lichess.org/tournament",
    order: 1,
    visible: true,
  },
];

export const JOURNAL_POSTS: JournalPost[] = [
  {
    id: "post-1",
    category: "tournaments",
    categoryLabel: "Tournaments",
    dateAndType: "14 Oct 2024 • Analysis Dispatch",
    dateLabel: "14 Oct 2024",
    kicker: "Analysis Dispatch",
    title: "Rahman Pupils Sweep Podium at State Youth Rapid",
    excerpt:
      "Detailed tournament report from our 8 junior prodigies who secured gold, silver, and fourth place in Ahmedabad.",
    image: "/images/academy/journal-tournaments.svg",
    imageUrl: "/images/academy/journal-tournaments.svg",
    imagePublicId: "journal-tournaments",
    imageAlt: "Junior chess champions tournament analysis",
    link: "#",
    linkUrl: "#",
    cornerPiece: "bishop",
    order: 1,
    visible: true,
  },
  {
    id: "post-2",
    category: "classes",
    categoryLabel: "Classes",
    dateAndType: "28 Sep 2024 • Repertoire Guide",
    dateLabel: "28 Sep 2024",
    kicker: "Repertoire Guide",
    title: "Dissecting the Tartakower Queen's Gambit Declined",
    excerpt:
      "Key prophylactic pawn moves and hanging pawns management taught in the Advanced Cohort masterclass.",
    image: "/images/academy/journal-classes.svg",
    imageUrl: "/images/academy/journal-classes.svg",
    imagePublicId: "journal-classes",
    imageAlt: "Queen's Gambit masterclass opening board",
    link: "#",
    linkUrl: "#",
    cornerPiece: "knight",
    order: 2,
    visible: true,
  },
  {
    id: "post-3",
    category: "events",
    categoryLabel: "Events",
    dateAndType: "10 Sep 2024 • Exhibition",
    dateLabel: "10 Sep 2024",
    kicker: "Exhibition",
    title: "Annual 25-Board Simultaneous Exhibition Highlights",
    excerpt:
      "Watch the full video recap as Super GM Levon played 25 titled aspirants blindfolded on 3 boards.",
    image: "/images/academy/journal-events.svg",
    imageUrl: "/images/academy/journal-events.svg",
    imagePublicId: "journal-events",
    imageAlt: "Grandmaster simultaneous exhibition match",
    link: "#",
    linkUrl: "#",
    cornerPiece: "bishop",
    order: 3,
    visible: true,
  },
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: "testimonial-1",
    stars: 5,
    rating: 5,
    quote:
      "“My son Aarav increased his FIDE rating by 240 points in just 7 months. The personalized feedback on his openings and the weekly Blitz arenas gave him tremendous psychological composure.”",
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
      "“GM Elena completely restructured how I perceive endgames. Before Rahman, I lost drawn rook and pawn endings. Now I turn equal positions into full points with surgical prophylaxis.”",
    author: "Rohan Iyer",
    name: "Rohan Iyer",
    role: "Candidate Master (FIDE 2085)",
    relation: "Candidate Master (FIDE 2085)",
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
      "Baseline diagnostic rating evaluation & opening repertoire audit by International Masters.",
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
      "Weekly rated FIDE & Lichess Blitz arena praxis with real-time Grandmaster tactical breakdown.",
    piece: "rook",
  },
  {
    step: "04",
    code: "ENDGAME",
    title: "Mastery & Norms",
    description:
      "Theoretical tablebase conversion, anti-computer novelties & titled FIDE norm coaching.",
    piece: "queen",
  },
];
