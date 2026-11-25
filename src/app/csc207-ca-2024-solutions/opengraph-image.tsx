import { ImageResponse } from "next/og";

// The cover for link previews (WhatsApp, X) and the Books page, drawn at build time.
// Two fixed columns (text 640px, picture 380px) so the art can never sit on the words.
export const alt = "CSC207 CA 2024: every question on the paper, solved.";
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
          alignItems: "center",
          justifyContent: "space-between",
          background: "#f6f3ec",
          color: "#1d1f23",
          padding: "0 72px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: 640 }}>
          <div style={{ fontSize: 24, letterSpacing: 5, color: "#137a35" }}>INTRODUCTION TO ALGORITHMS · CA 2024</div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 22, lineHeight: 1.02 }}>
            <span style={{ fontSize: 92, fontWeight: 800 }}>CSC207</span>
            <span style={{ fontSize: 64, fontWeight: 800, color: "#15847B" }}>CA 2024</span>
            <span style={{ fontSize: 64, fontWeight: 800, color: "#15847B" }}>Solutions</span>
          </div>
          <div style={{ fontSize: 32, marginTop: 28, color: "#52555b", lineHeight: 1.3 }}>
            Every question on the paper solved: pseudocode, flowchart and exact outputs.
          </div>
          <div style={{ display: "flex", marginTop: 34 }}>
            <div
              style={{
                display: "flex",
                padding: "12px 24px",
                borderRadius: 12,
                background: "#1d1f23",
                color: "#39FF14",
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              taberickson.com/csc207/ca2024
            </div>
          </div>
        </div>
        <div style={{ display: "flex", width: 380 }}>
          <svg width="380" height="320" viewBox="0 0 380 320">
            <rect x="6" y="6" width="368" height="308" rx="24" fill="#fff" stroke="#20242B" strokeWidth="5" />
            <rect x="40" y="40" width="110" height="44" rx="22" fill="#fff" stroke="#20242B" strokeWidth="4" />
            <path d="M95 84V112" stroke="#20242B" strokeWidth="4" />
            <path d="M95 112L150 152L95 192L40 152Z" fill="#F3BF3F" stroke="#20242B" strokeWidth="4" />
            <path d="M150 152H200" stroke="#20242B" strokeWidth="4" />
            <rect x="200" y="128" width="96" height="48" rx="10" fill="#9ED3C9" stroke="#20242B" strokeWidth="4" />
            <path d="M95 192V246H200" stroke="#20242B" strokeWidth="4" fill="none" />
            <rect x="200" y="222" width="96" height="48" rx="10" fill="#F6C9B4" stroke="#20242B" strokeWidth="4" />
            <path d="M318 120A46 46 0 1 1 318 212" fill="none" stroke="#15847B" strokeWidth="6" />
            <path d="M318 212L306 204L308 220Z" fill="#15847B" />
          </svg>
        </div>
      </div>
    ),
    size
  );
}
