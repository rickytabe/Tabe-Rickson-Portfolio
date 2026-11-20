import { ImageResponse } from "next/og";

// The cover for link previews (WhatsApp, X) and the Books page, drawn at build time.
export const alt = "CSC211 Made Easy: every tutorial question solved step by step. Questions 1 to 15 free.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f6f3ec",
          color: "#1d1f23",
          padding: "64px 72px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontSize: 26, letterSpacing: 6, textTransform: "uppercase", color: "#137a35", fontFamily: "monospace" }}>
            CSC211 made easy · tutorial solutions
          </div>
          <div style={{ display: "flex", fontSize: 104, fontWeight: 800, marginTop: 26, lineHeight: 1 }}>
            CSC211&nbsp;<span style={{ fontStyle: "italic", color: "#15847B" }}>Made Easy</span>
          </div>
          <div style={{ fontSize: 38, marginTop: 28, color: "#52555b", maxWidth: 640, lineHeight: 1.3 }}>
            Every probability question on the tutorial sheet, solved step by step.
          </div>
          <div style={{ display: "flex", marginTop: "auto", gap: 18 }}>
            <div
              style={{
                display: "flex",
                padding: "14px 26px",
                borderRadius: 14,
                background: "#39FF14",
                color: "#121212",
                fontSize: 30,
                fontWeight: 700,
                fontFamily: "monospace",
              }}
            >
              Q1–15 FREE
            </div>
            <div
              style={{
                display: "flex",
                padding: "14px 26px",
                borderRadius: 14,
                border: "2px solid #20242B",
                fontSize: 30,
                fontFamily: "monospace",
              }}
            >
              + Algo quiz bot
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: 360 }}>
          <svg width="360" height="300" viewBox="0 0 360 300">
            <rect x="10" y="10" width="340" height="280" rx="22" fill="#fff" stroke="#20242B" strokeWidth="5" />
            <path d="M34 244H326" stroke="#20242B" strokeWidth="4" />
            <path d="M40 242C110 242 128 70 180 70S250 242 320 242" fill="none" stroke="#20242B" strokeWidth="6" />
            <path d="M180 70C214 70 232 140 246 190L246 242L180 242Z" fill="#15847B" fillOpacity="0.4" />
            <path d="M180 70V242" stroke="#20242B" strokeWidth="3" strokeDasharray="8 8" />
          </svg>
        </div>
      </div>
    ),
    size
  );
}
