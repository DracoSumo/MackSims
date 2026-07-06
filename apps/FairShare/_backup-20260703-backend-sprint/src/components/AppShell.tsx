import type { ReactNode } from "react";
import { marketConfigs } from "../data/mockData";
import { DemoDataBanner } from "./DemoDataBanner";
import { MarketModeBadge } from "./MarketModeBadge";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/compare", label: "Compare" },
  { href: "/crowd-meter", label: "CrowdMeter" },
  { href: "/settings", label: "Settings" },
];

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
          <span className="brand-mark">FS</span>
          <span>
            <strong>FairShare</strong>
            <small>Mobility compare</small>
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
    </div>
  );
}
