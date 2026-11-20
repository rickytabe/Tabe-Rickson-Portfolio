import type { Metadata } from "next";
import OpenAlgo from "./OpenAlgo";

/*
 * taberickson.com/csc207/quiz, the link students share for the quiz.
 * People are redirected to the book with Algo open by src/proxy.ts before this page renders.
 * Link-preview bots (WhatsApp, Facebook, X, ...) are let through so they read the quiz card
 * below. If anyone else ends up here, OpenAlgo forwards them in the browser.
 */

const title = "CSC207 Quiz: test yourself before the CA";
const description =
  "10 quick questions on Introduction to Algorithms, instant explanations, and a weekly leaderboard. Free to play.";
const image = "/algorithms-made-easy-csc207/quiz-og.png";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/algorithms-made-easy-csc207" },
  robots: { index: false, follow: true },
  openGraph: {
    title,
    description,
    url: "https://taberickson.com/csc207/quiz",
    siteName: "taberickson.com",
    type: "website",
    locale: "en_US",
    images: [{ url: image, width: 1200, height: 630, alt: "CSC207 Quiz. 10 questions, free to play, weekly leaderboard." }],
  },
  twitter: { card: "summary_large_image", title, description, images: [image] },
};

export default function QuizLink() {
  return (
    <main style={{ minHeight: "60vh", display: "grid", placeItems: "center", padding: "120px 20px", textAlign: "center" }}>
      <p>
        Opening Algo, the CSC207 quiz bot…{" "}
        <a href="/algorithms-made-easy-csc207?quiz=1" style={{ textDecoration: "underline" }}>
          Tap here if nothing happens
        </a>
      </p>
      <OpenAlgo />
    </main>
  );
}
