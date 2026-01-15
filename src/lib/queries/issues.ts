import { createClient } from "@/lib/supabase/server";
import type { IssueWithRelations } from "@/types";

export async function getTeamIssues(
  teamId: string
): Promise<IssueWithRelations[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("issues")
    .select(
      `
      *,
      state:workflow_states(*),
      assignee:users(*),
      creator:users!issues_creator_id_fkey(*),
      team:teams(*),
      project:projects(*),
      labels:issue_labels(label:labels(*))
    `
    )
    .eq("team_id", teamId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching issues:", error);
    return [];
  }

  return (data || []) as IssueWithRelations[];
}

export async function getMyIssues(
  userId: string
): Promise<IssueWithRelations[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("issues")
    .select(
      `
      *,
      state:workflow_states(*),
      assignee:users(*),
      creator:users!issues_creator_id_fkey(*),
      team:teams(*),
      project:projects(*)
    `
    )
    .eq("assignee_id", userId)
    .not("state.type", "in", '("completed","canceled")')
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching my issues:", error);
    return [];
  }

  return (data || []) as IssueWithRelations[];
}

export async function getIssueById(
  issueId: string
): Promise<IssueWithRelations | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("issues")
    .select(
      `
      *,
      state:workflow_states(*),
      assignee:users(*),
      creator:users!issues_creator_id_fkey(*),
      team:teams(*),
      project:projects(*),
      labels:issue_labels(label:labels(*)),
      comments(*, user:users(*)),
      children:issues!issues_parent_id_fkey(id, title, number, state:workflow_states(*))
    `
    )
    .eq("id", issueId)
    .single();

  if (error) {
    console.error("Error fetching issue:", error);
    return null;
  }

  return data as IssueWithRelations;
}

export async function getIssueHistory(issueId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("issue_history")
    .select(
      `
      *,
      user:users(*)
    `
    )
    .eq("issue_id", issueId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching issue history:", error);
    return [];
  }

  return data;
}
