export type CashFlowSourceRow = {
  year: number;
  age?: number;

  annualIncome?: number;
  annualExpense?: number;
};

export type CashFlowRow = {
  year: number;
  age?: number;
  annualIncome: number;
  annualExpense: number;
  netCashFlow: number;
};

export function buildCashFlowTable(
  tables: CashFlowSourceRow[][]
): CashFlowRow[] {
  const byYear = new Map<
    number,
    {
      age?: number;
      income: number;
      expense: number;
    }
  >();

  tables.flat().forEach(row => {
    const current = byYear.get(row.year) ?? {
      age: row.age,
      income: 0,
      expense: 0,
    };

    byYear.set(row.year, {
      age: current.age ?? row.age,
      income: current.income + (row.annualIncome ?? 0),
      expense: current.expense + (row.annualExpense ?? 0),
    });
  });

  return Array.from(byYear.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, values]) => ({
      year,
      age: values.age,
      annualIncome: values.income,
      annualExpense: values.expense,
      netCashFlow: values.income - values.expense,
    }));
}
