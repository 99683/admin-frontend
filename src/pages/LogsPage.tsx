import React from "react";
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";

// // Example static data for demonstration
const logs = [
  { id: 1, date: "2024-06-01 10:23", username: "alice" ,activity: "Logged in" },
  { id: 2, date: "2024-06-01 10:25", username: "bob", activity: "Sent a message" },
  { id: 3, date: "2024-06-01 10:30", username: "alice", activity: "Logged out" },
];

const LogsPage: React.FC = () => (
  <Box // Main container for the page content
    sx={{
      p: 3, // Add padding for content
      background: "#2c2c44", // Dark background for the page content area
      borderRadius: 2,
      boxShadow: 6, // Subtle shadow
      color: '#E1CBD7', // Default light text color for the page
      minHeight: 'calc(100vh - 100px)', // Adjust min height considering header/margins
      mx: 2, // Match layout padding/margin
      mt: 2, // Match layout padding/margin
      width: 'auto', // Allow box to shrink/grow
    }}
  >
    <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#C38EB4" }}> {/* Light pinkish purple title */}
      Logs Table
    </Typography>
    <Paper sx={{ width: "100%", overflow: "hidden", background: "#3a3a5a", color: '#E1CBD7', borderRadius: 2, boxShadow: 3 }}> {/* Darker table background, light text, rounded corners, subtle shadow */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: '#86A8CF', fontWeight: 'bold', borderBottomColor: '#5A5A78' }}>ID</TableCell> {/* Light blue header text, darker border */}
            <TableCell sx={{ color: '#86A8CF', fontWeight: 'bold', borderBottomColor: '#5A5A78' }}>User </TableCell>
            <TableCell sx={{ color: '#86A8CF', fontWeight: 'bold', borderBottomColor: '#5A5A78' }}>Date</TableCell>
            <TableCell sx={{ color: '#86A8CF', fontWeight: 'bold', borderBottomColor: '#5A5A78' }}>Activity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:nth-of-type(odd)': { bgcolor: 'rgba(134, 168, 207, 0.05)' } }}> {/* Subtle stripe effect */}
              <TableCell component="th" scope="row" sx={{ color: '#E1CBD7', borderBottomColor: '#5A5A78' }}>{log.id}</TableCell> {/* Light text color for cells */}
              <TableCell sx={{ color: '#E1CBD7', borderBottomColor: '#5A5A78' }}>{log.date}</TableCell>
              <TableCell sx={{ color: '#E1CBD7', borderBottomColor: '#5A5A78' }}>{log.username}</TableCell>
              <TableCell sx={{ color: '#E1CBD7', borderBottomColor: '#5A5A78' }}>{log.activity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  </Box>
);

export default LogsPage;