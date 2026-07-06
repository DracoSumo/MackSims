"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DemoWalkthroughBanner } from "@/components/DemoWalkthroughBanner";

const navItems = [
  { label: "Dashboard", href: "/app" },
  { label: "Team", href: "/app/team" },
  { label: "Chat", href: "/app/chat" },
  { label: "Playbook", href: "/app/playbook" },
  { label: "Training", href: "/app/training" },
  { label: "Nutrition", href: "/app/nutrition" },
  { label: "Video", href: "/app/video" },
  { label: "Accountability", href: "/app/accountability" },
  { label: "Integrations", href: "/app/integrations" },
  { label: "Profile", href: "/app/profile" },
];

const mobileNavItems = [
  { label: "Home", href: "/app" },
  { label: "Team", href: "/app/team" },
  { label: "Train", href: "/app/training" },
  { label: "Fuel", href: "/app/nutrition" },
  { label: "Proof", href: "/app/accountability" },
];

function navClass(active: boolean) {
  return active
    ? "block rounded-[10px] bg-gradient-to-br from-teal-400/25 to-sky-500/20 px-4 py-3 text-sm font-bold text-white ring-1 ring-teal-300/30"
    : "block rounded-[10px] px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white";
}

function mobileNavClass(active: boolean) {
  return active
    ? "rounded-[10px] bg-gradient-to-br from-teal-400/25 to-sky-500/20 px-2 py-2 text-center text-xs font-bold text-white ring-1 ring-teal-300/30"
    : "rounded-[10px] px-2 py-2 text-center text-xs text-slate-300 hover:bg-white/10 hover:text-white";
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-r border-white/10 bg-[rgba(4,18,30,0.92)] p-6 backdrop-blur-xl lg:flex">
          <Link href="/" className="block">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-teal-300">MackSims</p>
            <h1 className="mt-2 text-2xl font-black tracking-tight">CoachCore</h1>
            <p className="mt-1 text-xs text-slate-400">No more guessing who is locked in.</p>
          </Link>

          <nav className="mt-10 flex-1 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const active =
                item.href === "/app"
                  ? pathname === "/app"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link key={item.label} href={item.href} className={navClass(active)}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 pb-[calc(var(--ms-nav-h)+env(safe-area-inset-bottom)+12px)] lg:pb-0">
          <DemoWalkthroughBanner />
          {children}
        </main>

        <nav
          className="fixed inset-x-0 bottom-0 z-50 mx-auto grid max-w-lg grid-cols-5 gap-1 border border-white/10 bg-[rgba(5,25,39,0.96)] px-2 py-2 backdrop-blur-xl lg:hidden"
          style={{
            marginBottom: "max(8px, env(safe-area-inset-bottom))",
            borderRadius: "14px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(760px, calc(100% - 16px))",
            boxShadow: "0 20px 58px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {mobileNavItems.map((item) => {
            const active =
              item.href === "/app"
                ? pathname === "/app"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.label} href={item.href} className={mobileNavClass(active)}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
