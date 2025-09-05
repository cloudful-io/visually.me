import { NextRequest, NextResponse } from "next/server";
import { getOrCreateOrUpdateUser } from "@/lib/user";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, fullName, onboardingComplete } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Build the payload to pass down
    const userPayload: {
      email: string;
      fullName: string;
      onboardingComplete?: boolean;
    } = {
      email,
      fullName,
    };

    if (onboardingComplete !== undefined) {
      userPayload.onboardingComplete = onboardingComplete;
    }

    const user = await getOrCreateOrUpdateUser(userPayload);
    return NextResponse.json(user);
  } catch (error: any) {
    console.error("User API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}