import { ImageResponse } from "next/og";

// The cover for link previews (WhatsApp, X) and the Books page, drawn at build time.
// Two fixed columns (text 640px, picture 380px) so the art can never sit on the words.
export const alt = "CSC205 All-In-One Revision: lecture notes and past papers in one PDF.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const rows = [
  ["A3C5H", "1010 0011 1100 0101"],
  ["−6 in 4 bits", "1010"],
  ["261", "105H"],
];

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
          <div style={{ fontSize: 24, letterSpacing: 5, color: "#137a35" }}>REVISION NOTES · ONE PDF</div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 22, lineHeight: 1.02 }}>
            <span style={{ fontSize: 92, fontWeight: 800 }}>CSC205</span>
            <span style={{ fontSize: 64, fontWeight: 800, color: "#15847B" }}>All-In-One</span>
            <span style={{ fontSize: 64, fontWeight: 800, color: "#15847B" }}>Revision</span>
          </div>
          <div style={{ fontSize: 32, marginTop: 28, color: "#52555b", lineHeight: 1.3 }}>
            Lecture notes and three past papers, ordered by what actually comes up.
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
              taberickson.com/csc205
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 380,
            background: "#fff",
            border: "5px solid #20242B",
            borderRadius: 24,
            padding: "20px 26px",
          }}
        >
          {rows.map(([from, to], i) => (
            <div
              key={from}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "14px 0",
                borderTop: i === 0 ? "none" : "2px dashed #d9d4c8",
              }}
            >
              <span style={{ fontSize: 26, fontWeight: 700, color: "#E2703A" }}>{from}</span>
              <span style={{ fontSize: 26, fontWeight: 700, color: "#15847B" }}>= {to}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
