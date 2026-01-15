import * as React from "react";
import { cn } from "@/lib/utils";

interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Kbd({ className, children, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        "pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}

// Helper to display keyboard shortcuts
export function formatShortcut(shortcut: string): React.ReactNode {
  const isMac =
    typeof window !== "undefined" &&
    navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  const parts = shortcut.split("+").map((part) => {
    switch (part.toLowerCase()) {
      case "mod":
      case "meta":
        return isMac ? "⌘" : "Ctrl";
      case "ctrl":
        return isMac ? "⌃" : "Ctrl";
      case "alt":
        return isMac ? "⌥" : "Alt";
      case "shift":
        return "⇧";
      case "enter":
        return "↵";
      case "escape":
      case "esc":
        return "Esc";
      case "space":
        return "␣";
      case "backspace":
        return "⌫";
      case "delete":
        return "⌦";
      case "up":
        return "↑";
      case "down":
        return "↓";
      case "left":
        return "←";
      case "right":
        return "→";
      default:
        return part.toUpperCase();
    }
  });

  return parts.map((part, i) => (
    <React.Fragment key={i}>
      {i > 0 && <span className="text-muted-foreground/50">+</span>}
      <span>{part}</span>
    </React.Fragment>
  ));
}

export function KeyboardShortcut({
  shortcut,
  className,
}: {
  shortcut: string;
  className?: string;
}) {
  return <Kbd className={className}>{formatShortcut(shortcut)}</Kbd>;
}
