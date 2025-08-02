import { useState } from 'react';

export function useSocialSecurityBenefitsProjection(formValues: any) {
  const [rows, setRows] = useState<any[]>([]);

  const generateTable = () => {
    const {
      startYear,
      birthYear,
      claimingAge,
      averageIncome,
      averageCOLA,
      yearsToProject,
    } = formValues;

    const fullRetirementAge = getFullRetirementAge(birthYear);
    const claimingYear = birthYear + claimingAge;

    // Simplified PIA estimate (replace with SSA-style formula for better accuracy)
    const estimatedPIA = estimatePIA(averageIncome);

    const reductionOrIncreaseFactor = calculateAdjustmentFactor(claimingAge, fullRetirementAge);
    const initialAnnualBenefit = estimatedPIA * 12 * reductionOrIncreaseFactor;

    const data: any[] = [];
    let benefit = initialAnnualBenefit;

    for (let i = 0; i < yearsToProject; i++) {
      const year = startYear + i;
      const age = year - birthYear;

      const isClaiming = year >= claimingYear;
      const annualBenefit = isClaiming ? benefit : 0;

      if (i > 0 && isClaiming) {
        benefit *= 1 + averageCOLA / 100;
      }

      data.push({
        year,
        age,
        annualBenefit: Math.round(annualBenefit),
        monthlyBenefit: Math.round(annualBenefit / 12),
      });
    }

    setRows(data);
  };

  return { rows, generateTable };
}

// Rough SSA formula: first 996 @ 90%, next 5,006 @ 32%, rest @ 15% (2023 bend points)
function estimatePIA(averageIncome: number): number {
  const bendPoint1 = 1174;
  const bendPoint2 = 7078;

  const monthlyIncome = averageIncome / 12;
  let pia = 0;

  if (monthlyIncome <= bendPoint1) {
    pia = monthlyIncome * 0.9;
  } else if (monthlyIncome <= bendPoint2) {
    pia = bendPoint1 * 0.9 + (monthlyIncome - bendPoint1) * 0.32;
  } else {
    pia =
      bendPoint1 * 0.9 +
      (bendPoint2 - bendPoint1) * 0.32 +
      (monthlyIncome - bendPoint2) * 0.15;
  }

  return pia;
}

// Adjust benefit based on claiming age vs FRA
function calculateAdjustmentFactor(claimingAge: number, fra: number): number {
  if (claimingAge < fra) {
    const monthsEarly = (fra - claimingAge) * 12;
    return 1 - monthsEarly * 0.005; // ~0.5% per month early
  } else if (claimingAge > fra) {
    const monthsLate = (claimingAge - fra) * 12;
    return 1 + monthsLate * 0.0067; // ~0.67% per month late
  } else {
    return 1;
  }
}

function getFullRetirementAge(birthYear: number): number {
  if (birthYear <= 1937) return 65;
  if (birthYear >= 1938 && birthYear <= 1942) return 65 + (birthYear - 1937) * (2 / 12);
  if (birthYear >= 1943 && birthYear <= 1954) return 66;
  if (birthYear >= 1955 && birthYear <= 1959) return 66 + (birthYear - 1954) * (2 / 12);
  return 67; // 1960 and later
}
