"use client";

import * as React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { IssueDetailPanel } from "@/components/issues";
import { useUIStore, useWorkspaceStore } from "@/lib/store";
import { WorkspaceProvider } from "@/contexts/workspace-context";
import { AIChatPanel } from "@/components/ai/ai-chat-panel";
import { AICommandBar } from "@/components/ai/ai-command-bar";
import type { Workspace, Team, User } from "@/types";

interface WorkspaceLayoutClientProps {
  children: React.ReactNode;
  workspace: Workspace;
  teams: Team[];
  currentUser: User | null;
}

export function WorkspaceLayoutClient({
  children,
  workspace,
  teams,
  currentUser,
}: WorkspaceLayoutClientProps) {
  const {
    isIssuePanelOpen,
    isAIChatOpen,
    closeAIChat,
    isAICommandOpen,
    closeAICommand,
    openCreateIssue,
  } = useUIStore();
  const setCurrentWorkspace = useWorkspaceStore(
    (state) => state.setCurrentWorkspace
  );

  const setTeams = useWorkspaceStore((state) => state.setTeams);
  const setCurrentTeam = useWorkspaceStore((state) => state.setCurrentTeam);
  const setCurrentUser = useWorkspaceStore((state) => state.setCurrentUser);

  // Sync server data to client store on mount
  React.useEffect(() => {
    setCurrentWorkspace(workspace);
    setTeams(teams);
    setCurrentTeam(teams[0] || null);
    setCurrentUser(currentUser);
  }, [
    workspace,
    teams,
    currentUser,
    setCurrentWorkspace,
    setTeams,
    setCurrentTeam,
    setCurrentUser,
  ]);

  // Handle AI command execution
  const handleAICommandExecute = (
    action: string,
    params: Record<string, unknown>
  ) => {
    switch (action) {
      case "create_issue":
        openCreateIssue();
        break;
      case "navigate":
        // Handle navigation
        const destination = params.destination as string;
        if (destination) {
          window.location.href = `/${workspace.slug}/${destination}`;
        }
        break;
      // Add more action handlers as needed
      default:
        console.log("AI Command:", action, params);
    }
  };

  return (
    <WorkspaceProvider initialData={{ workspace, teams, currentUser }}>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <main className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-auto">{children}</div>
          {isIssuePanelOpen && <IssueDetailPanel />}
        </main>
      </div>

      {/* AI Components */}
      <AIChatPanel open={isAIChatOpen} onOpenChange={closeAIChat} />
      <AICommandBar
        open={isAICommandOpen}
        onOpenChange={closeAICommand}
        onExecuteAction={handleAICommandExecute}
      />
    </WorkspaceProvider>
  );
}
