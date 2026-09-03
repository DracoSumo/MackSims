import type { Metadata, Viewport } from "next";
import { Cinzel, Geist, Geist_Mono, M_PLUS_Rounded_1c } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { primfitConfig } from "@/config/primfit";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const mplus = M_PLUS_Rounded_1c({
  variable: "--font-mplus",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const THEME_BOOTSTRAP = `(function(){try{var raw=localStorage.getItem("primfit.activeTheme");var id=raw?JSON.parse(raw):"sleek";if(id!=="sleek"&&id!=="dnd"&&id!=="anime")id="sleek";var ownedRaw=localStorage.getItem("primfit.ownedPacks");var owned=ownedRaw?JSON.parse(ownedRaw):["sleek"];if(!Array.isArray(owned)||owned.indexOf(id)<0)id="sleek";document.documentElement.setAttribute("data-theme",id);}catch(e){document.documentElement.setAttribute("data-theme","sleek");}})();`;

export const metadata: Metadata = {
  title: `${primfitConfig.appName} — ${primfitConfig.hook}`,
  description: primfitConfig.tagline,
  applicationName: primfitConfig.appName,
  appleWebApp: { capable: true, title: primfitConfig.appName, statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050508",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="sleek"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${mplus.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
