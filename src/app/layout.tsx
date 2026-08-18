import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import portfolioData from "../../portfolio-data.json";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});


const siteUrl = "https://taberickson.com";
const title = "Tabe Rickson - Full-Stack & AI Developer";
const description = "I'm Tabe Rickson, and I build web and mobile apps that solve real problems.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  applicationName: "Tabe Rickson Portfolio",
  title,
  description,
  authors: [{ name: "Tabe Rickson" }],
  creator: "Tabe Rickson",
  publisher: "Tabe Rickson",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/Tabe-Rickson_light.png", sizes: "16x16", type: "image/png" },
      { url: "/Tabe-Rickson_light.png", sizes: "32x32", type: "image/png" },
      { url: "/Tabe-Rickson_light.png", sizes: "48x48", type: "image/png" },
    ],
    apple: "/Tabe-Rickson_light.png",
    shortcut: "/Tabe-Rickson_light.png",
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "Tabe Rickson Portfolio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Tabe Rickson Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/twitter-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "@id": "https://taberickson.com/#person",
              "name": "Tabe Rickson",
              "jobTitle": "Full-Stack Web & Mobile Software Engineer",
              "url": "https://taberickson.com",
              "image": "https://taberickson.com/my-pic1.png",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Buea",
                "addressCountry": "Cameroon"
              },
              "worksFor": {
                "@type": "Organization",
                "name": "NestBridge"
              },
              "sameAs": [
                portfolioData.socials.github,
                portfolioData.socials.linkedin,
                portfolioData.socials.twitter
              ].filter(Boolean),
              "knowsAbout": Array.from(new Set(portfolioData.projects.flatMap(p => p.techIcons)))
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Analytics />
          <Toaster 
            position="top-center" 
            toastOptions={{
              style: {
                fontSize: '16px',
                padding: '16px 24px',
                maxWidth: '500px',
              }
            }}
            containerStyle={{ zIndex: 999999 }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
