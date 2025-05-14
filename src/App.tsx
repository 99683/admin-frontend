import React from "react";
import { Box } from "@mui/material";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UsersPage from "./pages/UsersPage"; // You'll create this next
import LogsPage from "./pages/LogsPage"; // Add this import

const App: React.FC = () => (
  <Router>
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
          <Routes>
            <Route path="/users" element={<UsersPage />} />
            <Route path="/logs" element={<LogsPage />} />
            {/* Add more routes here for other pages */}
          </Routes>
        </Box>
      </Box>
    </Box>
  </Router>
);

export default App;