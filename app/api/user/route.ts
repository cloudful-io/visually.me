import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  //const session = await auth({ req }); // notice `request` property
  const session = await auth();

  if (!session) {
    console.log("not authenticated")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = session.user?.email;
  if (!email) {
    return NextResponse.json({ error: "No email in session" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = session.user?.email;
  if (!email) {
    return NextResponse.json({ error: "No email in session" }, { status: 400 });
  }

  const body = await req.json();
  const { full_name, onboarding_complete } = body;

  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        email,
        full_name,
        onboarding_complete: onboarding_complete ?? false,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "email",
      }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = session.user?.email;
  if (!email) {
    return NextResponse.json({ error: "No email in session" }, { status: 400 });
  }

  const body = await req.json();

  // Allow updating only specific fields
  const updateData: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };
  if (body.full_name !== undefined) updateData.full_name = body.full_name;
  if (body.onboarding_complete !== undefined)
    updateData.onboarding_complete = body.onboarding_complete;

  const { data, error } = await supabase
    .from("users")
    .update(updateData)
    .eq("email", email)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

// --- DELETE user account ---
export async function DELETE() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = session.user?.email;
  if (!email) {
    return NextResponse.json({ error: "No email in session" }, { status: 400 });
  }

  const { error } = await supabase
    .from("users")
    .delete()
    .eq("email", email);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Account deleted successfully" }, { status: 200 });
}