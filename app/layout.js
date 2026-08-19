import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
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
  metadataBase: new URL("https://www.holycalculator.com"),
  title: "Holy Calculator — Every number, one place",
  description:
    "30+ free calculators — mortgage to BMI to life path number. No sign-in, no downloads, no cost. Every result shows the formula behind it.",
  alternates: {
    canonical: "/",
  },
  other: {
    "google-adsense-account": "ca-pub-8328664420871406",
  },
  openGraph: {
    title: "Holy Calculator — Every number, one place",
    description:
      "30+ free calculators — mortgage to BMI to life path number. No sign-in, no downloads, no cost. Every result shows the formula behind it.",
    url: "https://www.holycalculator.com",
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
      <head>
        {/* Google AdSense direct script & verification */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8328664420871406"
          crossOrigin="anonymous"
        />
        {/* Google tag (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-D6P3QM64S3"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-D6P3QM64S3');
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
