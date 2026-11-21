import localFont from "next/font/local";

/*
 * The site-wide fonts, shipped with the site (variable weight, Latin, from @fontsource-variable,
 * SIL Open Font License: the *-OFL.txt files here) instead of next/font/google. Fetching fonts
 * from Google during Vercel builds failed several production deploys ("module-not-found" in
 * [next]/internal/font/google/*.module.css), so no build should depend on that network call.
 */
export const spaceGrotesk = localFont({
  src: "./space-grotesk-latin-wght-normal.woff2",
  weight: "300 700",
  variable: "--font-space-grotesk",
  display: "swap",
});

export const jetbrainsMono = localFont({
  src: "./jetbrains-mono-latin-wght-normal.woff2",
  weight: "100 800",
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const inter = localFont({
  src: "./inter-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});
