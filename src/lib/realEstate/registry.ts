import {
  realEstateFieldConfigs,
} from "@/configs/realEstate"

import { FormFieldConfig } from "@/types/forms"

export interface RealEstateEntry<FormValues = any, Row = any, Context = any> {
  fieldConfigs: FormFieldConfig<FormValues, Context>[];
}

export const realEstateRegistry: Record<string, RealEstateEntry<any>> = {
  "real-estate": {
    fieldConfigs: realEstateFieldConfigs,
  },
};

export type RealEstateId = keyof typeof realEstateRegistry;