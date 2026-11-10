"use client";

import React, { useEffect, useRef } from "react";

export function HeroChessBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const pieceLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const grid = gridRef.current;
    const pieceLayer = pieceLayerRef.current;
    const hero = document.getElementById("hero") || container;
    if (!container || !grid || !pieceLayer || !hero) return;

    const glyphs: Record<"white" | "black", Record<string, string>> = {
      white: { king: "♔", queen: "♕", rook: "♖", bishop: "♗", knight: "♘", pawn: "♙" },
      black: { king: "♚", queen: "♛", rook: "♜", bishop: "♝", knight: "♞", pawn: "♟" },
    };
    const pieceSet = [
      "king",
      "queen",
      "rook",
      "rook",
      "bishop",
      "bishop",
      "knight",
      "knight",
      "pawn",
      "pawn",
      "pawn",
      "pawn",
    ];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let rows = 8;
    let cols = 16;
    interface Piece {
      id: number;
      side: "white" | "black";
      type: string;
      r: number;
      c: number;
      el: HTMLElement;
      static?: boolean;
    }
    let pieces: Piece[] = [];
    let activeSide: "white" | "black" = "white";
    let moveTimer = 0;
    let inView = true;
    let resizeFrame = 0;
    let pieceId = 0;

    const randomInt = (max: number) => Math.floor(Math.random() * max);
    const inside = (r: number, c: number) => r >= 0 && r < rows && c >= 0 && c < cols;
    const squareKey = (r: number, c: number) => `${r}:${c}`;
    const occupiedAt = (r: number, c: number) => pieces.find((piece) => piece.r === r && piece.c === c);
    const positionElement = (piece: Piece) => {
      piece.el.style.left = `${((piece.c + 0.5) / cols) * 100}%`;
      piece.el.style.top = `${((piece.r + 0.5) / rows) * 100}%`;
    };

    function buildTiles() {
      if (!grid || !pieceLayer || !hero) return;
      const bounds = hero.getBoundingClientRect();
      const width = Math.max(320, bounds.width);
      const height = Math.max(420, bounds.height);
      const cell = Math.max(44, Math.min(88, width / 8, height / 8));
      cols = Math.max(8, Math.ceil(width / cell));
      rows = Math.max(8, Math.ceil(height / cell));

      grid.style.setProperty("--hero-cols", String(cols));
      grid.style.setProperty("--hero-rows", String(rows));
      pieceLayer.style.setProperty("--hero-cols", String(cols));
      pieceLayer.style.setProperty("--hero-rows", String(rows));
      grid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
      grid.style.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`;
      grid.replaceChildren();

      const fragment = document.createDocumentFragment();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const square = document.createElement("div");
          square.className = "hero-chess-square" + ((r + c) % 2 === 0 ? " is-light" : "");
          fragment.appendChild(square);
        }
      }
      grid.appendChild(fragment);
    }

    function createPiece(side: "white" | "black", type: string, r: number, c: number): Piece {
      const el = document.createElement("span");
      el.className = `hero-chess-piece ${side === "white" ? "is-white" : "is-black"}`;
      el.textContent = glyphs[side][type];
      el.setAttribute("aria-hidden", "true");
      el.dataset.pieceId = String(++pieceId);
      pieceLayer?.appendChild(el);
      const piece: Piece = { id: pieceId, side, type, r, c, el };
      positionElement(piece);
      return piece;
    }

    function clearPieces() {
      pieces.forEach((piece) => piece.el.remove());
      pieces = [];
      pieceLayer?.querySelectorAll(".hero-capture-flash").forEach((node) => node.remove());
    }

    function seedPosition() {
      clearPieces();
      const placed = new Set<string>();

      // Helper to add a piece and optionally mark as static
      const addPiece = (side: "white" | "black", type: string, r: number, c: number, isStatic = false) => {
        const key = squareKey(r, c);
        if (placed.has(key)) return false;
        placed.add(key);
        const piece = createPiece(side, type, r, c);
        piece.static = isStatic;
        pieces.push(piece);
        return true;
      };

      // Left side: 3 static white pieces, no movement
      let leftAttempts = 0;
      while (placed.size < 3 && leftAttempts < 30) {
        const r = randomInt(rows);
        const c = randomInt(Math.floor(cols / 2));
        const type = pieceSet[randomInt(pieceSet.length)];
        if (!addPiece("white", type, r, c, true)) leftAttempts++;
      }

      // Right side: 5 moving pieces
      let rightAttempts = 0;
      while (placed.size < 8 && rightAttempts < 50) {
        const r = randomInt(rows);
        const c = Math.floor(cols / 2) + randomInt(cols - Math.floor(cols / 2));
        const type = pieceSet[randomInt(pieceSet.length)];
        const side: "white" | "black" = pieces.filter(p => !p.static).length % 2 === 0 ? "white" : "black";
        if (!addPiece(side, type, r, c, false)) rightAttempts++;
      }

      activeSide = "white";
    }


    interface Move {
      r: number;
      c: number;
      capture: boolean;
    }

    function destinationsFor(piece: Piece): Move[] {
      const moves: Move[] = [];

      const directions: { dr: number; dc: number; slide: boolean }[] = [];
      if (piece.type === "king") {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr || dc) directions.push({ dr, dc, slide: false });
          }
        }
      } else if (piece.type === "knight") {
        [
          [-2, -1], [-2, 1], [-1, -2], [-1, 2],
          [1, -2], [1, 2], [2, -1], [2, 1],
        ].forEach(([dr, dc]) => directions.push({ dr, dc, slide: false }));
      } else if (piece.type === "rook" || piece.type === "queen") {
        [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) =>
          directions.push({ dr, dc, slide: true })
        );
      }
      if (piece.type === "bishop" || piece.type === "queen") {
        [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([dr, dc]) =>
          directions.push({ dr, dc, slide: true })
        );
      }

      if (piece.type === "pawn") {
        const dir = piece.side === "white" ? -1 : 1;
        const forward = piece.r + dir;
        if (inside(forward, piece.c) && !occupiedAt(forward, piece.c)) {
          moves.push({ r: forward, c: piece.c, capture: false });
          const startRow = piece.side === "white" ? rows - 2 : 1;
          const twice = piece.r + dir * 2;
          if (piece.r === startRow && inside(twice, piece.c) && !occupiedAt(twice, piece.c)) {
            moves.push({ r: twice, c: piece.c, capture: false });
          }
        }
        for (const dc of [-1, 1]) {
          const target = inside(forward, piece.c + dc) ? occupiedAt(forward, piece.c + dc) : null;
          if (target && target.side !== piece.side && target.type !== "king") {
            moves.push({ r: forward, c: piece.c + dc, capture: true });
          }
        }
      }

      directions.forEach(({ dr, dc, slide }) => {
        let r = piece.r + dr;
        let c = piece.c + dc;
        while (inside(r, c)) {
          const target = occupiedAt(r, c);
          if (target) {
            if (target.side !== piece.side && target.type !== "king") {
              moves.push({ r, c, capture: true });
            }
            break;
          }
          moves.push({ r, c, capture: false });
          if (!slide) break;
          r += dr;
          c += dc;
        }
      });

      return moves;
    }

    function showCaptureFlash(r: number, c: number) {
      if (!pieceLayer) return;
      const flash = document.createElement("span");
      flash.className = "hero-capture-flash";
      flash.style.left = `${((c + 0.5) / cols) * 100}%`;
      flash.style.top = `${((r + 0.5) / rows) * 100}%`;
      pieceLayer.appendChild(flash);
      window.setTimeout(() => flash.remove(), 720);
    }

    function makeMove() {
      if (!pieces.length) return;
      const movable = pieces
        .filter((piece) => piece.side === activeSide && !piece.static)
        .map((piece) => ({ piece, moves: destinationsFor(piece) }))
        .filter((entry) => entry.moves.length);

      if (!movable.length) {
        seedPosition();
        scheduleMove();
        return;
      }

      const captureOptions = movable.flatMap((entry) =>
        entry.moves
          .filter((move) => move.capture)
          .map((move) => ({ piece: entry.piece, move }))
      );
      const chooseCapture = captureOptions.length > 0 && Math.random() < 0.18;
      let chosen: { piece: Piece; move: Move };

      if (chooseCapture) {
        chosen = captureOptions[randomInt(captureOptions.length)];
      } else {
        const entry = movable[randomInt(movable.length)];
        const quietMoves = entry.moves.filter((move) => !move.capture);
        chosen = {
          piece: entry.piece,
          move: (quietMoves.length ? quietMoves : entry.moves)[
            randomInt((quietMoves.length ? quietMoves : entry.moves).length)
          ],
        };
      }

      const { piece, move } = chosen;
      const captured = occupiedAt(move.r, move.c);
      if (captured) {
        captured.el.classList.add("is-captured");
        showCaptureFlash(move.r, move.c);
        pieces = pieces.filter((item) => item !== captured);
        window.setTimeout(() => captured.el.remove(), 460);
      }

      piece.r = move.r;
      piece.c = move.c;
      piece.el.classList.add("is-moving");
      requestAnimationFrame(() => positionElement(piece));
      window.setTimeout(() => piece.el.classList.remove("is-moving"), 980);
      activeSide = activeSide === "white" ? "black" : "white";
      scheduleMove();
    }

    function scheduleMove() {
      window.clearTimeout(moveTimer);
      moveTimer = 0;
      if (document.hidden || !inView || reducedMotion.matches) return;
      moveTimer = window.setTimeout(() => {
        moveTimer = 0;
        makeMove();
      }, 1450 + Math.random() * 1750);
    }

    function syncPlayback() {
      const shouldAnimate = !document.hidden && inView && !reducedMotion.matches;
      if (shouldAnimate) {
        if (!moveTimer) scheduleMove();
      } else {
        window.clearTimeout(moveTimer);
        moveTimer = 0;
        pieceLayer?.classList.add("is-paused");
      }
    }

    function rebuild() {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        const oldCount = pieces.length;
        buildTiles();
        seedPosition();
        if (oldCount && oldCount < pieces.length) {
          pieces.slice(oldCount).forEach((piece) => piece.el.remove());
          pieces = pieces.slice(0, oldCount);
        }
        syncPlayback();
      });
    }

    buildTiles();
    seedPosition();

    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          inView = entries.some((entry) => entry.isIntersecting);
          syncPlayback();
        },
        { threshold: 0.02 }
      );
      observer.observe(hero);
    }

    const onVisibilityChange = () => syncPlayback();
    document.addEventListener("visibilitychange", onVisibilityChange);

    const onMotionChange = () => syncPlayback();
    if ("addEventListener" in reducedMotion) {
      reducedMotion.addEventListener("change", onMotionChange);
    }

    window.addEventListener("resize", rebuild, { passive: true });
    syncPlayback();

    return () => {
      window.clearTimeout(moveTimer);
      window.cancelAnimationFrame(resizeFrame);
      if (observer) observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if ("removeEventListener" in reducedMotion) {
        reducedMotion.removeEventListener("change", onMotionChange);
      }
      window.removeEventListener("resize", rebuild);
      clearPieces();
    };
  }, []);

  return (
    <div ref={containerRef} className="hero-chess-backdrop" aria-hidden="true">
      <div ref={gridRef} className="hero-chess-grid" id="hero-chess-grid" />
      <div ref={pieceLayerRef} className="hero-chess-pieces" id="hero-chess-pieces" />
      <div className="hero-chess-vignette" />
    </div>
  );
}
