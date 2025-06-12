// src/components/Header.tsx
import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";

const headerItems = [
  { icon: <HomeIcon />, label: "Dashboard", path: "/" },
  { icon: <PersonIcon />, label: "Users", path: "/users" },
  { icon: <SettingsIcon />, label: "Roles", path: "/roles" },
];

const Header: React.FC = () => {
  const navigate = useNavigate();

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
          justifyContent: "center",
          gap: 2,
          flexWrap: "wrap",
          minHeight: "64px !important",
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          {headerItems.map((item) => (
            <ListItemButton
              key={item.label}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 3,
                px: 2,
                minHeight: 40,
                transition: "background 0.2s",
                "&:hover": { background: "#b39ddb" },
                color: "#222",
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: 1, color: "#222" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  ".MuiListItemText-primary": {
                    fontSize: 16,
                    fontWeight: 500,
                    letterSpacing: 0.2,
                    whiteSpace: "nowrap",
                  },
                }}
              />
            </ListItemButton>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
