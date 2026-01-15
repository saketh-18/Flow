import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BacklogClient } from "./backlog-client";

interface BacklogPageProps {
  params: Promise<{ workspaceSlug: string; teamKey: string }>;
}

export default async function BacklogPage({ params }: BacklogPageProps) {
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

  // Get backlog issues (issues with backlog state type)
  const { data: backlogStates } = await supabase
    .from("workflow_states")
    .select("id")
    .eq("team_id", (team as any).id)
    .eq("type", "backlog");

  const backlogStateIds = (backlogStates as any)?.map((s: any) => s.id) || [];

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
    .in("state_id", backlogStateIds.length > 0 ? backlogStateIds : ["none"])
    .order("sort_order", { ascending: true });

  return <BacklogClient team={team as any} issues={issues || []} />;
}
