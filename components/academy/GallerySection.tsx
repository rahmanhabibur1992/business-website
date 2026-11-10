"use client";

import React, { useState } from "react";
import Image from "next/image";
import { HoverCard } from "./HoverCard";
import { JOURNAL_POSTS, JournalPost } from "@/lib/academy-content";

interface GallerySectionProps {
  posts?: JournalPost[];
}

export function GallerySection({ posts = JOURNAL_POSTS }: GallerySectionProps) {
  const [filter, setFilter] = useState<string>("all");
  const visiblePosts = posts.filter((p) => p.visible !== false);

  const filteredPosts =
    filter === "all"
      ? visiblePosts
      : visiblePosts.filter((post) => post.category === filter);

  return (
    <section
      id="gallery"
      className="w-full py-20 px-4 lg:px-12 border-b border-outline-subtle bg-surface scroll-mt-20"
    >
      <div id="journal" className="max-w-7xl mx-auto flex flex-col gap-12 scroll-mt-20">
        {/* Section Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Academy Gallery &amp; Journal</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-on-surface">
              Dispatches from the 64 Squares
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Grandmaster game annotations, student tournament breakthroughs, masterclass syllabus highlights, and academy events.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
            {["all", "classes", "tournaments", "events"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded transition-all capitalize cursor-pointer ${
                  filter === cat
                    ? "bg-primary text-on-primary font-bold shadow-[0_0_12px_rgba(242,202,80,0.25)]"
                    : "bg-surface-high border border-outline-subtle text-on-surface-variant hover:text-on-surface hover:border-primary/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Journal / Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => {
            const imgSrc = post.imageUrl || post.image || "/coaches/coach-levon.webp";
            const dateText = post.dateAndType || `${post.dateLabel || ""} • ${post.kicker || post.category}`;
            const cornerPiece = post.cornerPiece || (post.category === "classes" ? "knight" : "bishop");
            const linkHref = post.linkUrl || post.link || "#";

            return (
              <HoverCard
                key={post.id}
                cornerPiece={cornerPiece}
                className="bg-surface-low rounded-xl border border-outline-subtle overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Article Thumbnail */}
                  <div className="relative w-full aspect-[16/10] bg-surface-container overflow-hidden">
                    <Image
                      src={imgSrc}
                      alt={post.imageAlt || post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-low via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-surface-lowest/85 backdrop-blur-sm border border-outline-subtle text-secondary font-mono text-[10px] uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>

                  {/* Article Content */}
                  <div className="p-6 space-y-3 relative z-10">
                    <div className="text-[11px] font-mono text-on-surface-variant">
                      {dateText}
                    </div>
                    <h3 className="font-display text-lg font-bold text-on-surface leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 relative z-10">
                  <a
                    href={linkHref}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-primary font-bold hover:underline"
                  >
                    <span>Read Dispatch</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </a>
                </div>
              </HoverCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
