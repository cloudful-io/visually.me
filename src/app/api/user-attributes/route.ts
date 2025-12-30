import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUserAttributes, upsertUserAttributes } from "@/lib/userAttributes/service";
import { UserAttributesInput } from "@/lib/userAttributes/schema";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const attrs = await getUserAttributes(user.id);
  return NextResponse.json(attrs ?? { empty: true });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: UserAttributesInput = await req.json();
  await upsertUserAttributes(user.id, body);

  return NextResponse.json({ success: true });
}