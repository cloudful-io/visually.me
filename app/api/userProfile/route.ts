// app/api/userProfile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getOrCreateOrUpdateUserProfile } from "@/lib/user";

export async function POST(req: NextRequest) {
  try {
    const { userId, birthYear, retirementAge } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const profile = await getOrCreateOrUpdateUserProfile({
      userId: userId,
      birthYear: birthYear,
      retirementAge: retirementAge
    });

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("UserProfile API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
