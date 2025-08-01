import { useState } from 'react';

export function useRetirementProjection(formValues: any) {
  const [rows, setRows] = useState<any[]>([]);

  const generateTable = () => {
    const {
      startYear, birthYear, initialBalance, initialContribution,
      estimatedYield, estimatedWithdrawRate, contributionIncreaseRate,
      withdrawStartAge, yearsToProject
    } = formValues;

    let balance = initialBalance;
    let contribution = initialContribution;
    const data: any[] = [];

    for (let i = 0; i < yearsToProject; i++) {
      const year = startYear + i;
      const age = year - birthYear;
      const isWithdrawing = age >= withdrawStartAge;

      if (i > 0) {
        contribution = isWithdrawing ? 0 : contribution * (1 + contributionIncreaseRate / 100);
      }

      const annualWithdraw = isWithdrawing ? (estimatedWithdrawRate / 100) * balance : 0;
      const yieldAmount = (estimatedYield / 100) * balance;
      balance += yieldAmount + contribution - annualWithdraw;

      data.push({
        year,
        age,
        beginningBalance: balance - yieldAmount - contribution + annualWithdraw,
        contribution,
        yieldPercent: estimatedYield,
        withdrawRate: isWithdrawing ? estimatedWithdrawRate : 0,
        monthlyWithdraw: annualWithdraw / 12,
        annualWithdraw,
        endingBalance: balance,
      });
    }

    setRows(data);
  };

  return { rows, generateTable };
}
