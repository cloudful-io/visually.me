"use client";
import React from "react";
import { ProjectionDataGrid } from "@/app/(DashboardLayout)/components/shared/ProjectionDataGrid";

type TestRow = {
  year: number;
  firstName: string;
  lastName: string;
  age: number;
  salary: number;
  hasOverride?: boolean;
};

export default function TestPage() {
  const rows: TestRow[] = [
    { year: 2023, firstName: "Jon", lastName: "Snow", age: 30, salary: 50000 },
    { year: 2024, firstName: "Arya", lastName: "Stark", age: 18, salary: 60000, hasOverride: true },
    { year: 2025, firstName: "Cersei", lastName: "Lannister", age: 45, salary: 75000, hasOverride: true },
  ];

  const columns = [
    { key: "firstName" as keyof TestRow, label: "First Name", editable: true },
    { key: "lastName" as keyof TestRow, label: "Last Name", editable: true },
    { key: "age" as keyof TestRow, label: "Age", editable: true },
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
