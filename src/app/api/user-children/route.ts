import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
  deleteUserChild,
  deleteUserChildren,
  getUserChildren,
  upsertUserChildren,
} from "@/lib/userChildren/service";
import { UserChildInput } from "@/lib/userChildren/schema";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const children = await getUserChildren(user.id);
  return NextResponse.json(children.length ? children : { empty: true });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: { children: UserChildInput[] } = await req.json();
  await upsertUserChildren(user.id, body);

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const childId = searchParams.get("id");

  if (childId) {
    await deleteUserChild(user.id, childId);
  } else {
    await deleteUserChildren(user.id);
  }

  return NextResponse.json({ success: true });
}
