'use client';
import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { FormControlLabel, Switch } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Papa from "papaparse";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type FormValues = {
  startYear: number;
  birthYear: number;
  initialBalance: number;
  initialContribution: number;
  estimatedYield: number;
  estimatedWithdrawRate: number;
  contributionIncreaseRate: number;
  withdrawStartAge: number;
  yearsToProject: number;
};

type TableRowData = {
  year: number;
  age: number;
  beginningBalance: number;
  contribution: number;
  yieldPercent: number;
  withdrawRate: number;
  monthlyWithdraw: number;
  annualWithdraw: number;
  endingBalance: number;
};

const exportToCSV = (data: any[], filename: string) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.click();
};

const RetirementProjection = () => {
  const theme = useTheme();

  const [showChart, setShowChart] = useState(true);

  const currentYear = new Date().getFullYear();

  const [formValues, setFormValues] = useState<FormValues>({
    startYear: currentYear,
    birthYear: 1970,
    initialBalance: 200000,
    initialContribution: 23000,
    estimatedYield: 6,
    estimatedWithdrawRate: 5,
    contributionIncreaseRate: 2,
    withdrawStartAge: 60,
    yearsToProject: 40,
  });

  const [tableRows, setTableRows] = useState<TableRowData[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  const generateTable = () => {
    const {
      startYear,
      birthYear,
      initialBalance,
      initialContribution,
      estimatedYield,
      estimatedWithdrawRate,
      contributionIncreaseRate,
      withdrawStartAge,
      yearsToProject,
    } = formValues;

    let balance = initialBalance;
    let contribution = initialContribution;
    const rows: TableRowData[] = [];

    for (let i = 0; i < yearsToProject; i++) {
      const year = startYear + i;
      const age = year - birthYear;
      const isWithdrawing = age >= withdrawStartAge;

      if (i > 0) {
        if (year < (birthYear+withdrawStartAge))
          contribution *= 1 + contributionIncreaseRate / 100;
        else
          contribution = 0;
      }

      const withdrawRate = isWithdrawing ? estimatedWithdrawRate : 0;
      const annualWithdraw = isWithdrawing
        ? (withdrawRate / 100) * balance
        : 0;
      const monthlyWithdraw = annualWithdraw / 12;

      const beginningBalance = balance;
      const yieldAmount = (estimatedYield / 100) * beginningBalance;

      balance = beginningBalance + yieldAmount + contribution - annualWithdraw;

      rows.push({
        year,
        age,
        beginningBalance,
        contribution,
        yieldPercent: estimatedYield,
        withdrawRate,
        monthlyWithdraw,
        annualWithdraw,
        endingBalance: balance,
      });
    }

    setTableRows(rows);
  };

  const inputFields = [
    { name: "startYear", label: "Start Year" },
    { name: "birthYear", label: "Birth Year" },
    { name: "initialBalance", label: "Initial Balance ($)" },
    { name: "initialContribution", label: "Initial Contribution ($)" },
    { name: "estimatedYield", label: "Estimated Annual Yield (%)" },
    { name: "estimatedWithdrawRate", label: "Estimated Withdraw Rate (%)" },
    { name: "contributionIncreaseRate", label: "Contribution Increase Rate (%)" },
    { name: "withdrawStartAge", label: "Withdraw Start Age" },
    { name: "yearsToProject", label: "Years to Project" },
  ] as const;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Retirement Savings and Withdrawal Projection
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {inputFields.map(({ name, label }) => (
          <Grid size={{ xs: 12, md: 3, sm: 6 }} key={name}>
            <TextField
              fullWidth
              type="number"
              name={name}
              label={label}
              value={formValues[name as keyof FormValues]}
              onChange={handleChange}
            />
          </Grid>
        ))}
        <FormControlLabel
          control={
            <Switch
              checked={showChart}
              onChange={(e) => setShowChart(e.target.checked)}
            />
          }
          label="Show Chart"
        />
      </Grid>

      <Button variant="contained" onClick={generateTable}>
        Calculate
      </Button>

      <Button variant="outlined" sx={{ ml: 2 }} onClick={() => exportToCSV(tableRows, "retirement_projection.csv")}>
        Export CSV
      </Button>
      {showChart && tableRows.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            End of Year Balance Over Time
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tableRows}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })}`} />
              <Bar dataKey="endingBalance" fill={theme.palette.primary.main} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
      {tableRows.length > 0 && (
        <Box sx={{ width: '100%', overflowX: 'auto' }}>

        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Year</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>My Age</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Beginning Balance ($)</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Contribution ($)</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Yield %</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Withdraw %</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Monthly Withdraw ($)</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Annual Withdraw ($)</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Ending Balance ($)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows.map((row, i) => (
                <TableRow
                  key={i}
                  sx={
                    row.year === currentYear
                      ? { backgroundColor: theme.palette.action.selected } 
                      : {}
                  }
                >
                  <TableCell>{row.year}</TableCell>
                  <TableCell>{row.age}</TableCell>
                  <TableCell>
                    {row.beginningBalance.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </TableCell>
                  <TableCell>
                    {row.contribution.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </TableCell>
                  <TableCell>{row.yieldPercent}%</TableCell>
                  <TableCell>{row.withdrawRate}%</TableCell>
                  <TableCell>
                    {row.monthlyWithdraw.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </TableCell>
                  <TableCell>
                    {row.annualWithdraw.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </TableCell>
                  <TableCell>
                    {row.endingBalance.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default RetirementProjection;
