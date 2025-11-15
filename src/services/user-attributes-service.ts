// DEPRECATED: Using Encrypted API for sensitive data

import { supabase } from "@/utils/supabase/client";
import {
  wrapError,
  select,
  selectMaybeSingle,
  upsertSingle,
} from "../utils/supabase/helper";
import type { Database } from "../types/database.types";

type UserAttributeRow = Database["public"]["Tables"]["user_attributes"]["Row"];

type UserAttributeInput = {
  id: string;
  birth_year: number;
  retirement_age: number;
  start_year: number;
};

const USER_ATTRIBUTES_TABLE = "user_attributes";

export const UserAttributeService = {

  async getOrCreateOrUpdate(user: UserAttributeInput): Promise<UserAttributeRow> {

    if (!user.id) {
        throw wrapError("getOrCreateOrUpdate failed", new Error("User ID is required"));
    }

    const payload: Partial<UserAttributeRow> = {
        id: user.id,
        birth_year: user.birth_year,
        retirement_age: user.retirement_age,
        start_year: user.start_year
    };

    try {
        return await upsertSingle<UserAttributeRow>(
        supabase.from(USER_ATTRIBUTES_TABLE),
        payload,
        { onConflict: "id" }
        );
    } catch (error) {
        console.log(error);
        throw wrapError("UserProfileService.getOrCreateOrUpdate failed", error);
    }
 },

  async getById(id: string, columns: string = "*"): Promise<UserAttributeRow | null> {
    try {
      return await selectMaybeSingle<UserAttributeRow>(
        supabase
          .from(USER_ATTRIBUTES_TABLE)
          .select(columns)
          .eq("id", id)
      );
    } catch (error) {
      throw wrapError("UserProfileService.getById failed", error);
    }
  }
};