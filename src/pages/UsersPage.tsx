import React from "react";
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";

const UsersPage: React.FC = () => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
      Users Table
    </Typography>
    <Paper sx={{ width: "100%", overflow: "hidden", background: "#ededf3" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>id</TableCell>
            <TableCell>User Name</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Creation Time</TableCell>
            <TableCell>Roles</TableCell>
            <TableCell>Update</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Empty for now */}
        </TableBody>
      </Table>
    </Paper>
  </Box>
);

export default UsersPage;