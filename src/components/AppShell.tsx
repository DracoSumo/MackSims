import type { ReactNode } from "react";
import { marketConfigs } from "../data/mockData";
import { MarketModeBadge } from "./MarketModeBadge";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/compare", label: "Compare" },
  { href: "/crowd-meter", label: "CrowdMeter" },
  { href: "/admin", label: "Admin" },
  { href: "/admin/bermuda", label: "Bermuda" },
  { href: "/driver", label: "Driver" },
  { href: "/government", label: "Government" },
  { href: "/canyon", label: "Canyon" },
  { href: "/settings", label: "Settings" }
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
