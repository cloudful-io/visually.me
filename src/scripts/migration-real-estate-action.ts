"use server";

import { migrate } from "@/scripts/migration-real-estate";

export async function migrateRealEstates() {
  await migrate();
}
