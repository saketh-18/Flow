import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MyIssuesClient } from "./my-issues-client";

interface MyIssuesPageProps {
  params: Promise<{ workspaceSlug: string }>;
}

export default async function MyIssuesPage({ params }: MyIssuesPageProps) {
  const { workspaceSlug } = await params;
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

  // Get all teams in workspace
  const { data: teams } = await supabase
    .from("teams")
    .select("id")
    .eq("workspace_id", (workspace as any)?.id);

  const teamIds = (teams as any)?.map((t: any) => t.id) || [];

  // Get issues assigned to user in this workspace
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
    .eq("assignee_id", user.id)
    .in("team_id", teamIds.length > 0 ? teamIds : ["none"])
    .order("updated_at", { ascending: false });

  return <MyIssuesClient issues={issues || []} />;
}
