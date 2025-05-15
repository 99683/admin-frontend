import React from "react";
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";

// // Example static data for demonstration
const logs = [
  { id: 1, date: "2024-06-01 10:23", username: "alice" ,activity: "Logged in" },
  { id: 2, date: "2024-06-01 10:25", username: "bob", activity: "Sent a message" },
  { id: 3, date: "2024-06-01 10:30", username: "alice", activity: "Logged out" },
];

const LogsPage: React.FC = () => (
    
  <Box sx={{ p: 2 }}>
    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2,color:'black' }}>
      Logs Table
    </Typography>
    <Paper sx={{ width: "100%", overflow: "hidden", background: "#ededf3" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>User </TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Activity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>

          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.id}</TableCell>
              <TableCell>{log.date}</TableCell>
              <TableCell>{log.username}</TableCell>
              <TableCell>{log.activity}</TableCell>
            </TableRow>
          ))}

        </TableBody>
      </Table>
    </Paper>
  </Box>
);

export default LogsPage;