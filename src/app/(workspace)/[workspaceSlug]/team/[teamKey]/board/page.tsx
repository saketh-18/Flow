import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BoardClient } from "./board-client";

interface BoardPageProps {
  params: Promise<{ workspaceSlug: string; teamKey: string }>;
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { workspaceSlug, teamKey } = await params;
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get workspace
  const { data: workspace } = await supabase
    .from("workspaces")
    .select("*")
    .eq("slug", workspaceSlug)
    .single();

  if (!workspace) {
    redirect("/");
  }

  // Get team
  const { data: team } = await supabase
    .from("teams")
    .select("*")
    .eq("workspace_id", (workspace as any).id)
    .eq("key", teamKey.toUpperCase())
    .single();

  if (!team) {
    redirect(`/${workspaceSlug}`);
  }

  // Get workflow states for the team
  const { data: workflowStates } = await supabase
    .from("workflow_states")
    .select("*")
    .eq("team_id", (team as any).id)
    .order("position", { ascending: true });

  // Get issues for the team
  const { data: issues } = await supabase
    .from("issues")
    .select(
      `
      *,
      state:workflow_states(*),
      assignee:users(*),
      team:teams(*)
    `
    )
    .eq("team_id", (team as any).id)
    .order("sort_order", { ascending: true });

  return (
    <BoardClient
      team={team as any}
      issues={issues || []}
      workflowStates={workflowStates || []}
    />
  );
}
