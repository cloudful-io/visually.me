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
} from "@mui/material";
import { IconUser, IconLayoutDashboard } from "@tabler/icons-react";
import { supabase } from '@/utils/supabase/client';
import { User } from "@supabase/supabase-js";
import { useRouter } from 'next/navigation';
import {AuthLogout} from "supabase-auth-lib";
import {UserProfileService} from "supabase-auth-lib"
type ProfileProps = {
  user: User;
};

const Profile: React.FC<ProfileProps> = ({ user }) => {
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
          src={avatarUrl || undefined} // provider image if available
          alt={user.email || "User"}
          sx={{ width: 32, height: 32 }}
        >
          {/* fallback initials if no image */}
          {!avatarUrl && user.email
            ? user.email.charAt(0).toUpperCase()
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
          "& .MuiMenu-paper": { width: "200px" },
        }}
      >
        <MenuItem component={Link} href="/dashboard" onClick={handleClose}>
          <ListItemIcon>
            <IconLayoutDashboard width={20} />
          </ListItemIcon>
          <ListItemText>My Dashboard</ListItemText>
        </MenuItem>
        <MenuItem component={Link} href="/profile" onClick={handleClose}>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
        <Box mt={1} py={1} px={2}>
          <AuthLogout
            onSignOutSuccess={() => {
              router.push("/authentication/logout");
            }}
            onSignOutError={(err) => alert(`Logout failed: ${err.message}`)}
          />
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
