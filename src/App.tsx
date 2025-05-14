import React from "react";
import { Box } from "@mui/material";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

const App: React.FC = () => (
  <Box
    sx={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      background: "#fff",
      overflow: "hidden",
    }}
  >
    <Sidebar />
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Header />
      <Box sx={{ flex: 1, background: "#fff" }}>
        {/* Main content will go here */}
      </Box>
    </Box>
  </Box>
);

export default App;