import { ImageResponse } from "next/og";

export const alt = "Rahman Chess Academy - Grandmaster Mentorship";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#0c0e14",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          border: "4px solid #f2ca50",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "8px",
              backgroundColor: "#1d2028",
              border: "2px solid #f2ca50",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#f2ca50",
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            ♟
          </div>
          <span
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "#f2ca50",
              letterSpacing: "2px",
            }}
          >
            RAHMAN CHESS ACADEMY
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "64px",
              fontWeight: 900,
              color: "#e6e8f2",
              lineHeight: 1.1,
            }}
          >
            Master the 64 Squares with Grandmasters.
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#9ea3b5",
              maxWidth: "900px",
            }}
          >
            FIDE-titled curriculum, 1-on-1 Grandmaster mentorship, and weekly rated arena praxis. 100% Online Worldwide.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
            fontSize: "20px",
            color: "#e1c46e",
            fontFamily: "monospace",
          }}
        >
          <span>WhatsApp: +91 72000 51588</span>
          <span>•</span>
          <span>100% Online Global Academy</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
