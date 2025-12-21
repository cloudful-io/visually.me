import {
  collegeTuitionConfig,
  collegeTuitionFieldConfigs,
  getCollegeTuitionProjectionColumns,
  getCollegeTuitionScenarioColumns,
  collegeTuitionDataKeys,
} from "@/configs/collegeTuition"
import {
  fersPensionConfig,
  fersPensionFieldConfigs,
  getFersPensionProjectionColumns,
  getFersPensionScenarioColumns,
  fersPensionDataKeys,
} from "@/configs/fersPension"
import {
  militaryPensionConfig,
  militaryPensionFieldConfigs,
  getMilitaryPensionProjectionColumns,
  getMilitaryPensionScenarioColumns,
  militaryPensionDataKeys,
} from "@/configs/militaryPension"
import {
  mortgageAmortizationConfig,
  mortgageAmortizationFieldConfigs,
  getMortgageAmortizationProjectionColumns,
  getMortgageAmortizationScenarioColumns,
  mortgageAmortizationDataKeys,
} from "@/configs/mortgageAmortization"
import {
  retirementSavingsConfig,
  retirementSavingsFieldConfigs,
  getRetirementSavingsProjectionColumns,
  getRetirementSavingsScenarioColumns,
  retirementSavingsDataKeys,
} from "@/configs/retirementSavings"
import {
  socialSecurityConfig,
  socialSecurityFieldConfigs,
  getSocialSecurityProjectionColumns,
  getSocialSecurityScenarioColumns,
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
import { FormFieldConfig } from "@/types/forms"

export type ProjectionResult<Row = any> = {
  rows: Row[];
  error?: string[] | null;
  generateTable: () => void;
};

export type YearlyProjectionResult<Row = any> = ProjectionResult<Row> & {
  yearlyRows: Row[];
};

export interface CalculatorEntry<FormValues = any, Row = any, Context = any> {
  config: CalculatorConfig<FormValues>;
  fieldConfigs: FormFieldConfig<FormValues, Context>[];
  useProjection: (values: FormValues) => ProjectionResult<Row> | YearlyProjectionResult<Row>;
  getColumns: (editable?: boolean, isYearly?: boolean) => any;
  getScenarioColumns?: () => any;
  getSummary?: (rows: Row[], error?: string[] | null) => any;
  dataKeys: DataKeyOption<any>[];
}

export const calculatorRegistry: Record<string, CalculatorEntry<any>> = {
  "college-tuition": {
    config: collegeTuitionConfig,
    fieldConfigs: collegeTuitionFieldConfigs,
    useProjection: useCollegeTuitionProjection,
    getColumns: getCollegeTuitionProjectionColumns,
    getScenarioColumns: getCollegeTuitionScenarioColumns,
    getSummary: getCollegeTuitionSummaryMessage,
    dataKeys: collegeTuitionDataKeys,
  },
  "fers-pension": {
    config: fersPensionConfig,
    fieldConfigs: fersPensionFieldConfigs,
    useProjection: useFersPensionProjection,
    getColumns: getFersPensionProjectionColumns,
    getScenarioColumns: getFersPensionScenarioColumns,
    dataKeys: fersPensionDataKeys,
  },
  "military-pension": {
    config: militaryPensionConfig,
    fieldConfigs: militaryPensionFieldConfigs,
    useProjection: useMilitaryPensionProjection,
    getColumns: getMilitaryPensionProjectionColumns,
    getScenarioColumns: getMilitaryPensionScenarioColumns,
    dataKeys: militaryPensionDataKeys,
  },
  "mortgage-amortization": {
    config: mortgageAmortizationConfig,
    fieldConfigs: mortgageAmortizationFieldConfigs,
    useProjection: useMortgageAmortization,
    getColumns: getMortgageAmortizationProjectionColumns,
    getScenarioColumns: getMortgageAmortizationScenarioColumns,
    dataKeys: mortgageAmortizationDataKeys,
  },
  "retirement-savings": {
    config: retirementSavingsConfig,
    fieldConfigs: retirementSavingsFieldConfigs,
    useProjection: useRetirementSavingsProjection,
    getColumns: getRetirementSavingsProjectionColumns,
    getScenarioColumns: getRetirementSavingsScenarioColumns,
    getSummary: getRetirementSavingsSummaryMessage,
    dataKeys: retirementSavingsDataKeys,
  },
  "social-security": {
    config: socialSecurityConfig,
    fieldConfigs: socialSecurityFieldConfigs,
    useProjection: useSocialSecurityBenefitProjection,
    getColumns: getSocialSecurityProjectionColumns,
    getScenarioColumns: getSocialSecurityScenarioColumns,
    dataKeys: socialSecurityDataKeys,
  },
};

export type CalculatorId = keyof typeof calculatorRegistry;