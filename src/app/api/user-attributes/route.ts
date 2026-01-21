import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { deleteUserAttribute, getUserAttributes, upsertUserAttributes } from "@/lib/userAttributes/service";
import { UserAttributesInput } from "@/lib/userAttributes/schema";

export async function GET(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const spouse = searchParams.get("spouse") === "true";

  const attrs = await getUserAttributes(user.id, spouse);
  return NextResponse.json(attrs ?? { empty: true, spouse });
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

export async function DELETE(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await deleteUserAttribute(user.id);

  return NextResponse.json({ success: true });
}