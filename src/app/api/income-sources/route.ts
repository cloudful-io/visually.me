// /app/api/income-sources/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getIncomeSourceById, getIncomeSources, upsertIncomeSource, deleteIncomeSource } from "@/lib/incomeSources/service";
import { IncomeSourcesInput } from "@/lib/incomeSources/schema";

// ----------------------------
// GET /api/income-sources
// Supports: ?id=123  OR  GET all
// ----------------------------
export async function GET(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (id) {
    // Fetch a single income source
    const source = await getIncomeSourceById(user.id, id);
    if (!source) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(source);
  }

  // Otherwise fetch all
  const sources = await getIncomeSources(user.id);
  return NextResponse.json(sources);
}

// ----------------------------
// POST /api/income-sources
// Add or update a source
// ----------------------------
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: IncomeSourcesInput & { id?: string } = await req.json();

  await upsertIncomeSource(user.id, body, body.id);

  return NextResponse.json({ success: true });
}

// ----------------------------
// DELETE /api/income-sources
// Delete a source by id
// ----------------------------
export async function DELETE(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await deleteIncomeSource(user.id, id);

  return NextResponse.json({ success: true });
}
