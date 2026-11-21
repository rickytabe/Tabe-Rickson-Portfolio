import localFont from "next/font/local";

/*
 * Fraunces, the serif used for illustration text in every book. It ships with the site (variable
 * weight, Latin, from @fontsource-variable/fraunces, SIL Open Font License: Fraunces-OFL.txt)
 * instead of next/font/google: fetching it from Google during Vercel builds failed several
 * production deploys ("module-not-found" in fraunces_*.module.css).
 */
export const fraunces = localFont({
  src: [
    { path: "./fraunces-latin-wght-normal.woff2", weight: "100 900", style: "normal" },
    { path: "./fraunces-latin-wght-italic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-fraunces",
  display: "swap",
});
