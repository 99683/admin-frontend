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
  Toolbar,
  TextField,
  Button,
} from "@mui/material";
import bcrypt from "bcryptjs";

interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  passwordHash: string;
  createdAt: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    role: "",
    password: "",
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
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(form.password, salt);

    const newUser: User = {
      id: Date.now(),
      username: form.username,
      firstName: form.firstName,
      lastName: form.lastName,
      role: form.role,
      passwordHash: hash,
      createdAt: new Date().toLocaleString(),
    };

    setUsers([...users, newUser]);
    setForm({ username: "", firstName: "", lastName: "", role: "", password: "" });
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
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
          />
          <TextField
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
          />
          
          <TextField
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
          <Button variant="contained" onClick={handleAddUser}>
            Add User
          </Button>
        </Box>
      </Box>

      {/* Users Table */}
      <Box sx={{ p: 2, width: "100%" }}>
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
                {/* Don't show hashed password in table */}
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
      </Box>
    </Box>
  );
};

export default UsersPage;
