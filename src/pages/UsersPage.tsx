// src/pages/UsersPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TextField,
  Button,
  TableSortLabel,
} from "@mui/material";
import { addUser, listUsers } from "../lib/api";


interface NewUser {
  full_name: string;
  email: string;
  role: number;
  password: string;
}
interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
}
type Order = "asc" | "desc";
type OrderBy = keyof User;


const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ full_name: "", email: "", password: "", role: 3 });

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<OrderBy>("id");

  useEffect(() => {
    (async () => {
      try {
        const res = await listUsers();       
        if (res.status !== 200) return console.error("Error fetching users:", res.status);

        const mapped: User[] = res.data.map((u: any) => ({
          id: u.id,
          fullName: u.full_name,
          email: u.email,
          role: u.role.name,
        }));
        setUsers(mapped);
      } catch (err) {
        console.error("General error fetching users:", err);
      }
    })();
  }, []);

  const sortedUsers = useMemo(() => {
    const cmp = (a: User, b: User) => {
      const k = orderBy;
      return order === "desc"
        ? (b[k] as any) > (a[k] as any)
          ? 1
          : -1
        : (a[k] as any) > (b[k] as any)
        ? 1
        : -1;
    };
    return [...users].sort(cmp);
  }, [users, order, orderBy]);

  const toggleSort = (key: OrderBy) => {
    setOrderBy(key);
    setOrder(orderBy === key && order === "asc" ? "desc" : "asc");
  };

  /* ── form handlers ── */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddUser = async () => {
    const payload: NewUser = { ...form };
    try {
      const res = await addUser(payload);     
      if (res.status !== 200) return console.error("Error adding user:", res);

      window.location.reload();
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", p: 2 }}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Add User
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} />
          <TextField label="Email" name="email" value={form.email} onChange={handleChange} />
          <TextField label="Password" type="password" name="password" value={form.password} onChange={handleChange} />
          <TextField label="Role" type="number" name="role" value={form.role} onChange={handleChange} />
          <Button variant="contained" onClick={handleAddUser}>
            Add
          </Button>
        </Box>
      </Box>

      {/* Users table */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Users
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            width: "95%",
            maxHeight: 350,         
            bgcolor: "#ededf3",
            overflowY: "auto",

            /* Chrome / Edge / Safari */
            "&::-webkit-scrollbar": { width: 8 },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#9e9e9e",          
              borderRadius: 4,
            },

            /* Firefox */
            scrollbarWidth: "thin",
            scrollbarColor: "transparent transparent",  // <thumb> <track>
            "&:hover": {
              scrollbarColor: "#9e9e9e transparent",
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {[
                  { id: "id", label: "ID" },
                  { id: "fullName", label: "Full Name" },
                  { id: "email", label: "Email" },
                  { id: "role", label: "Role" },
                ].map((h) => (
                  <TableCell key={h.id}>
                    <TableSortLabel
                      active={orderBy === h.id}
                      direction={orderBy === h.id ? order : "asc"}
                      onClick={() => toggleSort(h.id as OrderBy)}
                    >
                      {h.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedUsers.map((u) => (
                <TableRow hover key={u.id}>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>{u.fullName}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default UsersPage;
