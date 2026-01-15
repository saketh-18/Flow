import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get team from query params
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get("teamId");

    if (!teamId) {
      return NextResponse.json({ error: "Team ID required" }, { status: 400 });
    }

    // First try simple select without relations
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .eq("team_id", teamId)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Supabase error fetching issues:", error);
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 500 }
      );
    }

    // Now fetch relations separately if we have issues
    if (data && data.length > 0) {
      // Fetch workflow states
      const { data: states } = await supabase
        .from("workflow_states")
        .select("*");

      // Fetch users (potential assignees)
      const { data: users } = await supabase.from("users").select("*");

      // Fetch teams
      const { data: teams } = await supabase.from("teams").select("*");

      // Enrich data with relations
      const enrichedData = data.map((issue) => ({
        ...issue,
        state: states?.find((s) => s.id === issue.state_id),
        assignee: users?.find((u) => u.id === issue.assignee_id),
        team: teams?.find((t) => t.id === issue.team_id),
      }));

      return NextResponse.json(enrichedData);
    }

    return NextResponse.json(data);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("API error fetching issues:", errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get next issue number for team
  const { data: maxIssueArray } = await supabase
    .from("issues")
    .select("number")
    .eq("team_id", body.team_id)
    .order("number", { ascending: false })
    .limit(1);

  const maxIssue = (maxIssueArray as any[])?.[0];
  const nextNumber = (maxIssue?.number || 0) + 1;

  const { data, error } = await supabase
    .from("issues")
    .insert({
      ...body,
      number: nextNumber,
      creator_id: user.id,
    })
    .select(
      `
      *,
      state:workflow_states(*),
      assignee:users(*),
      team:teams(*)
    `
    )
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "Issue ID required" }, { status: 400 });
  }

  const { data, error } = (await (supabase.from("issues") as any)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select(
      `
      *,
      state:workflow_states(*),
      assignee:users(*),
      team:teams(*)
    `
    )
    .single()) as any;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Issue ID required" }, { status: 400 });
  }

  const { error } = await supabase.from("issues").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
