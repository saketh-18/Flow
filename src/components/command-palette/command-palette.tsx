"use client";

import * as React from "react";
import { Command } from "cmdk";
import {
  Circle,
  FileText,
  FolderKanban,
  Hash,
  Inbox,
  LayoutGrid,
  Plus,
  Search,
  Settings,
  Sparkles,
  Timer,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useUIStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  action?: () => void;
  href?: string;
  group: string;
}

export function CommandPalette() {
  const router = useRouter();
  const { commandPalette, closeCommandPalette, openCreateIssue } = useUIStore();
  const [search, setSearch] = React.useState("");

  // Define command items
  const commands: CommandItem[] = React.useMemo(
    () => [
      // Actions
      {
        id: "create-issue",
        title: "Create new issue",
        icon: Plus,
        shortcut: "C",
        action: () => {
          closeCommandPalette();
          openCreateIssue();
        },
        group: "Actions",
      },
      {
        id: "ai-assist",
        title: "Ask AI assistant",
        icon: Sparkles,
        shortcut: "⌘ /",
        action: () => {
          closeCommandPalette();
          // Will open AI chat
        },
        group: "Actions",
      },

      // Navigation
      {
        id: "nav-inbox",
        title: "Go to Inbox",
        icon: Inbox,
        shortcut: "G I",
        href: "/flow/inbox",
        group: "Navigation",
      },
      {
        id: "nav-my-issues",
        title: "Go to My Issues",
        icon: Circle,
        shortcut: "G M",
        href: "/flow/my-issues",
        group: "Navigation",
      },
      {
        id: "nav-projects",
        title: "Go to Projects",
        icon: FolderKanban,
        shortcut: "G P",
        href: "/flow/projects",
        group: "Navigation",
      },
      {
        id: "nav-board",
        title: "Go to Board View",
        icon: LayoutGrid,
        shortcut: "G B",
        href: "/flow/team/ENG/board",
        group: "Navigation",
      },
      {
        id: "nav-cycles",
        title: "Go to Cycles",
        icon: Timer,
        shortcut: "G C",
        href: "/flow/team/ENG/cycles",
        group: "Navigation",
      },
      {
        id: "nav-settings",
        title: "Go to Settings",
        icon: Settings,
        shortcut: "G S",
        href: "/flow/settings",
        group: "Navigation",
      },

      // Teams
      {
        id: "team-eng",
        title: "Engineering",
        icon: Hash,
        href: "/flow/team/ENG",
        group: "Teams",
      },
      {
        id: "team-des",
        title: "Design",
        icon: Hash,
        href: "/flow/team/DES",
        group: "Teams",
      },
      {
        id: "team-prd",
        title: "Product",
        icon: Hash,
        href: "/flow/team/PRD",
        group: "Teams",
      },
    ],
    [closeCommandPalette, openCreateIssue]
  );

  const handleSelect = (item: CommandItem) => {
    if (item.action) {
      item.action();
    } else if (item.href) {
      router.push(item.href);
      closeCommandPalette();
    }
  };

  // Group commands
  const groupedCommands = React.useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    for (const cmd of commands) {
      if (!groups[cmd.group]) {
        groups[cmd.group] = [];
      }
      groups[cmd.group].push(cmd);
    }
    return groups;
  }, [commands]);

  return (
    <Dialog open={commandPalette.isOpen} onOpenChange={closeCommandPalette}>
      <DialogContent className="overflow-hidden p-0 shadow-lg max-w-[640px]">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-4 [&_[cmdk-item]_svg]:w-4">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Type a command or search..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-[400px] overflow-y-auto overflow-x-hidden p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            {Object.entries(groupedCommands).map(([group, items]) => (
              <Command.Group key={group} heading={group}>
                {items.map((item) => (
                  <Command.Item
                    key={item.id}
                    value={item.title}
                    onSelect={() => handleSelect(item)}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                    {item.shortcut && (
                      <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                        {item.shortcut}
                      </kbd>
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
