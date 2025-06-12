import React from "react";
import { Box } from "@mui/material";
import Header from "../pages/Header";
// import Sidebar from "./Sidebar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    sx={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      background: "#fff",
      overflow: "hidden", // This prevents the whole page from scrolling
    }}
  >
    {/* <Sidebar /> */}
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Header />
      <Box
        sx={{
          flex: 1, // Takes up the remaining vertical space
          background: "#fff",
          overflowY: "auto", // Makes only this container scrollable vertically
        }}
      >
        {children}
      </Box>
    </Box>
  </Box>
);

export default Layout;