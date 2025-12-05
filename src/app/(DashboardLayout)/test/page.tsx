"use client";
import React from "react";
import { ProjectionDataGrid } from "@/app/(DashboardLayout)/components/shared/ProjectionDataGrid";

type TestRow = {
  year: number;
  firstName: string;
  lastName: string;
  age: number;
  age1: number;
  age2: number;
  age3: number;
  salary: number;
  hasOverride?: boolean;
};

export default function TestPage() {
  const rows: TestRow[] = [
    { year: 2023, firstName: "Jon", lastName: "Snow", age: 30, age1: 1000, age2: 1000, age3: 1000, salary: 50000 },
    { year: 2024, firstName: "Arya", lastName: "Stark", age: 18, age1: 1000, age2: 1000, age3: 1000,salary: 60000, hasOverride: true },
    { year: 2025, firstName: "Cersei", lastName: "Lannister", age: 45, age1: 1000, age2: 1000, age3: 1000,salary: 75000, hasOverride: true },
  ];

  const columns = [
    { key: "firstName" as keyof TestRow, label: "First Name", editable: true },
    { key: "lastName" as keyof TestRow, label: "Last Name", editable: true },
    { key: "age" as keyof TestRow, label: "Age", editable: true },
    { key: "age1" as keyof TestRow, label: "Age 1", editable: true },
    { key: "age2" as keyof TestRow, label: "Age 2", editable: true },
    { key: "age3" as keyof TestRow, label: "Age 3", editable: true },
    { key: "salary" as keyof TestRow, label: "Salary", editable: true, currency: true },
  ];

  const handleRowEditSave = (year: number, patch: Partial<TestRow>) => {
    console.log("Save row for year:", year, patch);
  };

  const handleRemoveOverride = (year: number) => {
    console.log("Remove override for year:", year);
  };

  return (
      <ProjectionDataGrid
        rows={rows}
        columns={columns}
        highlightYear={2024}
        onRowEditSave={handleRowEditSave}
        onRemoveOverride={handleRemoveOverride}
      />
  );
}
