import { useCallback, useMemo } from "react";
import type { NormalizedAsset, CombinedRow } from "./types";
import { assetRegistry } from "./registry";

export function useCombinedProjections(
  computedAssets: NormalizedAsset[] | null,
) {
  const getAllProjectionTables = useCallback(() => {
    if (!computedAssets) return [];
    return computedAssets.map((asset) => ({
      id: asset.id!,
      label: asset.label,
      address: asset.address ?? "",
      asset_type: asset.asset_type,
      rows: asset.rows ?? [],
    }));
  }, [computedAssets]);

  const getCombinedProjection = useCallback((): CombinedRow[] => {
    const all = getAllProjectionTables();
    if (!all.length) return [];

    const allYears = Array.from(
      new Set(all.flatMap((s) => s.rows.map((r) => r.year)))
    ).sort((a, b) => a - b);

    const result: CombinedRow[] = [];

    for (const year of allYears) {
      let age: number | null = null;
      let annualIncome = 0;
      let annualExpense = 0;
      let annualInvestmentBalance = 0;
      const sources: Record<string, number> = {};
      const balances: Record<string, number> = {};

      for (const asset of all) {
        const row = asset.rows.find((r) => r.year === year);
        if (!row) continue;
        if (age === null) age = (row as any).age ?? null;

        const def = assetRegistry[asset.asset_type];

        if (!def) continue;

        // ----------------------------
        // Income & balances
        // ----------------------------
        if (def.category === "income-source") {
          const incomeKey = def.incomeKey ?? null;
          const balanceKey = def.balanceKey ?? null;

          // If no keys are defined, fallback to previous hardcoded pattern
          let income = 0;
          let balance = 0;

          if (incomeKey) {
            if (Array.isArray(incomeKey)) {
              income = incomeKey.reduce((sum, key) => sum + ((row as any)[key] ?? 0), 0);
            } else {
              income = (row as any)[incomeKey] ?? 0;
            }
          }
          if (balanceKey && balanceKey in row) balance = (row as any)[balanceKey] ?? 0;

          annualIncome += income;
          annualInvestmentBalance += balance;

          sources[asset.id] = income;
          if (balance > 0) balances[asset.id] = balance;
        }

        // ----------------------------
        // Real estate cash flow
        // ----------------------------
        if (def.category === "property") {
          const income = (row as any).annualIncome ?? 0;
          const expense = (row as any).annualExpense ?? 0;
          annualIncome += income;
          annualExpense += expense;
          // track property income per asset id
          sources[asset.id] = income;
        }
      }

      result.push({
        year,
        age: age ?? 0,
        monthlyIncome: Math.round(annualIncome/12),
        annualIncome: Math.round(annualIncome),
        monthlyExpense: Math.round(annualExpense / 12),
        annualExpense: Math.round(annualExpense),
        annualInvestmentBalance: Math.round(annualInvestmentBalance),
        annualNetCashFlow: Math.round(annualIncome-annualExpense),
        sources,
        balances,
      });
    }
    return result;
  }, [getAllProjectionTables]);

  /** Flatten for charting: annualIncome, balances, and per-source breakdown */
  const getCombinedChartRows = useMemo(() => {
    const combined = getCombinedProjection();
    return combined.map((row) => {
      const obj: Record<string, number> = {
        year: row.year,
        age: row.age,
        monthlyIncome: Math.round(row.annualIncome/12),
        annualIncome: Math.round(row.annualIncome),
        monthlyExpense: Math.round(row.annualExpense ?? 0 / 12),
        annualExpense: Math.round(row.annualExpense ?? 0),
        annualNetCashFlow: Math.round(row.annualNetCashFlow ?? 0),
        annualInvestmentBalance: Math.round(row.annualInvestmentBalance ?? 0),
      };

      // Flatten income per source
      for (const [assetId, income] of Object.entries(row.sources)) {
        obj[assetId] = income;
      }

      // Flatten balances per source
      for (const [assetId, balance] of Object.entries(row.balances ?? {})) {
        obj[`balance_${assetId}`] = balance;
      }

      return obj;
    });
  }, [getCombinedProjection]);

  return {
    getAllProjectionTables,
    getCombinedProjection,
    getCombinedChartRows,
  };
}