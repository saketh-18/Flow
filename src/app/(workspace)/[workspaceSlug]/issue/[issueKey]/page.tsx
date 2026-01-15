import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { IssueDetailClient } from "./issue-detail-client";

interface IssuePageProps {
  params: Promise<{ workspaceSlug: string; issueKey: string }>;
}

export default async function IssuePage({ params }: IssuePageProps) {
  const { workspaceSlug, issueKey } = await params;
  const supabase = await createClient();

  // Parse issue key (e.g., "ENG-123")
  const keyParts = issueKey.toUpperCase().split("-");
  if (keyParts.length !== 2) {
    notFound();
  }

  const [teamKey, issueNumber] = keyParts;
  const number = parseInt(issueNumber, 10);

  if (isNaN(number)) {
    notFound();
  }

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
    notFound();
  }

  // Get team by key
  const { data: team } = (await supabase
    .from("teams")
    .select("*")
    .eq("workspace_id", (workspace as any)?.id)
    .eq("key", teamKey)
    .single()) as any;

  if (!team) {
    notFound();
  }

  // Get issue by team and number
  const { data: issue } = await supabase
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
    .eq("team_id", team.id)
    .eq("number", number)
    .single();

  if (!issue) {
    notFound();
  }

  // Get workflow states for the team
  const { data: workflowStates } = await supabase
    .from("workflow_states")
    .select("*")
    .eq("team_id", team.id)
    .order("position");

  // Get team members
  const { data: members } = (await supabase
    .from("team_members")
    .select("user:users(*)")
    .eq("team_id", (team as any)?.id)) as any;

  const teamMembers =
    (members as any)?.map((m: any) => m.user).filter(Boolean) || [];

  // Get comments
  const { data: comments } = await supabase
    .from("issue_comments")
    .select(
      `
      *,
      user:users(*)
    `
    )
    .eq("issue_id", (issue as any)?.id)
    .order("created_at", { ascending: true });

  return (
    <IssueDetailClient
      issue={issue}
      workflowStates={workflowStates || []}
      teamMembers={teamMembers}
      comments={comments || []}
      workspaceSlug={workspaceSlug}
    />
  );
}
