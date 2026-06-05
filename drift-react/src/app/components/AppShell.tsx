import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div
      className="min-h-[100dvh] flex justify-center"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <div className="w-full max-w-[420px] min-h-[100dvh] relative">{children}</div>
    </div>
  );
}
