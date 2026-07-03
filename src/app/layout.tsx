import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";

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
const title = "Tabe Rickson - Website & Mobile App Developer";
const description = "I'm Tabe Rickson, and I build web and mobile apps that solve real problems.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Tabe Rickson Portfolio",
  title,
  description,
  authors: [{ name: "Tabe Rickson" }],
  creator: "Tabe Rickson",
  publisher: "Tabe Rickson",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-32x32.png",
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
        url: "/Tabe-Rickson_light.png",
        width: 1200,
        height: 630,
        alt: "Tabe Rickson's portfolio",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/Tabe-Rickson_light.png"],
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
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
