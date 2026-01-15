import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const supabase = await createClient();
  const { teamId } = await params;

  const { data, error } = await supabase
    .from("team_members")
    .select("user:users(*)")
    .eq("team_id", teamId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const members = (data as any)?.map((tm: any) => tm.user) || [];
  return NextResponse.json(members);
}
