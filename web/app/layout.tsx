import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const ibm = IBM_Plex_Sans({
  variable: "--font-ibm",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmMono = IBM_Plex_Mono({
  variable: "--font-ibm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QWERTY Rescue ERP",
  description: "Surplus food donation, matching, dispatch, and receipt operations for Team QWERTY.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${ibm.variable} ${ibmMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper text-ink">
        <style>{`
          .bg-panel {
            background:
              linear-gradient(180deg, #fffefb, #fff4e4) padding-box,
              linear-gradient(120deg, #1f8a5b, #c6a15b, #c4532a) border-box !important;
            color: #0c1c16;
            border: 2px solid transparent !important;
            box-shadow: 0 16px 36px rgba(16, 36, 28, 0.12), inset 0 1px 0 #fff;
          }
          article.bg-panel,
          section.bg-panel,
          div.rounded-2xl.bg-panel,
          .login-tile,
          .login-card,
          .role-btn,
          .nav-link {
            transition: transform .2s ease, box-shadow .2s ease, filter .2s ease;
          }
          article.bg-panel:hover,
          section.bg-panel:hover,
          div.rounded-2xl.bg-panel:hover,
          .login-tile:hover,
          .login-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 28px 54px rgba(14, 59, 46, 0.22), 0 0 0 1px rgba(198, 161, 91, 0.35);
          }
          .role-btn:hover,
          .nav-link:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 22px rgba(14, 59, 46, 0.18);
          }
          .text-muted { color: #243d32 !important; }
          .text-ink { color: #0c1c16 !important; }
          .data-table td { color: #0c1c16; }
          .data-table th { color: #1a3d30; background: #f4ecdc; }
        `}</style>
        {children}
      </body>
    </html>
  );
}
