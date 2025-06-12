// src/components/Header.tsx
import React, { useState, useEffect, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  WifiChannel as ChannelIcon,
  Message as MessageIcon,
  Logout as LogoutIcon,
  AccountCircle,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../lib/api";
import { AuthContext } from "../App";

const headerItems = [
  { icon: <HomeIcon />, label: "Dashboard", path: "/" },
  { icon: <PersonIcon />, label: "Users", path: "/users" },
  { icon: <SettingsIcon />, label: "Roles", path: "/roles" },
  { icon: <ChannelIcon />, label: "Channels", path: "/channels" },
  { icon: <MessageIcon />, label: "Messages", path: "/messages" },
];

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuth } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    let mounted = true;
    const fetchUser = async () => {
      try {
        const user = await api("/auth/me");
        if (mounted) {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
    
    return () => {
      mounted = false;
    };
  }, []);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await api("/auth/logout", { method: "POST" });
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: "#393E46",
        borderRadius: 3,
        boxShadow: 3,
        m: 2,
        width: "calc(100% - 48px)",
      }}
      elevation={0}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          minHeight: "64px !important",
        }}
      >
        {/* Navigation Items */}
        <Box sx={{ display: "flex", gap: 1 }}>
          {headerItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.label}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 3,
                  px: 2,
                  minHeight: 40,
                  transition: "all 0.2s",
                  background: isActive ? "#b39ddb" : "transparent",
                  "&:hover": { 
                    background: isActive ? "#b39ddb" : "rgba(179, 157, 219, 0.3)",
                  },
                  color: isActive ? "#222" : "#e0e0e0",
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: 1, color: isActive ? "#222" : "#e0e0e0" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    ".MuiListItemText-primary": {
                      fontSize: 16,
                      fontWeight: isActive ? 600 : 500,
                      letterSpacing: 0.2,
                      whiteSpace: "nowrap",
                    },
                  }}
                />
              </ListItemButton>
            );
          })}
        </Box>

        {/* User Profile */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography sx={{ color: "#e0e0e0", fontSize: 14 }}>
            {currentUser?.full_name || "Admin"}
          </Typography>
          <IconButton
            onClick={handleProfileMenuOpen}
            size="small"
            sx={{ 
              p: 0.5,
              "&:hover": { bgcolor: "rgba(179, 157, 219, 0.3)" }
            }}
          >
            <Avatar sx={{ width: 36, height: 36, bgcolor: "#b39ddb", color: "#222" }}>
              {currentUser?.full_name?.[0] || "A"}
            </Avatar>
          </IconButton>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={() => {
            handleProfileMenuClose();
            navigate("/admin-profile");
          }}>
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            <ListItemText>My Profile</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;