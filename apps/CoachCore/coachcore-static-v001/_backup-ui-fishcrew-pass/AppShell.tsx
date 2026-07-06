import Link from "next/link";

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

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-64 border-r border-white/10 bg-white/[0.03] p-6 lg:block">
          <Link href="/" className="block">
            <p className="text-xs uppercase tracking-[0.35em] text-sky-300">MackSims</p>
            <h1 className="mt-2 text-2xl font-black">CoachCore</h1>
          </Link>

          <nav className="mt-10 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 pb-24 lg:pb-0">{children}</main>

        <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-white/10 bg-slate-950/95 px-2 py-2 backdrop-blur lg:hidden">
          {mobileNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-xl px-2 py-2 text-center text-xs text-slate-300 hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
