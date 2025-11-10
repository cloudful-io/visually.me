'use client';

import * as React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { DataGrid } from '@mui/x-data-grid';

import { FormFields } from '@/components/FormFields';
import { FormFieldConfig } from '@/types/forms';
import { RetirementSavingsInput } from 'financial-calcs';
import { retirementSavingsFieldConfigs } from '@/configs/retirementSavingsFields';
import { useSession } from "next-auth/react";

// import your other pension/social security configs
// import { socialSecurityFieldConfigs } from '@/configs/socialSecurityFields';
// import { pensionFieldConfigs } from '@/configs/pensionFields';

// ------------ Types ------------
type IncomeType = 'retirementSavings' | 'socialSecurity' | 'pension';

type IncomeSource = {
  id: number;
  name: string;
  amount: number;
  frequency: string;
  startAge: number;
  endAge: number;
  color: string;
  key: string;
};


// ------------ Field Config Map ------------
const fieldConfigMap: Record<IncomeType, FormFieldConfig<any, { isAuthenticated: boolean }>[]> = {
  retirementSavings: retirementSavingsFieldConfigs,
  socialSecurity: [], // replace with your actual configs
  pension: [], // replace with your actual configs
};

const Dashboard = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = !!session;

  // ------------ State ------------
  const [incomeSources, setIncomeSources] = React.useState<IncomeSource[]>([]);
  const [projectionData, setProjectionData] = React.useState<any[]>([]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedIncomeType, setSelectedIncomeType] =
    React.useState<IncomeType | null>(null);

  const [formValues, setFormValues] = React.useState<any>({});
  const [editingIncome, setEditingIncome] = React.useState<IncomeSource | null>(
    null,
  );

  // ------------ Handlers ------------
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectIncomeType = (type: IncomeType) => {
    setSelectedIncomeType(type);
    setFormValues({});
    setEditingIncome(null);
    setIsDialogOpen(true);
    setAnchorEl(null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingIncome(null);
    setSelectedIncomeType(null);
    setFormValues({});
  };

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormValues((prev: any) => ({
      ...prev,
      [name]: isNaN(Number(value)) ? value : Number(value),
    }));
  };

  const handleSaveIncome = () => {
    if (!selectedIncomeType) return;

    let newIncome: IncomeSource;

    if (selectedIncomeType === 'retirementSavings') {
      const vals = formValues as RetirementSavingsInput;
      newIncome = {
        id: editingIncome?.id ?? Date.now(),
        name: '401k',
        amount: vals.initialContribution ?? 0,
        frequency: 'yearly',
        startAge: vals.withdrawStartAge ?? 65,
        endAge: (vals.withdrawStartAge ?? 65) + (vals.yearsToProject ?? 20),
        color: editingIncome?.color ?? `hsl(${Math.random() * 360}, 70%, 50%)`,
        key: `income-${Date.now()}`,
      };
    } else if (selectedIncomeType === 'socialSecurity') {
      // TODO: map from your SS config input to IncomeSource
      newIncome = {
        id: editingIncome?.id ?? Date.now(),
        name: 'Social Security',
        amount: 20000,
        frequency: 'yearly',
        startAge: 67,
        endAge: 90,
        color: editingIncome?.color ?? `hsl(${Math.random() * 360}, 70%, 50%)`,
        key: `income-${Date.now()}`,
      };
    } else {
      // TODO: map from your Pension config input to IncomeSource
      newIncome = {
        id: editingIncome?.id ?? Date.now(),
        name: 'FERS Pension',
        amount: 30000,
        frequency: 'yearly',
        startAge: 62,
        endAge: 90,
        color: editingIncome?.color ?? `hsl(${Math.random() * 360}, 70%, 50%)`,
        key: `income-${Date.now()}`,
      };
    }

    setIncomeSources((prev) =>
      editingIncome
        ? prev.map((inc) => (inc.id === editingIncome.id ? newIncome : inc))
        : [...prev, newIncome],
    );

    handleCloseDialog();
  };

  const handleEditIncome = (income: IncomeSource) => {
    setEditingIncome(income);
    // TODO: populate formValues back from income if needed
    setSelectedIncomeType('retirementSavings'); // pick correct type
    setIsDialogOpen(true);
  };

  const handleDeleteIncome = (id: number) => {
    setIncomeSources((prev) => prev.filter((inc) => inc.id !== id));
  };

  // ------------ Effects (recalculate projection) ------------
  React.useEffect(() => {
    // TODO: implement actual projection logic
    setProjectionData(
      Array.from({ length: 30 }).map((_, i) => ({
        age: 60 + i,
        expenses: 50000,
        ...incomeSources.reduce((acc, source) => {
          if (i + 60 >= source.startAge && i + 60 <= source.endAge) {
            acc[source.key] = source.amount;
          }
          return acc;
        }, {} as Record<string, number>),
      })),
    );
  }, [incomeSources]);

  // ------------ Render ------------
  return (
    <Box display="flex" flexDirection="column" gap={4} p={3}>
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        Retirement Income Projection
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Here’s how your projected retirement income looks over time. You can add,
        edit, or remove sources.
      </Typography>

      {/* Timeline Chart */}
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Income Timeline
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={projectionData}>
            <XAxis dataKey="age" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            {incomeSources.map((source) => (
              <Area
                key={source.id}
                type="monotone"
                dataKey={source.key}
                stackId="total"
                stroke={source.color}
                fill={source.color}
              />
            ))}
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#FF0000"
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Paper>

      {/* Income Sources Table */}
      <Paper elevation={2} sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Income Sources</Typography>
          <div>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenMenu}
            >
              Add Income Source
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={() => handleSelectIncomeType('retirementSavings')}>
                Retirement Savings / 401k
              </MenuItem>
              <MenuItem onClick={() => handleSelectIncomeType('socialSecurity')}>
                Social Security
              </MenuItem>
              <MenuItem onClick={() => handleSelectIncomeType('pension')}>
                FERS Pension
              </MenuItem>
            </Menu>
          </div>
        </Box>

        <DataGrid
          rows={incomeSources}
          columns={[
            { field: 'name', headerName: 'Source', flex: 1 },
            { field: 'amount', headerName: 'Amount ($)', flex: 1 },
            { field: 'frequency', headerName: 'Frequency', flex: 1 },
            { field: 'startAge', headerName: 'Start Age', flex: 1 },
            { field: 'endAge', headerName: 'End Age', flex: 1 },
            {
              field: 'actions',
              headerName: 'Actions',
              flex: 1,
              renderCell: (params) => (
                <Box display="flex" gap={1}>
                  <Button
                    size="small"
                    onClick={() => handleEditIncome(params.row)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteIncome(params.row.id)}
                  >
                    Delete
                  </Button>
                </Box>
              ),
            },
          ]}
          autoHeight
          //pageSize={5}
          //rowsPerPageOptions={[5, 10]}
        />
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {editingIncome ? 'Edit Income Source' : 'Add Income Source'}
        </DialogTitle>
        <DialogContent dividers>
          {selectedIncomeType && (
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <FormFields
                fields={fieldConfigMap[selectedIncomeType]}
                values={formValues}
                context={{ isAuthenticated }} // must match the type in FormFieldConfig
                onChange={handleFormChange}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveIncome}>
            {editingIncome ? 'Save Changes' : 'Add Income'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
