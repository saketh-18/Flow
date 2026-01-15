import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WorkspaceLayoutClient } from "./workspace-layout-client";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  params: Promise<{ workspaceSlug: string }>;
}

export default async function WorkspaceLayout({
  children,
  params,
}: WorkspaceLayoutProps) {
  const { workspaceSlug } = await params;
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Get workspace by slug
  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .select("*")
    .eq("slug", workspaceSlug)
    .single();

  if (workspaceError || !workspace) {
    redirect("/onboarding");
  }

  // Check if user is a member of this workspace
  const { data: membership } = await supabase
    .from("workspace_members")
    .select("*")
    .eq("workspace_id", (workspace as any)?.id)
    .eq("user_id", user.id)
    .single();

  if (!membership) {
    redirect("/");
  }

  // Get workspace teams
  const { data: teams } = await supabase
    .from("teams")
    .select("*")
    .eq("workspace_id", (workspace as any)?.id)
    .order("name");

  // Get user profile
  const { data: userProfile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <WorkspaceLayoutClient
      workspace={workspace}
      teams={teams || []}
      currentUser={userProfile}
    >
      {children}
    </WorkspaceLayoutClient>
  );
}
