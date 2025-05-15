import React from "react";
import { Box, Typography, Avatar, Button, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";

// Example static logs for demonstration
const adminLogs = [
  { id: 1, date: "2024-06-01 10:23", description: "Changed password" },
  { id: 2, date: "2024-06-01 10:25", description: "Updated profile picture" },
  { id: 3, date: "2024-06-01 10:30", description: "Logged in" },
];

const AdminProfilePage: React.FC = () => (
  <Box sx={{ p: 2 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
      <Avatar sx={{ width: 80, height: 80 }}>A</Avatar>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>Admin Name</Typography>
        <Typography color="text.secondary">admin@email.com</Typography>
        <Typography color="text.secondary">Role: Admin</Typography>
        <Button variant="outlined" sx={{ mt: 1 }}>Change Profile Picture</Button>
      </Box>
    </Box>
    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
      My Activity Logs
    </Typography>
    <Paper sx={{ width: "100%", overflow: "hidden", background: "#ededf3" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {adminLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.id}</TableCell>
              <TableCell>{log.date}</TableCell>
              <TableCell>{log.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  </Box>
);

export default AdminProfilePage;