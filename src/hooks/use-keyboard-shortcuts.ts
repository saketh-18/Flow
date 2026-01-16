"use client";

import * as React from "react";
import { useCallback, useEffect } from "react";
import { useUIStore } from "@/lib/store";

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description?: string;
  scope?: "global" | "issues" | "editor";
}

export function useKeyboardShortcuts(customShortcuts?: KeyboardShortcut[]) {
  const {
    openCommandPalette,
    closeCommandPalette,
    openCreateIssue,
    closeCreateIssue,
    openAIChat,
    closeAIChat,
    openAICommand,
    closeAICommand,
    commandPalette,
    isCreateIssueOpen,
    isAIChatOpen,
    isAICommandOpen,
  } = useUIStore();

  // Track key sequence for multi-key shortcuts (e.g., "G I")
  const [keySequence, setKeySequence] = React.useState<string[]>([]);
  const sequenceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const defaultShortcuts: KeyboardShortcut[] = [
    // Command palette
    {
      key: "k",
      meta: true,
      action: () => openCommandPalette(),
      description: "Open command palette",
      scope: "global",
    },
    {
      key: "k",
      ctrl: true,
      action: () => openCommandPalette(),
      description: "Open command palette",
      scope: "global",
    },

    // Create issue
    {
      key: "c",
      action: () => openCreateIssue(),
      description: "Create new issue",
      scope: "global",
    },

    // Escape
    {
      key: "Escape",
      action: () => {
        if (commandPalette.isOpen) {
          closeCommandPalette();
        } else if (isCreateIssueOpen) {
          closeCreateIssue();
        } else if (isAIChatOpen) {
          closeAIChat();
        } else if (isAICommandOpen) {
          closeAICommand();
        }
      },
      description: "Close modal/panel",
      scope: "global",
    },

    // AI Chat (Cmd/Ctrl + /)
    {
      key: "/",
      meta: true,
      action: () => openAIChat(),
      description: "Open AI chat",
      scope: "global",
    },
    {
      key: "/",
      ctrl: true,
      action: () => openAIChat(),
      description: "Open AI chat",
      scope: "global",
    },

    // AI Command (Cmd/Ctrl + J)
    {
      key: "j",
      meta: true,
      action: () => openAICommand(),
      description: "Open AI command bar",
      scope: "global",
    },
    {
      key: "j",
      ctrl: true,
      action: () => openAICommand(),
      description: "Open AI command bar",
      scope: "global",
    },

    // Search
    {
      key: "/",
      action: () => openCommandPalette("search"),
      description: "Search",
      scope: "global",
    },
  ];

  const shortcuts = [...defaultShortcuts, ...(customShortcuts || [])];

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // Allow escape even in inputs
      if (event.key !== "Escape" && isInput) {
        return;
      }

      // Handle multi-key sequences
      const key = event.key.toLowerCase();

      // Check for modifier-based shortcuts first
      for (const shortcut of shortcuts) {
        const metaMatch = shortcut.meta
          ? event.metaKey
          : shortcut.ctrl
          ? event.ctrlKey
          : !event.metaKey && !event.ctrlKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;

        if (
          shortcut.key.toLowerCase() === key &&
          metaMatch &&
          shiftMatch &&
          altMatch &&
          (shortcut.meta || shortcut.ctrl)
        ) {
          event.preventDefault();
          shortcut.action();
          return;
        }
      }

      // Handle single key and sequence shortcuts (only when no modifiers except shift)
      if (!event.metaKey && !event.ctrlKey && !event.altKey) {
        // Add to sequence
        setKeySequence((prev) => {
          const newSequence = [...prev, key];

          // Clear previous timeout
          if (sequenceTimeoutRef.current) {
            clearTimeout(sequenceTimeoutRef.current);
          }

          // Set new timeout to clear sequence
          sequenceTimeoutRef.current = setTimeout(() => {
            setKeySequence([]);
          }, 500);

          // Check for sequence matches (e.g., "g i" for Go to Inbox)
          const sequenceStr = newSequence.join(" ");

          // Navigation sequences
          if (sequenceStr === "g i") {
            window.location.href = "/flow/inbox";
            return [];
          }
          if (sequenceStr === "g m") {
            window.location.href = "/flow/my-issues";
            return [];
          }
          if (sequenceStr === "g p") {
            window.location.href = "/flow/projects";
            return [];
          }
          if (sequenceStr === "g b") {
            window.location.href = "/flow/team/ENG/board";
            return [];
          }

          return newSequence;
        });

        // Check single-key shortcuts
        for (const shortcut of shortcuts) {
          if (
            shortcut.key.toLowerCase() === key &&
            !shortcut.meta &&
            !shortcut.ctrl &&
            !shortcut.alt
          ) {
            const shiftMatch = shortcut.shift
              ? event.shiftKey
              : !event.shiftKey;
            if (shiftMatch) {
              event.preventDefault();
              shortcut.action();
              return;
            }
          }
        }
      }
    },
    [
      shortcuts,
      commandPalette.isOpen,
      isCreateIssueOpen,
      isAIChatOpen,
      isAICommandOpen,
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (sequenceTimeoutRef.current) {
        clearTimeout(sequenceTimeoutRef.current);
      }
    };
  }, [handleKeyDown]);

  return { keySequence };
}
