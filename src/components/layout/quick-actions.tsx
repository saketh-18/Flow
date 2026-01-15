"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Inbox,
  LayoutList,
  Clock,
  Calendar,
  FolderKanban,
  Users,
  Settings,
  Keyboard,
  ArrowRight,
} from "lucide-react";

interface QuickAction {
  icon: React.ElementType;
  label: string;
  description: string;
  shortcut?: string;
  onClick: () => void;
}

interface QuickActionsProps {
  onCreateIssue: () => void;
  onOpenSearch: () => void;
  onViewMyIssues: () => void;
  onViewInbox?: () => void;
}

export function QuickActions({
  onCreateIssue,
  onOpenSearch,
  onViewMyIssues,
  onViewInbox,
}: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      icon: Plus,
      label: "Create issue",
      description: "Start tracking a new task or bug",
      shortcut: "C",
      onClick: onCreateIssue,
    },
    {
      icon: Search,
      label: "Search",
      description: "Find issues, projects, or anything",
      shortcut: "⌘K",
      onClick: onOpenSearch,
    },
    {
      icon: Inbox,
      label: "Inbox",
      description: "View notifications and updates",
      onClick: onViewInbox || (() => {}),
    },
    {
      icon: LayoutList,
      label: "My issues",
      description: "View issues assigned to you",
      onClick: onViewMyIssues,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          className="group relative flex flex-col p-4 rounded-xl border bg-card hover:bg-accent/50 hover:border-accent transition-all text-left"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <action.icon className="h-5 w-5" />
            </div>
            {action.shortcut && (
              <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border text-muted-foreground">
                {action.shortcut}
              </kbd>
            )}
          </div>
          <h3 className="font-medium text-sm mb-1">{action.label}</h3>
          <p className="text-xs text-muted-foreground">{action.description}</p>
          <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      ))}
    </div>
  );
}

interface RecentItem {
  id: string;
  type: "issue" | "project" | "cycle";
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  color?: string;
  onClick: () => void;
}

interface RecentActivityProps {
  items: RecentItem[];
}

export function RecentActivity({ items }: RecentActivityProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={item.onClick}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors text-left group"
        >
          <div
            className="p-1.5 rounded"
            style={{
              backgroundColor: item.color ? `${item.color}20` : undefined,
            }}
          >
            {item.icon ? (
              <item.icon
                className="h-4 w-4"
                style={{ color: item.color || undefined }}
              />
            ) : (
              <LayoutList className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{item.title}</p>
            {item.subtitle && (
              <p className="text-xs text-muted-foreground truncate">
                {item.subtitle}
              </p>
            )}
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      ))}
    </div>
  );
}

interface UpcomingItem {
  id: string;
  title: string;
  dueDate: string;
  type: "issue" | "cycle";
  priority?: string;
  onClick: () => void;
}

interface UpcomingDueProps {
  items: UpcomingItem[];
}

export function UpcomingDue({ items }: UpcomingDueProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Nothing due soon</p>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-1">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={item.onClick}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors text-left group"
        >
          <div className="p-1.5 rounded bg-orange-500/10">
            <Calendar className="h-4 w-4 text-orange-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{item.title}</p>
            <p className="text-xs text-muted-foreground">
              Due {formatDate(item.dueDate)}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}

interface TeamOverviewProps {
  teams: {
    id: string;
    name: string;
    key: string;
    issueCount: number;
    memberCount: number;
    onClick: () => void;
  }[];
}

export function TeamOverview({ teams }: TeamOverviewProps) {
  if (teams.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No teams yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {teams.map((team) => (
        <button
          key={team.id}
          onClick={team.onClick}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors text-left group"
        >
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
            {team.key.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{team.name}</p>
            <p className="text-xs text-muted-foreground">
              {team.issueCount} issues · {team.memberCount} members
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      ))}
    </div>
  );
}
