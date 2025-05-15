import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Avatar,
  Typography,
  InputBase,
  IconButton,
  Paper,
  ButtonBase,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
  <AppBar
    position="static"
    sx={{
      background: "#26425A",
      borderRadius: 3,
      boxShadow: 3,
      margin: 2,
      width: "calc(100% - 48px)",
      left: 0,
      top: 0,
    }}
    elevation={0}
  >
      <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap", gap: 2, minHeight: "64px !important" }}>
        {/* Left: Only Avatar, clickable, with shadow and color change */}
        <Avatar
          sx={{
            bgcolor: "#E1CBD7",
            color: "#26425A",
            width: 40,
            height: 40,
            cursor: "pointer",
            boxShadow: "0 0 8px 0 rgba(134, 168, 207, 0.4)",
            transition: "background 0.2s, box-shadow 0.2s",
            outline: "none",
            "&:hover": {
              background: "#86A8CF",
              color: "#fff",
              boxShadow: "0 0 12px 2px rgba(134, 168, 207, 0.6)",
            },
            "&:active": {
              background: "#C38EB4",
              color: "#fff",
              boxShadow: "0 0 16px 4px rgba(134, 168, 207, 0.8)",
            },
             "&:focus": {
                outline: "none",
                boxShadow: "0 0 12px 2px rgba(134, 168, 207, 0.4)",
              },
          }}
          onClick={() => navigate("/admin-profile")}
        >
          <PersonOutlineIcon />
        </Avatar>

        {/* Center: Search Bar */}
        <Box sx={{ flex: 1, minWidth: 150, mx: 2, display: "flex", justifyContent: "center" }}>
          <Paper
            component="form"
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              maxWidth: 500,
              minWidth: 0,
              borderRadius: 20,
              boxShadow: "none",
              background: "#5A5A78",
              px: 2,
              color: '#E1CBD7',
            }}
          >
            <InputBase
              placeholder="Search"
              sx={{ ml: 1, flex: 1, minWidth: 0, color: 'inherit' }}
              inputProps={{ "aria-label": "search" }}
            />
            <IconButton size="small" sx={{ color: '#C38EB4' }}>
               <CloseIcon />
            </IconButton>
          </Paper>
        </Box>

        {/* Right: Notification and Custom Switch */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
          <IconButton
            disableRipple
             sx={{
              bgcolor: "#E1CBD7",
              color: "#26425A",
              width: 40,
              height: 40,
              borderRadius: "50%",
              boxShadow: "0 0 8px 0 rgba(134, 168, 207, 0.4)",
              transition: "background 0.2s, box-shadow 0.2s",
              outline: "none",
              "&:hover": {
                background: "#86A8CF",
                color: "#fff",
                boxShadow: "0 0 12px 2px rgba(134, 168, 207, 0.6)",
              },
              "&:active": {
                background: "#C38EB4",
                color: "#fff",
                boxShadow: "0 0 16px 4px rgba(134, 168, 207, 0.8)",
              },
              "&:focus": {
                outline: "none",
                boxShadow: "0 0 12px 2px rgba(134, 168, 207, 0.4)",
              },
            }}
          >
            <NotificationsNoneIcon />
          </IconButton>
        </Box>
    </Toolbar>
  </AppBar>
);
};

export default Header;