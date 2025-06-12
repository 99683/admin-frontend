import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import UsersPage from "./pages/UsersPage";
import DashboardPage from "./pages/DashboardPage"; 
import AdminProfilePage from "./pages/AdminProfilePage";
import RolesPage from "./pages/RolesPage";

const App: React.FC = () => (
  <Router>
    <Layout>
      <Routes>
      <Route path="/" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/admin-profile" element={<AdminProfilePage />} />
      </Routes>
    </Layout>
  </Router>
);

export default App;