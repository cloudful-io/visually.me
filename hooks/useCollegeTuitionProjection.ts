import { useState } from 'react';
import {
  CollegeTuitionInput,
  CollegeTuitionProjectionRow,
  calculateCollegeTuitionProjection,
} from 'financial-calcs';

export function useCollegeTuitionProjection(formValues: CollegeTuitionInput) {
  const [rows, setRows] = useState<CollegeTuitionProjectionRow[]>([]);

  const generateTable = () => {
    const results = calculateCollegeTuitionProjection(formValues);
    setRows(results);
  };

  return { rows, generateTable };
}