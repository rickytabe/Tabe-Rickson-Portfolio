import { ImageResponse } from "next/og";

// The cover for link previews (WhatsApp, X) and the Books page, drawn at build time.
// Two fixed columns (text 640px, picture 380px) so the art can never sit on the words.
export const alt = "CSC211 Tutorial Sheet Solutions: every question solved step by step.";
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
          <div style={{ fontSize: 24, letterSpacing: 5, color: "#137a35" }}>PROBABILITY &amp; STATISTICS</div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 22, lineHeight: 1.02 }}>
            <span style={{ fontSize: 92, fontWeight: 800 }}>CSC211</span>
            <span style={{ fontSize: 64, fontWeight: 800, color: "#15847B" }}>Tutorial Sheet</span>
            <span style={{ fontSize: 64, fontWeight: 800, color: "#15847B" }}>Solutions</span>
          </div>
          <div style={{ fontSize: 32, marginTop: 28, color: "#52555b", lineHeight: 1.3 }}>
            Every question solved, step by step. Know exactly which rule to use in the CA.
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
              taberickson.com/csc211
            </div>
          </div>
        </div>
        <div style={{ display: "flex", width: 380 }}>
          <svg width="380" height="320" viewBox="0 0 380 320">
            <rect x="6" y="6" width="368" height="308" rx="24" fill="#fff" stroke="#20242B" strokeWidth="5" />
            <path d="M34 262H346" stroke="#20242B" strokeWidth="4" />
            <path d="M44 260C116 260 136 74 190 74S264 260 336 260" fill="none" stroke="#20242B" strokeWidth="6" />
            <path d="M190 74C226 74 244 150 258 204L258 260L190 260Z" fill="#15847B" fillOpacity="0.4" />
            <path d="M190 74V260" stroke="#20242B" strokeWidth="3" strokeDasharray="8 8" />
            <rect x="34" y="28" width="58" height="58" rx="12" fill="#F3BF3F" stroke="#20242B" strokeWidth="4" />
            <circle cx="50" cy="44" r="5" fill="#20242B" />
            <circle cx="63" cy="57" r="5" fill="#20242B" />
            <circle cx="76" cy="70" r="5" fill="#20242B" />
          </svg>
        </div>
      </div>
    ),
    size
  );
}
