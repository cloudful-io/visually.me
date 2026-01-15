// /app/api/assets/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getIncomeAssets, getRealEstateAssets, getAssetById, getAssets, upsertAsset, deleteAsset } from "@/lib/assets/service";
import { AssetInput } from "@/lib/assets/schema";
import { isAssetCategory } from "@/lib/assets/types";

// ----------------------------
// GET /api/assets
// Supports: ?id=123  OR  GET all
// ----------------------------
export async function GET(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const category = url.searchParams.get("category");

  // ----------------------------
  // 1. Fetch by ID
  // ----------------------------
  if (id) {
    const asset = await getAssetById(user.id, id);
    if (!asset) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(asset);
  }

  // ----------------------------
  // 2. Fetch by type
  // ----------------------------
  if (category) {
    if (!isAssetCategory(category)) {
      return NextResponse.json(
        { error: `Unknown asset category: ${category}` },
        { status: 400 }
      );
    }

    switch (category) {
      case "income-source":
        return NextResponse.json(await getIncomeAssets(user.id));

      case "property":
        // future
        return NextResponse.json(await getRealEstateAssets(user.id));

      case "college-savings":
        // future
        return NextResponse.json([]);
    }
  }

  // ----------------------------
  // 3. Fetch all assets
  // ----------------------------
  const assets = await getAssets(user.id);
  return NextResponse.json(assets);
}

// ----------------------------
// POST /api/assets
// Add or update an asset
// ----------------------------
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: AssetInput & { id?: string } = await req.json();

  await upsertAsset(user.id, body, body.id);

  return NextResponse.json({ success: true });
}

// ----------------------------
// DELETE /api/assets
// Delete an asset by id
// ----------------------------
export async function DELETE(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await deleteAsset(user.id, id);

  return NextResponse.json({ success: true });
}
