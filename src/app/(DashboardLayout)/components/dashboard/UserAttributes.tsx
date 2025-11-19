"use client";
import React from "react";
import { useEffect, useState } from "react";
import { Grid, Stack, Typography, Avatar, Box, IconButton } from "@mui/material";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/utils/supabase/client";

import { UserProfileService } from "supabase-auth-lib";
import { useUserAttributes } from "@/lib/userAttributes/hook";
import EditUserAttributesDialog from "./EditDialogs/EditUserAttributesDialog";
import LinearProgressWithLabel from "@/app/components/LinearProgressWithLabel";
import { IconEdit, IconUser } from "@tabler/icons-react";

const UserAttributes = () => {
  const { user } = useSupabaseAuth();

  const [displayName, setDisplayName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  const { data: attrs, loading: attrsLoading, refresh: refreshAttrs } = useUserAttributes();

  const [yearsLeft, setYearsLeft] = useState<number | null>(null);
  const [monthsLeft, setMonthsLeft] = useState<number | null>(null);
  const [progressPct, setProgressPct] = useState<number>(0);

  const [openEditDialog, setOpenEditDialog] = React.useState(false);


  // Load display name and avatar
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const userProfileService = new UserProfileService(supabase);
      const profile = await userProfileService.getById(user.id);

      if (profile) {
        setDisplayName(profile.display_name || "");
        setAvatarUrl(profile.avatar_url || "");
      }
    };

    fetchProfile();
  }, [user]);

  // Retirement countdown math
  useEffect(() => {
    if (!attrs || !attrs.birthYear || !attrs.targetRetirementAge) return;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const retirementYear = attrs.birthYear + attrs.targetRetirementAge;

    const totalMonthsNow = currentYear * 12 + currentMonth;
    const totalMonthsRetirement = retirementYear * 12;

    const diffMonths = totalMonthsRetirement - totalMonthsNow;

    const yrsLeft = Math.floor(diffMonths / 12);
    const mosLeft = diffMonths % 12;

    setYearsLeft(yrsLeft);
    setMonthsLeft(mosLeft);

    // progress percentage
    const currentAge = currentYear - attrs.birthYear;
    const pct = Math.min(
      100,
      Math.max(0, (currentAge / attrs.targetRetirementAge) * 100)
    );

    setProgressPct(Math.round(pct));
  }, [attrs]);

  return (
    <DashboardCard 
      title={
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconUser />
          Financial Profile
        </Box>
      }
      action={<IconButton size="small" color="primary" aria-label="Edit" aria-haspopup="dialog" onClick={() => setOpenEditDialog(true)}><IconEdit/></IconButton>}
    >
      <EditUserAttributesDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        onSaved={refreshAttrs}    // ← NEW LINE
      />
      <Grid container spacing={3}>
        <Grid size={{xs: 12, md: 12}}>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Avatar src={avatarUrl || undefined} sx={{ width: 36, height: 36 }} />
            <Stack>
              <Typography variant="h6" fontWeight={600}>
                {displayName || "Loading..."}
              </Typography>
            </Stack>
          </Stack>

          <Box mt={2}>
            {attrsLoading && <Typography>Loading attributes…</Typography>}

            {!attrsLoading && attrs && (
              <Stack spacing={1}>
                <Typography variant="subtitle1">
                  <strong>Year of Birth:</strong> {attrs.birthYear ?? "—"}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Target Retirement Age:</strong> {attrs.targetRetirementAge ?? "—"}
                </Typography>
                <Box width="100%">
                  <LinearProgressWithLabel
                    value={progressPct}
                    label={
                        yearsLeft !== null && monthsLeft !== null
                        ? `${yearsLeft}y ${monthsLeft}m until retirement`
                        : "--"
                    }
                  />
                </Box>
                <Typography variant="subtitle1">
                  <strong>Year to Start Projecting Data:</strong> {attrs.startYear ?? "—"}
                </Typography>
              </Stack>
            )}
          </Box>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default UserAttributes;
