import React from "react";
import { ChessPiece, PieceType } from "./ChessPiece";

interface HoverCardProps extends React.HTMLAttributes<HTMLDivElement> {
  cornerPiece?: PieceType;
  children: React.ReactNode;
  className?: string;
}

export function HoverCard({
  cornerPiece,
  children,
  className = "",
  ...props
}: HoverCardProps) {
  return (
    <div className={`chess-hover-card ${className}`} {...props}>
      <div className="card-checker-bg" aria-hidden="true" />
      {cornerPiece && (
        <div className="card-corner-piece" aria-hidden="true">
          <ChessPiece piece={cornerPiece} />
        </div>
      )}
      {children}
    </div>
  );
}
