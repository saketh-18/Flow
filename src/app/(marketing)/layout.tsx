import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flow - Issue tracking, streamlined",
  description:
    "Flow is the issue tracking tool you'll enjoy using. Designed for high-performance teams who demand speed, simplicity, and powerful workflows.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
