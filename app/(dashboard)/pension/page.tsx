'use client';
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
} from "@mui/material";

const PensionCalculator = () => {
  const currentYear = new Date().getFullYear();

  const [formValues, setFormValues] = useState({
    startYear: currentYear,
    myAge: 46,
    spouseAge: 45,
    startingSalary: 100000,
    annualRaise: 2,
    pensionStartAge: 58,
    yearsToProject: 20,
  });

  type TableRowData = {
  year: number;
  age: number;
  spouseAge: number;
  raisePercent: string;
  annualSalary: string;
  annualPension: string;
  monthlyPension: string;
};

  const [tableRows, setTableRows] = useState<TableRowData[]>([]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: parseFloat(value),
    });
  };

  const generateTable = () => {
    const {
      startYear,
      myAge,
      spouseAge,
      startingSalary,
      annualRaise,
      pensionStartAge,
      yearsToProject,
    } = formValues;

    let salary = startingSalary;
    const salaries = [];
    const rows = [];

    for (let i = 0; i < yearsToProject; i++) {
      const year = startYear + i;
      const age = myAge + i;
      const spouseCurrentAge = spouseAge + i;

      if (i > 0) salary *= 1 + annualRaise / 100;
      salaries.push(salary);

      const top3Avg = [...salaries]
        .sort((a, b) => b - a)
        .slice(0, 3)
        .reduce((sum, s) => sum + s, 0) / Math.min(i + 1, 3);

      const pension = age >= pensionStartAge ? 0.37 * top3Avg : 0;
      const monthlyPension = pension / 12;

      rows.push({
        year,
        age,
        spouseAge: spouseCurrentAge,
        raisePercent: `${annualRaise.toFixed(2)}%`,
        annualSalary: Math.round(salary).toLocaleString(),
        annualPension: pension > 0 ? Math.round(pension).toLocaleString() : "-",
        monthlyPension: pension > 0 ? Math.round(monthlyPension).toLocaleString() : "-",
      });
    }

    setTableRows(rows);
  };

  const inputFields = [
  { name: "startYear", label: "Start Year" },
  { name: "myAge", label: "Your Age" },
  { name: "spouseAge", label: "Spouse's Age" },
  { name: "startingSalary", label: "Starting Salary ($)" },
  { name: "annualRaise", label: "Estimated Annual Raise (%)" },
  { name: "pensionStartAge", label: "Pension Start Age" },
  { name: "yearsToProject", label: "Years to Project" },
] as const;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Pension Projection Tool
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {inputFields.map(({ name, label }) => (
    <Grid item xs={12} sm={6} md={3} key={name}>
      <TextField
        fullWidth
        type="number"
        name={name}
        label={label}
        value={formValues[name]}
        onChange={handleChange}
      />
    </Grid>
  ))}
      </Grid>

      <Button variant="contained" onClick={generateTable}>
        Generate Table
      </Button>

      {tableRows.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Year</TableCell>
                <TableCell>My Age</TableCell>
                <TableCell>Spouse's Age</TableCell>
                <TableCell>Estimated Raise %</TableCell>
                <TableCell>Annual Salary</TableCell>
                <TableCell>Annual Pension</TableCell>
                <TableCell>Monthly Pension</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.year}</TableCell>
                  <TableCell>{row.age}</TableCell>
                  <TableCell>{row.spouseAge}</TableCell>
                  <TableCell>{row.raisePercent}</TableCell>
                  <TableCell>{row.annualSalary}</TableCell>
                  <TableCell>{row.annualPension}</TableCell>
                  <TableCell>{row.monthlyPension}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default PensionCalculator;
