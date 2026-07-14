import { AuthGate } from "@/components/auth/AuthGate";

export default function AppAreaLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
