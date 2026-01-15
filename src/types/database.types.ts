// Generated types for Supabase - Update after running schema
// Run: npx supabase gen types typescript --local > src/types/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type IssuePriority = "urgent" | "high" | "medium" | "low" | "none";

export type WorkflowStateType =
  | "backlog"
  | "unstarted"
  | "started"
  | "completed"
  | "canceled";

export type ProjectStatus =
  | "planned"
  | "in_progress"
  | "paused"
  | "completed"
  | "canceled";

export type MemberRole = "admin" | "member" | "guest";

export type IssueRelationType =
  | "blocks"
  | "blocked_by"
  | "related"
  | "duplicate";

export interface Database {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
      };
      teams: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          key: string;
          icon: string | null;
          color: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          key: string;
          icon?: string | null;
          color?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          name?: string;
          key?: string;
          icon?: string | null;
          color?: string | null;
          created_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      workspace_members: {
        Row: {
          workspace_id: string;
          user_id: string;
          role: MemberRole;
        };
        Insert: {
          workspace_id: string;
          user_id: string;
          role?: MemberRole;
        };
        Update: {
          workspace_id?: string;
          user_id?: string;
          role?: MemberRole;
        };
      };
      team_members: {
        Row: {
          team_id: string;
          user_id: string;
        };
        Insert: {
          team_id: string;
          user_id: string;
        };
        Update: {
          team_id?: string;
          user_id?: string;
        };
      };
      workflow_states: {
        Row: {
          id: string;
          team_id: string;
          name: string;
          type: WorkflowStateType;
          color: string | null;
          position: number;
        };
        Insert: {
          id?: string;
          team_id: string;
          name: string;
          type: WorkflowStateType;
          color?: string | null;
          position: number;
        };
        Update: {
          id?: string;
          team_id?: string;
          name?: string;
          type?: WorkflowStateType;
          color?: string | null;
          position?: number;
        };
      };
      labels: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          color: string;
          description: string | null;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          color: string;
          description?: string | null;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          name?: string;
          color?: string;
          description?: string | null;
        };
      };
      projects: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          description: string | null;
          icon: string | null;
          color: string | null;
          status: ProjectStatus;
          target_date: string | null;
          lead_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          status?: ProjectStatus;
          target_date?: string | null;
          lead_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          status?: ProjectStatus;
          target_date?: string | null;
          lead_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      cycles: {
        Row: {
          id: string;
          team_id: string;
          number: number;
          name: string | null;
          starts_at: string;
          ends_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          number: number;
          name?: string | null;
          starts_at: string;
          ends_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          number?: number;
          name?: string | null;
          starts_at?: string;
          ends_at?: string;
          created_at?: string;
        };
      };
      issues: {
        Row: {
          id: string;
          team_id: string;
          number: number;
          title: string;
          description: Json | null;
          priority: IssuePriority;
          state_id: string | null;
          assignee_id: string | null;
          creator_id: string;
          project_id: string | null;
          cycle_id: string | null;
          parent_id: string | null;
          estimate: number | null;
          due_date: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          number: number;
          title: string;
          description?: Json | null;
          priority?: IssuePriority;
          state_id?: string | null;
          assignee_id?: string | null;
          creator_id: string;
          project_id?: string | null;
          cycle_id?: string | null;
          parent_id?: string | null;
          estimate?: number | null;
          due_date?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          number?: number;
          title?: string;
          description?: Json | null;
          priority?: IssuePriority;
          state_id?: string | null;
          assignee_id?: string | null;
          creator_id?: string;
          project_id?: string | null;
          cycle_id?: string | null;
          parent_id?: string | null;
          estimate?: number | null;
          due_date?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      issue_labels: {
        Row: {
          issue_id: string;
          label_id: string;
        };
        Insert: {
          issue_id: string;
          label_id: string;
        };
        Update: {
          issue_id?: string;
          label_id?: string;
        };
      };
      issue_relations: {
        Row: {
          id: string;
          issue_id: string;
          related_issue_id: string;
          type: IssueRelationType;
        };
        Insert: {
          id?: string;
          issue_id: string;
          related_issue_id: string;
          type: IssueRelationType;
        };
        Update: {
          id?: string;
          issue_id?: string;
          related_issue_id?: string;
          type?: IssueRelationType;
        };
      };
      comments: {
        Row: {
          id: string;
          issue_id: string;
          user_id: string;
          body: Json;
          parent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          issue_id: string;
          user_id: string;
          body: Json;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          issue_id?: string;
          user_id?: string;
          body?: Json;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      views: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string | null;
          name: string;
          filters: Json;
          display_options: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          user_id?: string | null;
          name: string;
          filters: Json;
          display_options?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          user_id?: string | null;
          name?: string;
          filters?: Json;
          display_options?: Json | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      issue_priority: IssuePriority;
      workflow_state_type: WorkflowStateType;
      project_status: ProjectStatus;
      member_role: MemberRole;
      issue_relation_type: IssueRelationType;
    };
  };
}

// Convenience types
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// Entity types
export type Workspace = Tables<"workspaces">;
export type Team = Tables<"teams">;
export type User = Tables<"users">;
export type WorkflowState = Tables<"workflow_states">;
export type Label = Tables<"labels">;
export type Project = Tables<"projects">;
export type Cycle = Tables<"cycles">;
export type Issue = Tables<"issues">;
export type Comment = Tables<"comments">;
export type View = Tables<"views">;

// Extended types with relations
export type IssueWithRelations = Issue & {
  state?: WorkflowState;
  assignee?: User;
  creator?: User;
  project?: Project;
  cycle?: Cycle;
  labels?: Label[];
  team?: Team;
};

export type TeamWithRelations = Team & {
  workflow_states?: WorkflowState[];
  members?: User[];
};

export type ProjectWithRelations = Project & {
  lead?: User;
  issues?: Issue[];
};
