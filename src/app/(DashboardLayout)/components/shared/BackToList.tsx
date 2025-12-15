"use client";

import { Breadcrumbs, Button, Link, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

export interface BackToListProps {
  href: string;
  listLabel: string;
  currentLabel?: string;
  variant?: "button" | "breadcrumbs";
  mb?: number;
}

export default function BackToList({
  href,
  listLabel,
  currentLabel,
  variant = "button",
  mb = 2,
}: BackToListProps) {
  const router = useRouter();

  if (variant === "breadcrumbs") {
    return (
      <Breadcrumbs sx={{ mb }}>
        <Link
          underline="hover"
          color="inherit"
          sx={{ cursor: "pointer" }}
          onClick={() => router.push(href)}
        >
          {listLabel}
        </Link>
        {currentLabel && (
          <Typography color="text.primary">
            {currentLabel}
          </Typography>
        )}
      </Breadcrumbs>
    );
  }

  return (
    <Button
      startIcon={<KeyboardBackspaceIcon/>}
      onClick={() => router.push(href)}
      sx={{ mb }}
    >
      Back to {listLabel}
    </Button>
  );
}
