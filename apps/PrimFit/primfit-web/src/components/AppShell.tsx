"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { primfitConfig } from "@/config/primfit";
import { HomeBackConfirm } from "@/components/TesterFeedback";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { copy } = useTheme();
  const onboarding = pathname?.includes("/onboarding");
  const nav = [
    { href: "/app/today/", label: copy.nav.today, icon: "◎" },
    { href: "/app/week/", label: copy.nav.week, icon: "▦" },
    { href: "/app/grocery/", label: copy.nav.grocery, icon: "☐" },
    { href: "/app/pros/", label: copy.nav.pros, icon: "✦" },
    { href: "/app/profile/", label: copy.nav.you, icon: "○" },
  ];

  return (
    <div className="flex min-h-screen flex-col" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <header className="sticky top-0 z-20 border-b border-[var(--pf-line)] bg-[var(--pf-header-bg)] backdrop-blur-xl">
        <div className="mx-auto flex h-12 max-w-lg items-center justify-between px-4">
          <Link href="/app/today/" className="pf-display text-[15px] font-semibold">
            <span className="text-[var(--pf-purple-bright)]">Prim</span>
            <span className="text-[var(--pf-silver)]">Fit</span>
            <span className="ml-2 text-[10px] font-medium tracking-wide text-[var(--pf-muted)]">
              {copy.packShortName}
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {!onboarding ? (
              <>
                <Link
                  href="/app/shop/"
                  className={`text-[11px] ${
                    pathname?.startsWith("/app/shop")
                      ? "text-[var(--pf-purple-bright)]"
                      : "text-[var(--pf-muted)]"
                  }`}
                >
                  {copy.shop}
                </Link>
                <Link
                  href="/app/wearables/"
                  className={`text-[11px] ${
                    pathname?.startsWith("/app/wearables")
                      ? "text-[var(--pf-purple-bright)]"
                      : "text-[var(--pf-muted)]"
                  }`}
                >
                  {copy.wearables}
                </Link>
              </>
            ) : null}
            <span className="text-[11px] text-[var(--pf-muted)]">v{primfitConfig.version}</span>
          </div>
        </div>
      </header>

      <main
        className={`mx-auto w-full max-w-lg flex-1 px-4 pt-4 ${
          onboarding ? "pb-4" : "pb-[calc(var(--pf-nav-h)+1rem)]"
        }`}
      >
        <div key={pathname} className="pf-page">
          {children}
        </div>
      </main>

      {!onboarding ? (
        <nav
          className="fixed bottom-0 left-0 right-0 z-20 border-t border-[var(--pf-line)] bg-[var(--pf-nav-bg)] backdrop-blur-xl"
          style={{
            height: "var(--pf-nav-h)",
            paddingBottom: "max(8px, env(safe-area-inset-bottom, 0px))",
          }}
        >
          <div className="mx-auto flex h-full max-w-lg items-stretch justify-around px-1">
            {nav.map((item) => {
              const active = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`pf-nav-item ${active ? "is-on" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="pf-nav-icon" aria-hidden>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      ) : null}
      <HomeBackConfirm />
    </div>
  );
}
