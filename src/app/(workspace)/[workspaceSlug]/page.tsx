"use client";

import * as React from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Users,
  FolderKanban,
  Tags,
  ArrowRight,
  Keyboard,
  Search,
  LayoutGrid,
} from "lucide-react";
import Link from "next/link";
import { useUIStore, useWorkspaceStore } from "@/lib/store";
import { CreateTeamModal } from "@/components/teams/create-team-modal";
import { CreateProjectModal } from "@/components/projects/create-project-modal";
import { CreateLabelModal } from "@/components/labels/create-label-modal";

const keyboardShortcuts = [
  { key: "C", description: "Create new issue" },
  { key: "⌘K", description: "Open command palette" },
  { key: "G then I", description: "Go to Inbox" },
  { key: "G then M", description: "Go to My Issues" },
  { key: "?", description: "Show all shortcuts" },
];

export default function WorkspaceHomePage() {
  const { openCreateIssue, openCommandPalette } = useUIStore();
  const { currentWorkspace, teams } = useWorkspaceStore();
  const [isCreateTeamOpen, setIsCreateTeamOpen] = React.useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = React.useState(false);
  const [isCreateLabelOpen, setIsCreateLabelOpen] = React.useState(false);

  const workspaceSlug = currentWorkspace?.slug || "workspace";

  return (
    <div className="flex flex-col h-full">
      <Header title="Home" showViewSwitcher={false} />

      <ScrollArea className="flex-1">
        <div className="p-6 max-w-4xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="text-center py-8">
            <h1 className="text-3xl font-bold mb-3">
              Welcome to {currentWorkspace?.name || "Flow"}
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Your workspace for tracking issues, managing projects, and
              collaborating with your team.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={openCreateIssue}
              className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors text-left group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold mb-1">Create Issue</h3>
              <p className="text-sm text-muted-foreground">
                Track a bug, feature, or task
              </p>
            </button>

            <button
              onClick={() => setIsCreateTeamOpen(true)}
              className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors text-left group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <h3 className="font-semibold mb-1">Create Team</h3>
              <p className="text-sm text-muted-foreground">
                Organize work by department
              </p>
            </button>

            <button
              onClick={() => setIsCreateProjectOpen(true)}
              className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors text-left group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <FolderKanban className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <h3 className="font-semibold mb-1">Create Project</h3>
              <p className="text-sm text-muted-foreground">
                Group related issues together
              </p>
            </button>

            <button
              onClick={() => setIsCreateLabelOpen(true)}
              className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors text-left group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Tags className="h-5 w-5 text-purple-500" />
                </div>
              </div>
              <h3 className="font-semibold mb-1">Create Label</h3>
              <p className="text-sm text-muted-foreground">
                Categorize your issues
              </p>
            </button>
          </div>

          {/* Teams Section */}
          {teams.length > 0 && (
            <div className="rounded-lg border bg-card">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-semibold">Your Teams</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCreateTeamOpen(true)}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add team
                </Button>
              </div>
              <div className="divide-y">
                {teams.map((team) => (
                  <Link
                    key={team.id}
                    href={`/${workspaceSlug}/team/${team.key.toLowerCase()}`}
                    className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-8 w-8 rounded flex items-center justify-center text-white text-sm font-medium"
                        style={{ backgroundColor: team.color || "#6366f1" }}
                      >
                        {team.key.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium">{team.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {team.key}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Getting Started - Show when no teams */}
          {teams.length === 0 && (
            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Get started with teams</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                Teams help you organize your work. Create your first team to
                start tracking issues.
              </p>
              <Button onClick={() => setIsCreateTeamOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create your first team
              </Button>
            </div>
          )}

          {/* Keyboard Shortcuts */}
          <div className="rounded-lg border bg-card">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Keyboard className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-semibold">Keyboard Shortcuts</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openCommandPalette()}
              >
                View all
              </Button>
            </div>
            <div className="p-4">
              <div className="grid sm:grid-cols-2 gap-3">
                {keyboardShortcuts.map((shortcut) => (
                  <div
                    key={shortcut.key}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-muted-foreground">
                      {shortcut.description}
                    </span>
                    <kbd className="px-2 py-1 rounded border bg-muted font-mono text-xs">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Hints */}
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => openCommandPalette("search")}
              className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors text-left"
            >
              <Search className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Search anything</p>
                <p className="text-sm text-muted-foreground">
                  Press ⌘K to search issues, projects, and more
                </p>
              </div>
            </button>

            <Link
              href={`/${workspaceSlug}/settings`}
              className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <LayoutGrid className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Customize workspace</p>
                <p className="text-sm text-muted-foreground">
                  Configure settings and preferences
                </p>
              </div>
            </Link>
          </div>
        </div>
      </ScrollArea>

      {/* Modals */}
      <CreateTeamModal
        open={isCreateTeamOpen}
        onOpenChange={setIsCreateTeamOpen}
      />
      <CreateProjectModal
        open={isCreateProjectOpen}
        onOpenChange={setIsCreateProjectOpen}
      />
      <CreateLabelModal
        open={isCreateLabelOpen}
        onOpenChange={setIsCreateLabelOpen}
      />
    </div>
  );
}
