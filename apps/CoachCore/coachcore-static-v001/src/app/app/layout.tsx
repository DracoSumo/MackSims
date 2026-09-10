import { AuthGate } from "@/components/auth/AuthGate";

export default function AppSectionLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
