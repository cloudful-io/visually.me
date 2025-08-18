/*import { useState } from 'react';

export interface MortgageFormValues {
  loanAmount: number;
  annualRate: number;
  termYears: number;
  startDate?: Date;
  extraPayment?: number;
}

export interface AmortizationRow {
  month: number;
  date: string;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface YearlyAmortizationRow {
  year: number;
  month: number;   
  date: string;    
  payment: number;
  principal: number;
  interest: number;
  balance: number;
};

export function groupByYear(rows: AmortizationRow[]): YearlyAmortizationRow[] {
  const yearlyMap: Record<number, YearlyAmortizationRow> = {};

  rows.forEach((row) => {
    const year = Math.floor((row.month - 1) / 12) + 1; // Loan year #1, #2, etc.
    if (!yearlyMap[year]) {
      yearlyMap[year] = {
        year,
        month: row.month,   // capture first month in the year
        date: row.date,     // capture first date in the year
        payment: 0,
        principal: 0,
        interest: 0,
        balance: row.balance,
      };
    }
    yearlyMap[year].year = year;
    yearlyMap[year].payment += row.payment;
    yearlyMap[year].principal += row.principal;
    yearlyMap[year].interest += row.interest;

    // Overwrite with last month's month/date/balance
    yearlyMap[year].month = row.month;
    yearlyMap[year].date = row.date;
    yearlyMap[year].balance = row.balance;
  });

  return Object.values(yearlyMap);
}

export function useMortgageAmortization(formValues: MortgageFormValues) {
  const [rows, setRows] = useState<AmortizationRow[]>([]);

  const generateTable = () => {
    const { loanAmount, annualRate, termYears, startDate = new Date(), extraPayment = 0 } = formValues;

    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = termYears * 12;
    const basePayment =
      loanAmount *
      (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    let balance = loanAmount;
    const data: AmortizationRow[] = [];

    for (let i = 1; balance > 0.01 && i <= totalMonths; i++) {
      const interest = balance * monthlyRate;
      const principal = Math.min(basePayment + extraPayment - interest, balance);
      balance -= principal;

      const paymentDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth() + i 
      );
    
      const row: AmortizationRow = {
        month: i,
        date: paymentDate.toLocaleDateString(),
        payment: principal + interest,
        principal,
        interest,
        balance: Math.max(balance, 0),
      };

      data.push(row);
    }

    setRows(data);  
  };

  return { rows, generateTable };
}
*/
import { useState } from 'react';
import {
  calculateMortgageAmortization,
  groupByYear,
  MortgageAmortizationInput,
  AmortizationRow,
  YearlyAmortizationRow
} from 'financial-calcs';

export function useMortgageAmortization(input: MortgageAmortizationInput) {
  const [rows, setRows] = useState<AmortizationRow[]>([]);
  const [yearlyRows, setYearlyRows] = useState<YearlyAmortizationRow[]>([]);

  const generateTable = () => {
    const monthlyRows = calculateMortgageAmortization(input);
    const yearly = groupByYear(monthlyRows);
    setRows(monthlyRows);
    setYearlyRows(yearly);
  };

  return { rows, yearlyRows, generateTable };
}