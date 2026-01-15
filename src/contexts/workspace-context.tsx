"use client";

import * as React from "react";
import type { Workspace, Team, User, WorkflowState } from "@/types";

interface WorkspaceContextType {
  workspace: Workspace | null;
  teams: Team[];
  currentTeam: Team | null;
  currentUser: User | null;
  workflowStates: WorkflowState[];
  teamMembers: User[];
  setCurrentTeam: (team: Team | null) => void;
  refreshWorkspace: () => void;
}

const WorkspaceContext = React.createContext<WorkspaceContextType | null>(null);

interface WorkspaceProviderProps {
  children: React.ReactNode;
  initialData: {
    workspace: Workspace | null;
    teams: Team[];
    currentUser: User | null;
  };
}

export function WorkspaceProvider({
  children,
  initialData,
}: WorkspaceProviderProps) {
  const [workspace] = React.useState(initialData.workspace);
  const [teams] = React.useState(initialData.teams);
  const [currentUser] = React.useState(initialData.currentUser);
  const [currentTeam, setCurrentTeam] = React.useState<Team | null>(
    initialData.teams[0] || null
  );
  const [workflowStates, setWorkflowStates] = React.useState<WorkflowState[]>(
    []
  );
  const [teamMembers, setTeamMembers] = React.useState<User[]>([]);

  const refreshWorkspace = React.useCallback(() => {
    // Trigger a refresh of workspace data
  }, []);

  // Fetch workflow states when team changes
  React.useEffect(() => {
    if (!currentTeam) return;

    const fetchTeamData = async () => {
      try {
        const [statesRes, membersRes] = await Promise.all([
          fetch(`/api/teams/${currentTeam.id}/workflow-states`),
          fetch(`/api/teams/${currentTeam.id}/members`),
        ]);

        if (statesRes.ok) {
          const states = await statesRes.json();
          setWorkflowStates(states);
        }

        if (membersRes.ok) {
          const members = await membersRes.json();
          setTeamMembers(members);
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };

    fetchTeamData();
  }, [currentTeam]);

  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        teams,
        currentTeam,
        currentUser,
        workflowStates,
        teamMembers,
        setCurrentTeam,
        refreshWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = React.useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
