import { useCallback, useMemo } from "react";
import type { NormalizedProperty, CombinedRow } from "./types";
import { RealEstatePropertyProjectionRow } from "financial-calcs";

export function useCombinedProjections(
  computedProperties: NormalizedProperty[] | null,
  projectionTables: Record<string, RealEstatePropertyProjectionRow[]>
) {
  const getAllProjectionTables = useCallback(() => {
    if (!computedProperties) return [];
    return computedProperties.map((property) => ({
      id: property.id!,
      label: property.label,
      address: property.address,
      rows: projectionTables[property.id!] ?? [],
    }));
  }, [computedProperties, projectionTables]);

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
      const properties: Record<string, number> = {};

      for (const property of all) {
        const row = property.rows.find((r) => r.year === year);
        if (!row) continue;
        if (age === null) age = (row as any).age ?? null;

        let income = 0;
        let expense = 0;

        income = row.monthlyRentalIncome ? row.monthlyRentalIncome*12 : 0;
        expense = (row.annualInsurance ?? 0) + (row.annualPropertyTax ?? 0) + (row.monthlyHoaFee ? row.monthlyHoaFee*12 : 0) + (row.monthlyMortgage * 12);
        
        annualIncome += income;
        annualExpense += expense;
        
      }

      result.push({
        year,
        age: age ?? 0,
        monthlyIncome: Math.round(annualIncome/12),
        annualIncome: Math.round(annualIncome),
        monthlyExpense: Math.round(annualExpense/12),
        annualExpense: Math.round(annualExpense),
        properties,
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
        monthlyExpense: Math.round(row.annualExpense/12),
        annualExpense: Math.round(row.annualExpense),
      };

      // Flatten income per source
      for (const [propertyId, income] of Object.entries(row.properties)) {
        obj[propertyId] = income;
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