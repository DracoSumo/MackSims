import type { ReactNode } from "react";
import { marketConfigs } from "../data/mockData";
import { AlertsStrip } from "./AlertsStrip";
import { MarketModeBadge } from "./MarketModeBadge";
import { OnboardingOverlay } from "./OnboardingOverlay";

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
      <div className="demo-banner" role="note">
        Demo data — fares, ETAs, and crowd signals are sample placeholders, not live provider APIs.
      </div>
      <header className="topbar">
        <button className="brand-button" type="button" onClick={() => onNavigate("/")}>
          <span className="brand-mark">CB</span>
          <span>
            <strong>Curbcue</strong>
            <small>Know the ride before you book</small>
          </span>
        </button>

        <div className="topbar-actions">
          <MarketModeBadge market={bermudaMarket} />
          <button className="account-button" type="button" onClick={() => onNavigate("/settings")}>
            Account
          </button>
        </div>
      </header>

      <AlertsStrip onOpenCrowdMeter={() => onNavigate("/crowd-meter")} />

      <nav className="main-nav" aria-label="Primary">
        {navItems.map((item) => (
          <button
            className={currentPath === item.href ? "active" : ""}
            aria-current={currentPath === item.href ? "page" : undefined}
            key={item.href}
            type="button"
            onClick={() => onNavigate(item.href)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <main>{children}</main>
      <footer className="site-footer">
        <span>Curbcue demo</span>
        <a
          href="/settings#privacy-support"
          onClick={(event: { preventDefault: () => void }) => {
            event.preventDefault();
            onNavigate("/settings#privacy-support");
          }}
        >
          Privacy and support
        </a>
      </footer>
      <OnboardingOverlay onNavigateCompare={() => onNavigate("/compare")} />
    </div>
  );
}
