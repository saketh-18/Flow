import { createClient } from "@/lib/supabase/server";
import type {
  Workspace,
  Team,
  User,
  WorkflowState,
  Project,
  Cycle,
} from "@/types";

export async function getWorkspaceBySlug(
  slug: string
): Promise<Workspace | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching workspace:", error);
    return null;
  }

  return data;
}

export async function getWorkspaceTeams(workspaceId: string): Promise<Team[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("name");

  if (error) {
    console.error("Error fetching teams:", error);
    return [];
  }

  return data || [];
}

export async function getTeamByKey(
  workspaceId: string,
  teamKey: string
): Promise<Team | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("key", teamKey.toUpperCase())
    .single();

  if (error) {
    console.error("Error fetching team:", error);
    return null;
  }

  return data;
}

export async function getTeamWorkflowStates(
  teamId: string
): Promise<WorkflowState[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("workflow_states")
    .select("*")
    .eq("team_id", teamId)
    .order("position");

  if (error) {
    console.error("Error fetching workflow states:", error);
    return [];
  }

  return data || [];
}

export async function getTeamMembers(teamId: string): Promise<User[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("team_members")
    .select("user:users(*)")
    .eq("team_id", teamId);

  if (error) {
    console.error("Error fetching team members:", error);
    return [];
  }

  return ((data as any)?.map((tm: any) => tm.user) || []) as User[];
}

export async function getWorkspaceMembers(
  workspaceId: string
): Promise<User[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("workspace_members")
    .select("user:users(*)")
    .eq("workspace_id", workspaceId);

  if (error) {
    console.error("Error fetching workspace members:", error);
    return [];
  }

  return ((data as any)?.map((wm: any) => wm.user) || []) as User[];
}

export async function getTeamProjects(teamId: string): Promise<Project[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("team_id", teamId)
    .order("sort_order");

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return data || [];
}

export async function getTeamCycles(teamId: string): Promise<Cycle[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cycles")
    .select("*")
    .eq("team_id", teamId)
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Error fetching cycles:", error);
    return [];
  }

  return data || [];
}

export async function getTeamLabels(teamId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("labels")
    .select("*")
    .eq("team_id", teamId)
    .order("name");

  if (error) {
    console.error("Error fetching labels:", error);
    return [];
  }

  return data || [];
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  return data;
}
