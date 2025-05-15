import React from "react";
import { Box } from "@mui/material";
import Header from "./Header";
// import Sidebar from "./Sidebar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    sx={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      background: "#fff",
      overflow: "hidden",
    }}
  >
    {/* <Sidebar /> */}
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Header />
      <Box sx={{ flex: 1, background: "#fff" }}>
        {children}
      </Box>
    </Box>
  </Box>
);

export default Layout;