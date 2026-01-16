"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  Circle,
  Inbox,
  Search,
  Settings,
  Plus,
  LayoutGrid,
  Layers,
  FolderKanban,
  Tags,
  Keyboard,
  RefreshCw,
  Eye,
  Home,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUIStore, useWorkspaceStore } from "@/lib/store";
import { CreateTeamModal } from "@/components/teams/create-team-modal";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
}

interface TeamNavItem extends NavItem {
  key: string;
  color?: string;
}

// Simplified main navigation
const mainNavItems: NavItem[] = [
  { title: "Home", href: "", icon: Home, shortcut: "G H" },
  { title: "Inbox", href: "/inbox", icon: Inbox, shortcut: "G I" },
  { title: "My Issues", href: "/my-issues", icon: Circle, shortcut: "G M" },
];

// Simplified workspace navigation - focused on essential features
const workspaceNavItems: NavItem[] = [
  { title: "Projects", href: "/projects", icon: FolderKanban, shortcut: "G P" },
  { title: "Views", href: "/views", icon: Eye },
  { title: "Labels", href: "/labels", icon: Tags },
];

export function Sidebar() {
  const pathname = usePathname();
  const {
    sidebar,
    toggleSidebar,
    openCommandPalette,
    openCreateIssue,
    openAIChat,
  } = useUIStore();
  const { currentWorkspace, teams } = useWorkspaceStore();
  const [expandedTeams, setExpandedTeams] = React.useState<string[]>([]);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = React.useState(false);

  const workspaceSlug = currentWorkspace?.slug || "workspace";
  const workspaceName = currentWorkspace?.name || "Workspace";
  const basePath = `/${workspaceSlug}`;

  // Expand first team by default
  React.useEffect(() => {
    if (teams.length > 0 && expandedTeams.length === 0) {
      setExpandedTeams([teams[0].key]);
    }
  }, [teams, expandedTeams.length]);

  // Convert teams to nav items
  const teamNavItems: TeamNavItem[] = teams.map((team) => ({
    title: team.name,
    href: `/team/${team.key}`,
    icon: Circle,
    key: team.key,
    color: team.color || "#6366f1",
  }));

  const toggleTeam = (teamKey: string) => {
    setExpandedTeams((prev) =>
      prev.includes(teamKey)
        ? prev.filter((k) => k !== teamKey)
        : [...prev, teamKey]
    );
  };

  if (sidebar.isCollapsed) {
    return (
      <div className="flex h-full w-12 flex-col border-r bg-background">
        <div className="flex h-12 items-center justify-center border-b">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="flex flex-col items-center gap-1 p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => openCommandPalette("search")}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Search</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={openCreateIssue}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Create Issue</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={openAIChat}
                  className="text-violet-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950"
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">AI Assistant</TooltipContent>
            </Tooltip>
            <Separator className="my-2" />
            {mainNavItems.map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link href={`${basePath}${item.href}`}>
                    <Button
                      variant={
                        pathname.includes(item.href) ? "secondary" : "ghost"
                      }
                      size="icon-sm"
                    >
                      <item.icon className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.title}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex h-full w-56 flex-col border-r bg-background">
      {/* Header with Workspace Name */}
      <div className="flex h-12 items-center justify-between border-b px-3">
        <Link
          href={basePath}
          className="flex items-center gap-2 font-semibold text-sm truncate"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-bold flex-shrink-0">
            {workspaceName.charAt(0).toUpperCase()}
          </div>
          <span className="truncate">{workspaceName}</span>
        </Link>
        <Button variant="ghost" size="icon-sm" onClick={toggleSidebar}>
          <ChevronDown className="h-4 w-4 rotate-90" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* Search */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground mb-1"
            onClick={() => openCommandPalette("search")}
          >
            <Search className="h-4 w-4" />
            <span className="text-sm">Search</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </Button>

          {/* Create Issue */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground mb-1"
            onClick={openCreateIssue}
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm">New Issue</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              C
            </kbd>
          </Button>

          {/* AI Assistant */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-violet-600 hover:text-violet-700 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-950 mb-2"
            onClick={openAIChat}
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm">AI Assistant</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ⌘/
            </kbd>
          </Button>

          <Separator className="my-2" />

          {/* Main Navigation */}
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const href = `${basePath}${item.href}`;
              const isActive =
                item.href === ""
                  ? pathname === basePath
                  : pathname.includes(item.href);
              return (
                <Link key={item.title} href={href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                    size="sm"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>

          <Separator className="my-2" />

          {/* Teams */}
          <div className="mb-2">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-xs font-medium text-muted-foreground">
                Your Teams
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-5 w-5"
                onClick={() => setIsCreateTeamOpen(true)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <nav className="space-y-0.5">
              {teamNavItems.map((team) => (
                <div key={team.key}>
                  <Button
                    variant={
                      pathname.includes(`/team/${team.key}`)
                        ? "secondary"
                        : "ghost"
                    }
                    className="w-full justify-start gap-2"
                    size="sm"
                    onClick={() => toggleTeam(team.key)}
                  >
                    <ChevronRight
                      className={cn(
                        "h-3 w-3 transition-transform",
                        expandedTeams.includes(team.key) && "rotate-90"
                      )}
                    />
                    <span
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: team.color }}
                    />
                    <span className="truncate">{team.title}</span>
                  </Button>
                  {expandedTeams.includes(team.key) && (
                    <div className="ml-4 space-y-0.5 mt-0.5">
                      <Link href={`${basePath}/team/${team.key}`}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2 h-7 text-xs"
                          size="sm"
                        >
                          <Circle className="h-3 w-3" />
                          Issues
                        </Button>
                      </Link>
                      <Link href={`${basePath}/team/${team.key}/backlog`}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2 h-7 text-xs"
                          size="sm"
                        >
                          <Layers className="h-3 w-3" />
                          Backlog
                        </Button>
                      </Link>
                      <Link href={`${basePath}/team/${team.key}/board`}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2 h-7 text-xs"
                          size="sm"
                        >
                          <LayoutGrid className="h-3 w-3" />
                          Board
                        </Button>
                      </Link>
                      <Link href={`${basePath}/team/${team.key}/cycles`}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2 h-7 text-xs"
                          size="sm"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Cycles
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              ))}
              {teamNavItems.length === 0 && (
                <div className="text-xs text-muted-foreground px-2 py-4 text-center">
                  <p>No teams yet</p>
                  <p className="text-[10px] mt-1">Create one to get started</p>
                </div>
              )}
            </nav>
          </div>

          <Separator className="my-2" />

          {/* Workspace Navigation */}
          <nav className="space-y-1">
            {workspaceNavItems.map((item) => (
              <Link key={item.href} href={`${basePath}${item.href}`}>
                <Button
                  variant={pathname.includes(item.href) ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                  size="sm"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-2 space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          size="sm"
          onClick={() => openCommandPalette()}
        >
          <Keyboard className="h-4 w-4" />
          <span>Shortcuts</span>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ?
          </kbd>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          size="sm"
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Button>
      </div>

      {/* Create Team Modal */}
      <CreateTeamModal
        open={isCreateTeamOpen}
        onOpenChange={setIsCreateTeamOpen}
      />
    </div>
  );
}
