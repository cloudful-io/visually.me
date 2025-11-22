import { useCallback, useMemo } from "react";
import type { NormalizedSource, AnyProjectionRow, CombinedRow } from "./types";

export function useCombinedProjections(
  computedSources: NormalizedSource[] | null,
  projectionTables: Record<string, AnyProjectionRow[]>
) {
  const getAllProjectionTables = useCallback(() => {
    if (!computedSources) return [];
    return computedSources.map((src) => ({
      id: src.id!,
      type: src.type,
      label: src.label,
      rows: projectionTables[src.id!] ?? [],
    }));
  }, [computedSources, projectionTables]);

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
      let annualInvestmentBalance = 0;
      const sources: Record<string, number> = {};
      const balances: Record<string, number> = {};

      for (const src of all) {
        const row = src.rows.find((r) => r.year === year);
        if (!row) continue;
        if (age === null) age = (row as any).age ?? null;

        /*  FERS Pension or Salary Income  */
        if ("pension" in row || "salary" in row) {
          let income = 0;

          if (row.salary && row.salary > 0) {
            income = row.salary; 
          } else if (row.pension && row.pension > 0) {
            income = row.pension; 
          }
          annualIncome += income;
          sources[src.id] = income;
        }

        /* Retirement Accounts */
        if ("endingBalance" in row) {
          const income = (row as any).annualWithdraw ?? 0;
          const balance = (row as any).endingBalance ?? 0;
          annualIncome += income;
          annualInvestmentBalance += balance;
          sources[src.id] = income;
          balances[src.id] = balance;
        }

        /*  Social Security  */
        if ("annualBenefit" in row) {
          const income = (row as any).annualBenefit ?? 0;
          annualIncome += income;
          sources[src.id] = income;
        }
      }

      result.push({
        year,
        age: age ?? 0,
        monthlyIncome: annualIncome/12,
        annualIncome,
        annualInvestmentBalance,
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
        monthlyIncome: row.annualIncome/12,
        annualIncome: row.annualIncome,
        annualInvestmentBalance: row.annualInvestmentBalance!,
      };

      // Flatten income per source
      for (const [srcId, income] of Object.entries(row.sources)) {
        obj[srcId] = income;
      }

      // Flatten balances per source
      for (const [srcId, balance] of Object.entries(row.balances ?? {})) {
        obj[`balance_${srcId}`] = balance;
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