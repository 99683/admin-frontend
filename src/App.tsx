import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import UsersPage from "./pages/UsersPage";
import LogsPage from "./pages/LogsPage"; 
import DashboardPage from "./pages/DashboardPage"; 
import AdminProfilePage from "./pages/AdminProfilePage";
import CalendarPage from "./pages/CalendarPage";

import { Dashboard } from "@mui/icons-material";

const App: React.FC = () => (
  <Router>
    <Layout>
      <Routes>
      <Route path="/" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/logs" element={<LogsPage />} />
        <Route path="/admin-profile" element={<AdminProfilePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </Layout>
  </Router>
);

export default App;