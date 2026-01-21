"use client";
import React from "react";
import { useEffect, useState } from "react";
import { Grid, Stack, Typography, Avatar, Box, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { IconDotsVertical, IconPencil } from "@tabler/icons-react";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/utils/supabase/client";

import { UserProfileService } from "supabase-auth-lib";
import { useUserAttributes } from "@/lib/userAttributes/hook";
import EditUserAttributesDialog from "./EditDialogs/EditUserAttributesDialog";
import LinearProgressWithLabel from "@/app/components/LinearProgressWithLabel";
import { IconFriends, IconUser } from "@tabler/icons-react";

type UserAttributesProps = {
  spouse?: boolean;
  onChange?: () => void;
};

const UserAttributes = ({ spouse = false, onChange, }: UserAttributesProps) => {
  const { user } = useSupabaseAuth();

  const [displayName, setDisplayName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  const {
    data: attrs,
    loading: attrsLoading,
    refresh: refreshAttrs,
    remove,
  } = useUserAttributes({ spouse: spouse });
  const { data: spouseData, exists: spouseExists, refresh: refreshSpouseAttrs, loading: spouseLoading } = useUserAttributes({ spouse: true });

  const [yearsLeft, setYearsLeft] = useState<number | null>(null);
  const [monthsLeft, setMonthsLeft] = useState<number | null>(null);
  const [progressPct, setProgressPct] = useState<number>(0);

  const [editingSpouse, setEditingSpouse] = useState(false);
  const [editing, setEditing] = useState(false);

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  
  // Load display name and avatar
  useEffect(() => {
    if (!user || spouse) return;

    const fetchProfile = async () => {
      const userProfileService = new UserProfileService(supabase);
      const profile = await userProfileService.getById(user.id);

      if (profile) {
        setDisplayName(profile.display_name || "");
        setAvatarUrl(profile.avatar_url || "");
      }
    };

    fetchProfile();
  }, [user, spouse]);

  // Retirement countdown math
  useEffect(() => {
    if (!attrs || !attrs.birthYear || !attrs.targetRetirementAge) return;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const retirementYear = attrs.birthYear + attrs.targetRetirementAge;
    const retirementMonth = 11

    const totalMonthsNow = currentYear * 12 + currentMonth;
    const totalMonthsRetirement = retirementYear * 12 + retirementMonth;

    const diffMonths = totalMonthsRetirement - totalMonthsNow;

    const yrsLeft = Math.floor(diffMonths / 12);
    const mosLeft = diffMonths % 12;

    setYearsLeft(yrsLeft);
    setMonthsLeft(mosLeft);

    // progress percentage
    const currentAge = currentYear - attrs.birthYear;
    setProgressPct(
      Math.round(
        Math.min(100, Math.max(0, (currentAge / attrs.targetRetirementAge) * 100))
      )
    );
  }, [attrs, spouse]);

  return (
    <DashboardCard 
      title={
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {spouse ? <IconFriends /> : <IconUser />}
          {spouse ? "Spouse Profile" : "Your Financial Profile"}
        </Box>
      }
      action={
      <>
        <IconButton
          size="small"
          color="info"
          aria-label="Add Source"
          onClick={(e) => setMenuAnchor(e.currentTarget)}
        >
          <IconDotsVertical />
        </IconButton>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem
            onClick={() => {
              setEditing(true);
              setMenuAnchor(null);
            }}
          >
            <ListItemIcon>
              <IconPencil fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Profile</ListItemText>
          </MenuItem>
          {!spouse && !spouseLoading && !spouseExists && (
            <MenuItem
              onClick={() => {
                setEditingSpouse(true); // open dialog specifically to add spouse
                setMenuAnchor(null);
              }}
            >
              <ListItemIcon>
                <IconFriends fontSize="small" />
              </ListItemIcon>
              <ListItemText>Add Spouse</ListItemText>
            </MenuItem>
          )}
          {spouse && (
            <MenuItem
              onClick={async () => {
                setMenuAnchor(null);
                if (!confirm("Are you sure you want to delete your spouse?")) return;

                try {
                  await remove(); 
                  refreshAttrs();
                  refreshSpouseAttrs();
                  onChange?.();
                } catch (err) {
                  console.error(err);
                  alert("Failed to delete spouse");
                }
              }}
            >
              <ListItemIcon>
                <IconFriends fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete Spouse</ListItemText>
            </MenuItem>
          )}
        </Menu>
      </>
    }>
      <EditUserAttributesDialog
        open={editing}
        onClose={() => setEditing(false)}
        onSaved={() => {
          refreshAttrs();       // refresh primary user
          refreshSpouseAttrs(); // refresh spouse data
          onChange?.();
        }}
        spouse={spouse} // edit the record this component represents
      />

      <EditUserAttributesDialog
        open={editingSpouse}
        onClose={() => setEditingSpouse(false)}
        onSaved={() => {
          refreshAttrs();       // refresh primary user
          refreshSpouseAttrs(); // refresh spouse data
          onChange?.();
        }}
        spouse={true} // always true, because this is the new spouse
      />
      <Grid container spacing={3}>
        <Grid size={{xs: 12, md: 12}}>
          {!spouse && (
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Avatar src={avatarUrl || undefined} sx={{ width: 36, height: 36 }} />
              <Typography variant="h6" fontWeight={600}>
                {displayName || "Loading..."}
              </Typography>
            </Stack>
          )}

          <Box>
            {attrsLoading && <Typography>Loading attributes…</Typography>}

            {!attrsLoading && attrs && (
              <Stack spacing={1}>
                <Typography variant="subtitle1">
                  <strong>Year of Birth:</strong> {attrs.birthYear ?? "—"}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Target Retirement Age:</strong> {attrs.targetRetirementAge ?? "—"}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Life Expectancy Age:</strong> {attrs.lifeExpectancyAge ?? "—"}
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
              </Stack>
            )}
          </Box>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default UserAttributes;