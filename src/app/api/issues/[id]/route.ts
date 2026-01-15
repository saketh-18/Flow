import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

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
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
