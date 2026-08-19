import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-sora",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
});

export const metadata = {
  metadataBase: new URL("https://holycalculator.com"),
  title: {
    default: "Holy Calculator — Every number, one place",
    template: "%s | Holy Calculator",
  },
  description:
    "30+ free calculators — mortgage to BMI to life path number. No sign-in, no downloads, no cost. Every result shows the formula behind it.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Holy Calculator — Every number, one place",
    description:
      "30+ free calculators — mortgage to BMI to life path number. No sign-in, no downloads, no cost. Every result shows the formula behind it.",
    url: "https://holycalculator.com",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Holy Calculator — Every number, one place",
    description:
      "30+ free calculators — mortgage to BMI to life path number. No sign-in, no downloads, no cost.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
