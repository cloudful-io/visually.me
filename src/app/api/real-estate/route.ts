// /app/api/real-estate/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getRealEstateById, getRealEstates, upsertRealEstate, deleteRealEstate } from "@/lib/realEstate/service";
import { RealEstateInput } from "@/lib/realEstate/schema";

// ----------------------------
// GET /api/real-estate
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
    // Fetch a single real estate
    const property = await getRealEstateById(user.id, id);
    if (!property) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(property);
  }

  // Otherwise fetch all
  const properties = await getRealEstates(user.id);
  return NextResponse.json(properties);
}

// ----------------------------
// POST /api/real-estate
// Add or update a real estate property
// ----------------------------
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: RealEstateInput & { id?: string } = await req.json();

  await upsertRealEstate(user.id, body, body.id);

  return NextResponse.json({ success: true });
}

// ----------------------------
// DELETE /api/real-estate
// Delete a real estate property by id
// ----------------------------
export async function DELETE(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await deleteRealEstate(user.id, id);

  return NextResponse.json({ success: true });
}
