import React from "react";

export type PieceType = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";

interface ChessPieceProps extends React.SVGProps<SVGSVGElement> {
  piece: PieceType;
  className?: string;
}

export function ChessPieceSpriteDefs() {
  return (
    <svg aria-hidden="true" style={{ display: "none" }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <g id="svg-piece-pawn" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2">
          <circle cx="12" cy="6" r="3.2" />
          <path d="M9.5 9.5c0 2 1.2 3.5 2.5 5.5-1.5.5-3.5 1.5-4 4.5h8c-.5-3-2.5-4-4-4.5 1.3-2 2.5-3.5 2.5-5.5z" />
          <path d="M5.5 21h13" />
        </g>
        <g id="svg-piece-knight" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2">
          <path d="M7 21h10c-.5-2.5-1.5-3.5-3-4 .5-1.5 2.5-3 2.5-5.5 0-3-2-5.5-5.5-5.5-1.5 0-2.8.6-3.8 1.8l-1.7 2.2c-.8 1-.3 2.5.8 2.8l1.2.3c-.8 1.2-1.5 2.6-1.5 4.9 0 1 .5 2 1 3z" />
          <circle cx="10" cy="9.5" fill="var(--bg-surface)" r="1" stroke="none" />
        </g>
        <g id="svg-piece-bishop" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2">
          <circle cx="12" cy="4.2" r="1.5" />
          <path d="M12 6.5c-3 0-4.5 3-4.5 6 0 2.5 1.5 4 4.5 5 3-1 4.5-2.5 4.5-5 0-3-1.5-6-4.5-6z" />
          <path d="M10 11.5l4-2.5" fill="none" stroke="var(--bg-surface)" strokeWidth="1.3" />
          <path d="M8 18.5h8" />
          <path d="M6 21h12" />
        </g>
        <g id="svg-piece-rook" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2">
          <path d="M6 5h2v3h2V5h4v3h2V5h2v4.5c0 1.5-1 2.5-2 3v3.5h2v2H6v-2h2V12.5c-1-.5-2-1.5-2-3V5z" />
          <path d="M5 21h14" />
        </g>
        <g id="svg-piece-queen" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2">
          <circle cx="5" cy="6" r="1.3" />
          <circle cx="8.5" cy="4.5" r="1.3" />
          <circle cx="12" cy="4" r="1.3" />
          <circle cx="15.5" cy="4.5" r="1.3" />
          <circle cx="19" cy="6" r="1.3" />
          <path d="M5 8.5l2 8.5h10l2-8.5-4 3.5-3-5.5-3 5.5-4-3.5z" />
          <path d="M6 18h12" />
          <path d="M4.5 21h15" />
        </g>
        <g id="svg-piece-king" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2">
          <path d="M12 2.5v4M10 4.5h4" fill="none" strokeWidth="1.4" />
          <path d="M7 8c2-1 4-1 5 1 1-2 3-2 5-1 1.5 2.5 1 6.5-1 9.5h-8c-2-3-2.5-7-1-9.5z" />
          <path d="M7 19.5h10" />
          <path d="M5 21.5h14" />
        </g>
      </defs>
    </svg>
  );
}

export function ChessPiece({ piece, className = "w-full h-full", ...props }: ChessPieceProps) {
  switch (piece) {
    case "pawn":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" className={className} {...props}>
          <circle cx="12" cy="6" r="3.2" />
          <path d="M9.5 9.5c0 2 1.2 3.5 2.5 5.5-1.5.5-3.5 1.5-4 4.5h8c-.5-3-2.5-4-4-4.5 1.3-2 2.5-3.5 2.5-5.5z" />
          <path d="M5.5 21h13" />
        </svg>
      );
    case "knight":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" className={className} {...props}>
          <path d="M7 21h10c-.5-2.5-1.5-3.5-3-4 .5-1.5 2.5-3 2.5-5.5 0-3-2-5.5-5.5-5.5-1.5 0-2.8.6-3.8 1.8l-1.7 2.2c-.8 1-.3 2.5.8 2.8l1.2.3c-.8 1.2-1.5 2.6-1.5 4.9 0 1 .5 2 1 3z" />
          <circle cx="10" cy="9.5" fill="var(--bg-surface)" r="1" stroke="none" />
        </svg>
      );
    case "bishop":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" className={className} {...props}>
          <circle cx="12" cy="4.2" r="1.5" />
          <path d="M12 6.5c-3 0-4.5 3-4.5 6 0 2.5 1.5 4 4.5 5 3-1 4.5-2.5 4.5-5 0-3-1.5-6-4.5-6z" />
          <path d="M10 11.5l4-2.5" fill="none" stroke="var(--bg-surface)" strokeWidth="1.3" />
          <path d="M8 18.5h8" />
          <path d="M6 21h12" />
        </svg>
      );
    case "rook":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" className={className} {...props}>
          <path d="M6 5h2v3h2V5h4v3h2V5h2v4.5c0 1.5-1 2.5-2 3v3.5h2v2H6v-2h2V12.5c-1-.5-2-1.5-2-3V5z" />
          <path d="M5 21h14" />
        </svg>
      );
    case "queen":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" className={className} {...props}>
          <circle cx="5" cy="6" r="1.3" />
          <circle cx="8.5" cy="4.5" r="1.3" />
          <circle cx="12" cy="4" r="1.3" />
          <circle cx="15.5" cy="4.5" r="1.3" />
          <circle cx="19" cy="6" r="1.3" />
          <path d="M5 8.5l2 8.5h10l2-8.5-4 3.5-3-5.5-3 5.5-4-3.5z" />
          <path d="M6 18h12" />
          <path d="M4.5 21h15" />
        </svg>
      );
    case "king":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" className={className} {...props}>
          <path d="M12 2.5v4M10 4.5h4" fill="none" strokeWidth="1.4" />
          <path d="M7 8c2-1 4-1 5 1 1-2 3-2 5-1 1.5 2.5 1 6.5-1 9.5h-8c-2-3-2.5-7-1-9.5z" />
          <path d="M7 19.5h10" />
          <path d="M5 21.5h14" />
        </svg>
      );
  }
}
