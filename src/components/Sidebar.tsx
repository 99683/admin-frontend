import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SettingsIcon from "@mui/icons-material/Settings";
import TerminalIcon from "@mui/icons-material/Terminal";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";



const sidebarItems = [
    { icon: <HomeIcon />, label: "Dashboard", path: "/" },
    { icon: <PersonIcon />, label: "Users", path: "/users" },
    { icon: <CalendarTodayIcon />, label: "Calendar", path: "/calendar" },
    { icon: <SettingsIcon />, label: "Logs", path: "/logs" },
    { icon: <TerminalIcon />, label: "Terminal", path: "/terminal" },
  ];
  

const SIDEBAR_WIDTH_EXPANDED = 180;
const SIDEBAR_WIDTH_COLLAPSED = 70;

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();


  return (
    <Box
      sx={{
        height: "100vh",
        background: "#948979",
        borderRadius: "0 20px 20px 10",
        width: open ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED,
        transition: "width 0.3s",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 1,
        gap: 2,
        overflow: "hidden",
      }}
    >
      <List sx={{ width: "100%", p: 0, mt: 2 }}>
        {/* Hamburger as a sidebar item, no tooltip */}
        <ListItem disablePadding sx={{ mb: 1, justifyContent: "center" }}>
          <ListItemButton
            onClick={() => setOpen((prev) => !prev)}
            sx={{
              borderRadius: 3,
              justifyContent: "center",
              px: 2,
              minHeight: 48,
              "&:hover": { background: "#b39ddb" },
              cursor: "pointer",
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: "#222" }}>
              <MenuIcon />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        {/* Sidebar items */}
        {sidebarItems.map((item) => (
          <ListItem
            key={item.label}
            disablePadding
            sx={{
              mb: 1,
              justifyContent: "center",
            }}
          >
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 3,
                justifyContent: open ? "flex-start" : "center",
                px: 2,
                minHeight: 48,
                transition: "background 0.2s",
                "&:hover": { background: "#b39ddb" },
                cursor: "pointer",
                overflow: "hidden",
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, color: "#222" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  ml: 1,
                  color: "#222",
                  opacity: open ? 1 : 0,
                  width: open ? "auto" : 0,
                  transition: "opacity 0.3s, width 0.3s",
                  whiteSpace: "nowrap",
                  ".MuiListItemText-primary": {
                    fontSize: 16,
                    fontWeight: 500,
                    letterSpacing: 0.2,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;