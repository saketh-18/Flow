import { create } from "zustand";
import type { Workspace, Team, User } from "@/types";

interface WorkspaceStore {
  // Current workspace
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (workspace: Workspace | null) => void;

  // Current team
  currentTeam: Team | null;
  setCurrentTeam: (team: Team | null) => void;

  // Current user
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  // Workspaces list
  workspaces: Workspace[];
  setWorkspaces: (workspaces: Workspace[]) => void;

  // Teams list
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  addTeam: (team: Team) => void;

  // Team members
  teamMembers: User[];
  setTeamMembers: (members: User[]) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  currentWorkspace: null,
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),

  currentTeam: null,
  setCurrentTeam: (team) => set({ currentTeam: team }),

  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),

  workspaces: [],
  setWorkspaces: (workspaces) => set({ workspaces }),

  teams: [],
  setTeams: (teams) => set({ teams }),
  addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),

  teamMembers: [],
  setTeamMembers: (members) => set({ teamMembers: members }),
}));
