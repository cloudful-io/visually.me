import { supabase } from "@/utils/supabase/client";
import { wrapError, selectMaybeSingle } from "../utils/supabase/helper";
import type { Database } from "../types/database.types";

type CalculatorStatsRow = Database["public"]["Tables"]["calculator_stats"]["Row"];

const CALCULATOR_STATS_TABLE = "calculator_stats";

export const CalculatorStatsService = {
  /**
   * Calls the atomic increment RPC.
   * This DOES NOT return the new count (stays fast).
   */
  async incrementCalculationCount(): Promise<void> {
    try {
      const { error } = await supabase.rpc("increment_calc_count");

      if (error) {
        throw wrapError("CalculatorStatsService.incrementCalculationCount failed", error);
      }

      return;
    } catch (error) {
      throw wrapError("CalculatorStatsService.incrementCalculationCount failed", error);
    }
  },

  /**
   * Gets the current global counters, such as calc_count.
   * Defaults to the known row ID = 1.
   */
  async getStats(): Promise<CalculatorStatsRow | null> {
    try {
      return await selectMaybeSingle<CalculatorStatsRow>(
        supabase
          .from(CALCULATOR_STATS_TABLE)
          .select("*")
          .eq("id", 1)
      );
    } catch (error) {
      throw wrapError("CalculatorStatsService.getStats failed", error);
    }
  }
};
