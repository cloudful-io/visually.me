import {
  collegeTuitionConfig,
  collegeTuitionFieldConfigs,
  getCollegeTuitionProjectionColumns,
  collegeTuitionDataKeys,
} from "@/configs/collegeTuition"
import {
  fersPensionConfig,
  fersPensionFieldConfigs,
  getFersPensionProjectionColumns,
  fersPensionDataKeys,
} from "@/configs/fersPension"
import {
  militaryPensionConfig,
  militaryPensionFieldConfigs,
  getMilitaryPensionProjectionColumns,
  militaryPensionDataKeys,
} from "@/configs/militaryPension"
import {
  mortgageAmortizationConfig,
  mortgageAmortizationFieldConfigs,
  mortgageAmortizationDataKeys,
  getMortgageAmortizationProjectionColumns,
} from "@/configs/mortgageAmortization"
import {
  retirementSavingsConfig,
  retirementSavingsFieldConfigs,
  getRetirementSavingsProjectionColumns,
  retirementSavingsDataKeys,
} from "@/configs/retirementSavings"
import {
  socialSecurityConfig,
  socialSecurityFieldConfigs,
  getSocialSecurityProjectionColumns,
  socialSecurityDataKeys,
} from "@/configs/socialSecurityBenefits"

import { getSummaryMessage as getCollegeTuitionSummaryMessage, useCollegeTuitionProjection } from "@/hooks/useCollegeTuitionProjection";
import { useFersPensionProjection } from "@/hooks/useFersPensionProjection";
import { useMilitaryPensionProjection } from "@/hooks/useMilitaryPensionProjection";
import { useMortgageAmortization } from "@/hooks/useMortgageAmortization";
import { getSummaryMessage as getRetirementSavingsSummaryMessage, useRetirementSavingsProjection } from "@/hooks/useRetirementSavingsProjection";
import { useSocialSecurityBenefitProjection } from "@/hooks/useSocialSecurityBenefitProjection";
import { CalculatorConfig } from "@/configs/calculatorConfig"
import { DataKeyOption } from "@/types/forms"

export type ProjectionResult<Row = any> = {
  rows: Row[];
  error?: string[] | null;
  generateTable: () => void;
};

export type YearlyProjectionResult<Row = any> = ProjectionResult<Row> & {
  yearlyRows: Row[];
};

export interface CalculatorEntry<FormValues = any, Row = any> {
  config: CalculatorConfig<FormValues>;
  fieldConfigs: any; 
  useProjection: (values: FormValues) => ProjectionResult<Row> | YearlyProjectionResult<Row>;
  getColumns: (editable?: boolean, isYearly?: boolean) => any;
  getSummary?: (rows: Row[], error?: string[] | null) => any;
  dataKeys: DataKeyOption<any>[];
}

export const calculatorRegistry: Record<string, CalculatorEntry<any>> = {
  "college-tuition": {
    config: collegeTuitionConfig,
    fieldConfigs: collegeTuitionFieldConfigs,
    useProjection: useCollegeTuitionProjection,
    getColumns: getCollegeTuitionProjectionColumns,
    getSummary: getCollegeTuitionSummaryMessage,
    dataKeys: collegeTuitionDataKeys,
  },
  "fers-pension": {
    config: fersPensionConfig,
    fieldConfigs: fersPensionFieldConfigs,
    useProjection: useFersPensionProjection,
    getColumns: getFersPensionProjectionColumns,
    dataKeys: fersPensionDataKeys,
  },
  "military-pension": {
    config: militaryPensionConfig,
    fieldConfigs: militaryPensionFieldConfigs,
    useProjection: useMilitaryPensionProjection,
    getColumns: getMilitaryPensionProjectionColumns,
    dataKeys: militaryPensionDataKeys,
  },
  "mortgage-amortization": {
    config: mortgageAmortizationConfig,
    fieldConfigs: mortgageAmortizationFieldConfigs,
    useProjection: useMortgageAmortization,
    getColumns: getMortgageAmortizationProjectionColumns,
    dataKeys: mortgageAmortizationDataKeys,
  },
  "retirement-savings": {
    config: retirementSavingsConfig,
    fieldConfigs: retirementSavingsFieldConfigs,
    useProjection: useRetirementSavingsProjection,
    getColumns: getRetirementSavingsProjectionColumns,
    getSummary: getRetirementSavingsSummaryMessage,
    dataKeys: retirementSavingsDataKeys,
  },
  "social-security": {
    config: socialSecurityConfig,
    fieldConfigs: socialSecurityFieldConfigs,
    useProjection: useSocialSecurityBenefitProjection,
    getColumns: getSocialSecurityProjectionColumns,
    dataKeys: socialSecurityDataKeys,
  },
};

export type CalculatorId = keyof typeof calculatorRegistry;