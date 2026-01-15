import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user's first workspace
  const { data: workspaceMember } = (await supabase
    .from("workspace_members")
    .select("workspace:workspaces(slug)")
    .eq("user_id", user.id)
    .limit(1)
    .single()) as any;

  if ((workspaceMember as any)?.workspace) {
    redirect(
      `/${((workspaceMember as any).workspace as { slug: string }).slug}`
    );
  }

  // No workspace - redirect to create one
  redirect("/onboarding");
}
