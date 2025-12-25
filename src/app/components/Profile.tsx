import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Avatar,
  Box,
  Menu,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography
} from "@mui/material";
import { IconUser, IconFriends, IconLayoutDashboard } from "@tabler/icons-react";
import { supabase } from '@/utils/supabase/client';
import { User } from "@supabase/supabase-js";
import { useRouter } from 'next/navigation';
import {AuthLogout} from "supabase-auth-lib";
import {UserProfileService} from "supabase-auth-lib"
type ProfileProps = {
  user: User;
  showDashboardLink?: boolean;
};

const Profile: React.FC<ProfileProps> = ({ user, showDashboardLink = true }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (user) {
          const userProfileService = new UserProfileService(supabase);
          const profile = await userProfileService.getById(user.id);
          if (profile) {
            setDisplayName(profile.display_name);
            setAvatarUrl(profile.avatar_url || undefined);
          } 
          else {
            setDisplayName(user.user_metadata?.full_name);
            setAvatarUrl(user.user_metadata?.avatar_url || undefined);
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
      }
    };
    loadProfile();
  }, [user]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const flag = false;
  return (
    <Box>
      <IconButton
        size="large"
        aria-label="User menu"
        color="inherit"
        onClick={handleClick}
      >
        <Avatar
          src={avatarUrl || undefined} 
          alt={user.email || "User"}
          sx={{ width: 32, height: 32 }}
        >
          {/* fallback initials if no image */}
          {!avatarUrl && displayName
            ? displayName.charAt(0).toUpperCase()
            : null}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": { width: "240px" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            px: 3,
            pb: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Avatar src={avatarUrl || undefined} sx={{ width: 72, height: 72 }}>
            {displayName.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 1.5 }}>
            {displayName}
          </Typography>
          <Box sx={{ mt: 2, width: "100%" }}>
            <AuthLogout
              onSignOutSuccess={() => router.push("/authentication/logout")}
              onSignOutError={(err) => alert(`Logout failed: ${err.message}`)}
            />
          </Box>
        </Box>
        {showDashboardLink && (
        <MenuItem component={Link} href="/dashboard" onClick={handleClose}>
          <ListItemIcon>
            <IconLayoutDashboard width={20} />
          </ListItemIcon>
          <ListItemText>My Dashboard</ListItemText>
        </MenuItem>
        )}
        <MenuItem component={Link} href="/profile" onClick={handleClose}>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
        {/*}
        <MenuItem component={Link} href="/partner" onClick={handleClose}>
          <ListItemIcon>
            <IconFriends width={20} />
          </ListItemIcon>
          <ListItemText>Linked Partner Account</ListItemText>
        </MenuItem>
        */}
      </Menu>
    </Box>
  );
};

export default Profile;
