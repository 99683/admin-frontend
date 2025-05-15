import React from "react";
import { Box, Typography, Avatar, Button, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

// Example static logs for demonstration
const adminLogs = [
  { id: 1, date: "2024-06-01 10:23", description: "Changed password" },
  { id: 2, date: "2024-06-01 10:25", description: "Updated profile picture" },
  { id: 3, date: "2024-06-01 10:30", description: "Logged in" },
];

const AdminProfilePage: React.FC = () => (
  <Box
    sx={{
      p: 3,
      background: "#2c2c44",
      borderRadius: 2,
      boxShadow: 6,
      color: '#E1CBD7',
      minHeight: 'calc(100vh - 100px)',
      mx: 2,
      mt: 2,
      width: 'auto',
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
      <Avatar sx={{ width: 80, height: 80, bgcolor: '#C38EB4', color: '#222' }}>
        <PersonOutlineIcon sx={{ fontSize: 48 }} />
      </Avatar>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#E1CBD7" }}>
          Admin Name
        </Typography>
        <Typography color="#86A8CF" sx={{ mb: 1 }}>admin@email.com</Typography>
        <Typography color="#86A8CF" sx={{ mb: 2 }}>Role: Admin</Typography>
        <Button variant="outlined" sx={{
          mt: 1,
          borderColor: '#C38EB4',
          color: '#C38EB4',
          '&:hover': {
            background: '#C38EB4',
            color: '#222',
            borderColor: '#C38EB4',
          }
        }}>
          Change Profile Picture
        </Button>
      </Box>
    </Box>
    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#C38EB4" }}>
      My Activity Logs
    </Typography>
    <Paper sx={{ width: "100%", overflow: "hidden", background: "#3a3a5a", color: '#E1CBD7', borderRadius: 2, boxShadow: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: '#86A8CF', fontWeight: 'bold', borderBottomColor: '#5A5A78' }}>ID</TableCell>
            <TableCell sx={{ color: '#86A8CF', fontWeight: 'bold', borderBottomColor: '#5A5A78' }}>Date</TableCell>
            <TableCell sx={{ color: '#86A8CF', fontWeight: 'bold', borderBottomColor: '#5A5A78' }}>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {adminLogs.map((log) => (
            <TableRow key={log.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:nth-of-type(odd)': { bgcolor: 'rgba(134, 168, 207, 0.05)' } }}>
              <TableCell component="th" scope="row" sx={{ color: '#E1CBD7', borderBottomColor: '#5A5A78' }}>{log.id}</TableCell>
              <TableCell sx={{ color: '#E1CBD7', borderBottomColor: '#5A5A78' }}>{log.date}</TableCell>
              <TableCell sx={{ color: '#E1CBD7', borderBottomColor: '#5A5A78' }}>{log.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  </Box>
);

export default AdminProfilePage;