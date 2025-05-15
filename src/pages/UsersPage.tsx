import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
  Button,
} from "@mui/material";
interface User {
  fullName: string;
  email: string;
  role: number;
  password: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: 3,
  });

  useEffect(() => {
    const stored = localStorage.getItem("users");
    if (stored) setUsers(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleAddUser() {
    const newUser: User = {
      fullName: form.fullName,
      email: form.email,
      password: form.password,
      role: form.role,
    };

    console.log("New User:", newUser);

    setUsers([...users, newUser]);
    setForm({
      fullName: "",
      email: "",
      password: "",
      role: 3,
    });
  }

  return (
    <Box
      sx={{
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 2,
        minHeight: "64px !important",
        width: "100%",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      {/* Form to Add User */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "black" }}>
          Add New User
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
          
          <TextField
            label="Role"
            type="number"
            name="role"
            value={form.role}
            onChange={handleChange}
          />
          <Button variant="contained" onClick={handleAddUser}>
            Add User
          </Button>
        </Box>
      </Box>

      {/* Users Table */}
      {/* <Box sx={{ p: 2, width: "100%" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "black" }}>
          Users Table
        </Typography>
        <Paper sx={{ width: "95%", overflow: "hidden", background: "#ededf3" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box> */}
    </Box>
  );
};

export default UsersPage;
