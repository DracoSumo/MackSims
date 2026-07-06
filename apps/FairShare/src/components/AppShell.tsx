import type { ReactNode } from "react";
import { APP_NAME, APP_TAGLINE } from "../config";
import { marketConfigs } from "../data/mockData";
import { DemoDataBanner } from "./DemoDataBanner";
import { MarketModeBadge } from "./MarketModeBadge";

const navItems = [
  { href: "/", label: "Home", short: "Home", icon: "home" as const },
  { href: "/compare", label: "Compare", short: "Compare", icon: "compare" as const },
  { href: "/crowd-meter", label: "CrowdMeter", short: "Crowd", icon: "crowd" as const },
  { href: "/settings", label: "Settings", short: "Account", icon: "account" as const },
];

function NavIcon({ type }: { type: "home" | "compare" | "crowd" | "account" }) {
  const props = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (type) {
    case "home":
      return <svg {...props}><path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" stroke="currentColor" /></svg>;
    case "compare":
      return <svg {...props}><path d="M4 19h16M7 16V8m5 8V5m5 11v-6" stroke="currentColor" /></svg>;
    case "crowd":
      return <svg {...props}><circle cx="12" cy="12" r="9" stroke="currentColor" /><path d="M12 7v5l3 2" stroke="currentColor" /></svg>;
    case "account":
      return <svg {...props}><circle cx="12" cy="8" r="4" stroke="currentColor" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" /></svg>;
  }
}

/** Operator/internal shells — not in primary beta nav; reachable from Settings. */
export const internalNavItems = [
  { href: "/admin", label: "Admin (demo)" },
  { href: "/admin/bermuda", label: "Bermuda pilot" },
  { href: "/driver", label: "Driver (demo)" },
  { href: "/government", label: "Government (demo)" },
  { href: "/canyon", label: "Canyon (planned)" },
];

interface AppShellProps {
  children: ReactNode;
  currentPath: string;
  onNavigate: (href: string) => void;
}

export function AppShell({ children, currentPath, onNavigate }: AppShellProps) {
  const bermudaMarket = marketConfigs.find((market) => market.id === "bermuda") ?? marketConfigs[0];

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand-button" type="button" onClick={() => onNavigate("/")}>
          <span className="brand-mark">CC</span>
          <span>
            <strong>{APP_NAME}</strong>
            <small>{APP_TAGLINE}</small>
          </span>
        </button>

        <div className="topbar-actions">
          <MarketModeBadge market={bermudaMarket} />
          <button className="account-button" type="button" onClick={() => onNavigate("/settings")}>
            Account
          </button>
        </div>
      </header>

      <DemoDataBanner />

      <nav className="main-nav" aria-label="Primary">
        {navItems.map((item) => (
          <button
            className={currentPath === item.href ? "active" : ""}
            key={item.href}
            type="button"
            onClick={() => onNavigate(item.href)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <main>{children}</main>

      <nav className="bottom-nav" aria-label="Primary mobile">
        {navItems.map((item) => (
          <button
            className={currentPath === item.href ? "active" : ""}
            key={`mobile-${item.href}`}
            type="button"
            onClick={() => onNavigate(item.href)}
          >
            <span aria-hidden="true"><NavIcon type={item.icon} /></span>
            {item.short}
          </button>
        ))}
      </nav>
    </div>
  );
}
