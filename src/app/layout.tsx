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

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.startsWith("http")
      ? process.env.NEXT_PUBLIC_SITE_URL
      : `https://${process.env.NEXT_PUBLIC_SITE_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.NODE_ENV === "production" 
    ? "https://tabe-rickson-portfolio.vercel.app" 
    : "http://localhost:3000";
};

const siteUrl = getBaseUrl();
const title = "Tabe Rickson - Website & Mobile App Developer";
const description =
  "I'm Tabe Rickson, and I build web and mobile apps that solve real problems.";
const previewImageAlt = "Tabe Rickson portfolio preview";
const previewImage = `${siteUrl}/Tabe-Rickson.png`; // Use absolute URL for WhatsApp

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
    icon:'/Tabe_Rickson_light.png',
    apple: '/Tabe_Rickson_light.png',
    shortcut: ["/favicon.ico"],
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
        url: previewImage,
        width: 1200,
        height: 630,
        alt: previewImageAlt,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [previewImage],
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
      <head>
        <meta name="image" content={previewImage} />
        <meta name="thumbnail" content={previewImage} />
      </head>
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
