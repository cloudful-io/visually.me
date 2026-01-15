import {
  fersPensionConfig,
  fersPensionFieldConfigs,
} from "@/configs/fersPension"
import {
  militaryPensionConfig,
  militaryPensionFieldConfigs,
} from "@/configs/militaryPension"
import {
  retirementSavingsConfig,
  retirementSavingsFieldConfigs,
} from "@/configs/retirementSavings"
import {
  socialSecurityConfig,
  socialSecurityFieldConfigs,
} from "@/configs/socialSecurityBenefits"

import { CalculatorConfig } from "@/configs/calculatorConfig"
import { FormFieldConfig } from "@/types/forms"

export interface IncomeSourceEntry<FormValues = any, Row = any, Context = any> {
  config: CalculatorConfig<FormValues>;
  fieldConfigs: FormFieldConfig<FormValues, Context>[];
}

export const incomeSourceRegistry: Record<string, IncomeSourceEntry<any>> = {
  "fers-pension": {
    config: fersPensionConfig,
    fieldConfigs: fersPensionFieldConfigs,
  },
  "military-pension": {
    config: militaryPensionConfig,
    fieldConfigs: militaryPensionFieldConfigs,
  },
  "retirement-savings": {
    config: retirementSavingsConfig,
    fieldConfigs: retirementSavingsFieldConfigs,
  },
  "social-security": {
    config: socialSecurityConfig,
    fieldConfigs: socialSecurityFieldConfigs,
  },
};

export type IncomeSourceId = keyof typeof incomeSourceRegistry;