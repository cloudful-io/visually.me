import { useState } from 'react';

export function useFersPensionProjection(formValues: any) {
  const [rows, setRows] = useState<any[]>([]);

  const generateTable = () => {
    const {
      startYear,
      birthYear,
      serviceStartYear,
      retirementAge,
      currentSalary,
      salaryGrowthRate,
      colaPercent,
      pensionMultiplier,
      yearsToProject,
      retirementType,
    } = formValues;

    const retirementYear = birthYear + retirementAge;
    const endYear = startYear + yearsToProject;

    const data: any[] = [];

    // Build salary projections
    const salaries: number[] = [];
    let salary = currentSalary;
    for (let year = startYear; year < retirementYear; year++) {
      salaries.push(salary);
      salary *= 1 + salaryGrowthRate / 100;
    }

    // Compute high-3 (average of last 3 salaries before retirement)
    const high3 =
      salaries.slice(-3).reduce((sum, s) => sum + s, 0) / Math.min(3, salaries.length);

    const yearsOfService = retirementAge - (serviceStartYear - birthYear);

    let adjustedMultiplier = pensionMultiplier;
    let pensionReduction = 0; // percentage points to subtract

    switch (retirementType) {
        case 'regular':
            // full pension, no changes
            break;
        case 'mra10':
            // reduce pension by 5% for each year under age 62
            const yearsUnder62 = Math.max(0, 62 - retirementAge);
            pensionReduction = 5 * yearsUnder62;
            break;
        case 'early':
            // generally for involuntary/VSIP retirement — assume no penalty
            break;
        case 'deferred':
            // same reduction as MRA+10 and no COLA until 62
            const yearsUnder = Math.max(0, 62 - retirementAge);
            pensionReduction = 5 * yearsUnder;
            break;
    }

    const basePension =
        high3 * (adjustedMultiplier / 100) * yearsOfService * (1 - pensionReduction / 100);

    let pension = basePension;

    for (let year = startYear; year < endYear; year++) {
        const age = year - birthYear;
        const row: any = { year, age };

        if (year < retirementYear) {
            const salaryValue = salaries[year - startYear];
            row.salary = salaryValue;
            row.salaryGrowthRate = salaryGrowthRate; // constant input value
            row.colaApplied = 0; // no COLA before retirement
        } else {
            if (age >= 63 && year > retirementYear) {
            pension *= 1 + colaPercent / 100;
            row.colaApplied = colaPercent;
            } else {
            row.colaApplied = 0;
            }
            row.pension = pension;
            row.monthlyPension = pension / 12;
            row.salaryGrowthRate = 0; // no salary growth after retirement
        }

        if (retirementType === 'deferred' && age < 62) {
        row.colaApplied = 0;
        }

        data.push(row);
      }


    setRows(data);
  };

  return { rows, generateTable };
}
