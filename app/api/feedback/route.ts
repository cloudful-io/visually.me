// /app/api/feedback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const { rating, comments, pageUrl, token } = await req.json();

  // Verify reCAPTCHA
  const verifyRes = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    }
  );

  const verifyData = await verifyRes.json();
  if (!verifyData.success || verifyData.score < 0.5) {
    return NextResponse.json({ error: "Failed captcha verification" }, { status: 400 });
  }

  // Insert into Supabase
  const { error } = await supabase
    .from("feedback")
    .insert([{ rating, comments, page_url: pageUrl }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
