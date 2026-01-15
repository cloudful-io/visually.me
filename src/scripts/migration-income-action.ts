// app/actions/migrateIncomeSources.ts
"use server";

import { migrate } from "@/scripts/migration-income-sources";

export async function migrateIncomeSources() {
  await migrate();
}
