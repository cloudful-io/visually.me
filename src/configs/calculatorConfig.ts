import { ComponentType } from "react";

export type CalculatorConfig<FormValues = any> = {
  id: string;
  icon: ComponentType<any>;
  shortTitle: string;
  calculatorTitle: string;
  scenarioTitle?: string;
  chartTitle?: string;
  calculatorDescription: string;
  scenarioDescription?: string;
  calculatorRoute: string;
  scenarioRoute?: string;

  assumptions?: (string | React.ReactNode)[];
  initialFormValues?: FormValues;

  ui?: {
    showScenarioComparison?: boolean;
    showTimeline?: boolean;
    showCharts?: boolean;
  };
};
