import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-serif" 
});

export const metadata: Metadata = {
  title: "DANA'S ARCHIVE | A Private Lounge",
  description: "The world's most romantic private cinema for Dana. Enjoy beautiful stories with aesthetic cinematic visuals.",
  keywords: ["Cinema", "Romantic", "Dana", "Movie lounge", "Aesthetic", "Boutique"],
  openGraph: {
    title: "DANA'S ARCHIVE",
    description: "A special movie lounge prepared exclusively for Dana",
    url: "https://dana-cinema.vercel.app",
    siteName: "DANA'S ARCHIVE",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={`${outfit.variable} ${playfair.variable} font-sans antialiased text-white`}>
        {children}
      </body>
    </html>
  );
}

