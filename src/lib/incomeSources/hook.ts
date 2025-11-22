import { useEffect, useState, useMemo } from "react";
import { IncomeSourcesInput } from "@/lib/incomeSources/schema";
import { useUserAttributes } from "@/lib/userAttributes/hook";

import type {
  FersPensionProjectionRow,
  RetirementSavingsProjectionRow,
  SocialSecurityBenefitProjectionRow,
} from "financial-calcs";

import {
  calculateFersPensionProjection,
  calculateRetirementSavingsProjection,
  calculateSocialSecurityBenefitProjection,
} from "financial-calcs";

// ----------------------------
// Sort modes
// ----------------------------
type SortMode = "type" | "label";

type AnyProjectionRow =
  | FersPensionProjectionRow
  | RetirementSavingsProjectionRow
  | SocialSecurityBenefitProjectionRow;

type CombinedRow = {
  year: number;
  age: number;
  annualIncome: number;
  annualInvestmentBalance: number | null;
  sources: Record<string, number>;
  balances: Record<string, number>;
};


export function useIncomeSources({ lazy = false } = {}) {
  const [data, setData] = useState<IncomeSourcesInput[] | null>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = "/api/income-sources";

  // Pull user attributes (birth year, start year, retirement age)
  const { data: attrs } = useUserAttributes();

  // ----------------------------
  // Fetch on mount
  // ----------------------------
  useEffect(() => {
    if (lazy) return;

    fetch(API_URL)
      .then((res) => res.json())
      .then((json) => {
        setData(json || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [lazy]);

  // ----------------------------
  // Refresh
  // ----------------------------
  async function refresh() {
    setLoading(true);
    const res = await fetch(API_URL);
    const json = await res.json();
    setData(json || []);
    setLoading(false);
  }

  // ----------------------------
  // Save (insert or update)
  // ----------------------------
  async function save(source: IncomeSourcesInput & { id?: string }) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(source),
    });

    if (!res.ok) throw new Error("Failed to save income source");
    await refresh();
  }

  // ----------------------------
  // Delete
  // ----------------------------
  async function remove(id: string) {
    const res = await fetch(API_URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) throw new Error("Failed to delete income source");
    await refresh();
  }

  // ----------------------------
  // Computed sources (merged user attributes, firstYear, etc.)
  // ----------------------------
  const computedSources = useMemo(() => {
    if (!data || !attrs) return null;

    return data.map((src) => {
      let label = "(unknown)";
      let firstYear: number | null = null;
      let mergedFields: any = null;

      try {
        const parsed = JSON.parse(src.data);
        label = parsed.label ?? "(unknown)";

        let rows: any[] = [];

        if (src.type === "fers-pension") {
          mergedFields = {
            ...parsed.fields,
            birthYear: attrs.birthYear,
            startYear: attrs.startYear,
            retirementAge: attrs.targetRetirementAge,
            yearsToProject: attrs.yearsToProject
          };
          rows = calculateFersPensionProjection(mergedFields);
          firstYear = rows.find((r) => (r.pension ?? 0) > 0)?.year ?? null;
        } else if (src.type === "retirement-savings") {
          mergedFields = {
            ...parsed.fields,
            birthYear: attrs.birthYear,
            startYear: attrs.startYear,
            withdrawStartAge: attrs.targetRetirementAge,
            yearsToProject: attrs.yearsToProject
          };
          rows = calculateRetirementSavingsProjection(mergedFields);
          firstYear = rows.find((r) => (r.annualWithdraw ?? 0) > 0)?.year ?? null;
        } else if (src.type === "social-security") {
          mergedFields = {
            ...parsed.fields,
            birthYear: attrs.birthYear,
            startYear: attrs.startYear,
            yearsToProject: attrs.yearsToProject
          };
          rows = calculateSocialSecurityBenefitProjection(mergedFields);
          firstYear = rows.find((r) => (r.annualBenefit ?? 0) > 0)?.year ?? null;
        }
      } catch {}

      return {
        ...src,
        label,
        mergedFields,
        firstYear,
      };
    });
  }, [data, attrs]);

  // ----------------------------
  // Sorters
  // ----------------------------
  const sorters: Record<
    SortMode,
    (a: IncomeSourcesInput, b: IncomeSourcesInput) => number
  > = {
    type: (a, b) => {
      const tA = a.type.toLowerCase();
      const tB = b.type.toLowerCase();
      if (tA !== tB) return tA.localeCompare(tB);

      let labelA = "", labelB = "";
      try { labelA = JSON.parse(a.data).label || ""; } catch {}
      try { labelB = JSON.parse(b.data).label || ""; } catch {}

      return labelA.localeCompare(labelB);
    },
    label: (a, b) => {
      let labelA = "", labelB = "";
      try { labelA = JSON.parse(a.data).label || ""; } catch {}
      try { labelB = JSON.parse(b.data).label || ""; } catch {}
      return labelA.localeCompare(labelB);
    },
  };

  // ----------------------------
  // Public API
  // ----------------------------
  function getSorted(mode: SortMode) {
    if (!data) return null;
    return [...data].sort(sorters[mode]);
  }

  function getComputed(mode: SortMode) {
    if (!computedSources) return null;
    return [...computedSources].sort((a, b) => sorters[mode](a, b));
  }

  function getById(id: string) {
    if (!computedSources) return null;
    return computedSources.find((s) => s.id === id) ?? null;
  }

  function getProjectionTable(id: string) {
    const src = getById(id);
    if (!src || !src.mergedFields) return [];
    if (src.type === "fers-pension") {
      return calculateFersPensionProjection(src.mergedFields);
    } else if (src.type === "retirement-savings") {
      return calculateRetirementSavingsProjection(src.mergedFields);
    } else if (src.type === "social-security") {
      return calculateSocialSecurityBenefitProjection(src.mergedFields);
    }
    return [];
  }

  function isFersPensionRow(
    row: AnyProjectionRow
  ): row is FersPensionProjectionRow {
    return "pension" in row;
  }

  function isRetirementSavingsRow(
    row: AnyProjectionRow
  ): row is RetirementSavingsProjectionRow {
    return "endingBalance" in row;
  }

  function isSocialSecurityBenefitRow(
    row: AnyProjectionRow
  ): row is SocialSecurityBenefitProjectionRow {
    return "annualBenefit" in row;
  }


  function getAllProjectionTables() {
    if (!computedSources) return [];

    return computedSources.map(src => ({
      id: src.id!,
      type: src.type,
      label: src.label,
      rows: getProjectionTable(src.id!)
    }));
  }

  function getCombinedProjection(): CombinedRow[] {
    const all = getAllProjectionTables();
    if (!all.length) return [];

    // Get union of all years in all sources
    const allYears = Array.from(
      new Set(all.flatMap(src => src.rows.map(r => r.year)))
    ).sort((a, b) => a - b);

    const result: CombinedRow[] = [];

    for (const year of allYears) {
      let age = null;
      let annualIncome = 0;
      let annualInvestmentBalance = 0;
      const sources: Record<string, number> = {};
      const balances: Record<string, number> = {};

      for (const src of all) {
        const row = src.rows.find(r => r.year === year);
        if (!row) continue;

        if (age === null) age = row.age ?? null;

        if (isFersPensionRow(row)) {
          let income = 0;

          if (row.salary && row.salary > 0) {
            income = row.salary; 
          } else if (row.pension && row.pension > 0) {
            income = row.pension; 
          }
          annualIncome += income;
          sources[src.id] = income;
        }

        if (isRetirementSavingsRow(row)) {
          const income = row.annualWithdraw ?? 0;
          const balance = row.endingBalance ?? 0;

          annualIncome += income;
          annualInvestmentBalance += balance;
          sources[src.id] = income;
          balances[src.id] = balance;
        }

        if (isSocialSecurityBenefitRow(row)) {
          const income = row.annualBenefit ?? 0;

          annualIncome += income;
          sources[src.id] = income;
        }
      }

      result.push({
        year,
        age: age ?? 0,
        annualIncome,
        annualInvestmentBalance,
        sources,
        balances
      });
    }
    return result;
  }

  function getCombinedBalanceChartRows() {
    const combined = getCombinedProjection();
    const flat: any[] = [];

    for (const row of combined) {
      const obj: any = {
        year: row.year,
        age: row.age,
        annualIncome: row.annualIncome,
        annualInvestmentBalance: row.annualInvestmentBalance,
      };

      // Flatten investment balances per retirement-savings source
      for (const src of getAllProjectionTables()) {
        const r = src.rows.find(r => r.year === row.year);

        if (r && "endingBalance" in r) {
          obj[src.id] = r.endingBalance ?? 0;
        }
      }

      flat.push(obj);
    }

    return flat;
  }

  function getCombinedChartRows() {
    const combined = getCombinedProjection();
    const flat: any[] = [];

    for (const row of combined) {
      const obj: any = {
        year: row.year,
        age: row.age,
        annualIncome: row.annualIncome,
        annualInvestmentBalance: row.annualInvestmentBalance,
      };

      // Flatten each source into a top-level key
      for (const [sourceId, income] of Object.entries(row.sources)) {
        obj[sourceId] = income;
      }

      for (const [sourceId, balance] of Object.entries(row.balances ?? {})) {
        obj[`bal_${sourceId}`] = balance;   
      }

      flat.push(obj);
    }

    return flat;
  }

  return {
    data,
    loading,
    save,
    remove,
    refresh,
    getSorted,
    getComputed,
    getById,
    getProjectionTable,
    getAllProjectionTables,
    getCombinedProjection,
    getCombinedChartRows,
    getCombinedBalanceChartRows,
    computedSources,
  };
}
