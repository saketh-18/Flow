import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TeamPageClient } from "./team-page-client";

interface TeamPageProps {
  params: Promise<{ workspaceSlug: string; teamKey: string }>;
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { workspaceSlug, teamKey } = await params;
  const supabase = await createClient();

  // Get workspace
  const { data: workspace } = await supabase
    .from("workspaces")
    .select("*")
    .eq("slug", workspaceSlug)
    .single();

  if (!workspace) {
    notFound();
  }

  // Get team by key
  const { data: team } = await supabase
    .from("teams")
    .select("*")
    .eq("workspace_id", (workspace as any)?.id)
    .eq("key", teamKey.toUpperCase())
    .single();

  if (!team) {
    notFound();
  }

  // Get workflow states
  const { data: workflowStates } = await supabase
    .from("workflow_states")
    .select("*")
    .eq("team_id", (team as any)?.id)
    .order("position");

  // Get issues with relations
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
    .eq("team_id", (team as any)?.id)
    .order("sort_order", { ascending: true });

  return (
    <TeamPageClient
      team={team}
      issues={issues || []}
      workflowStates={workflowStates || []}
    />
  );
}
