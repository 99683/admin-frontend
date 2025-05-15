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
import bcrypt from "bcryptjs";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  createdAt: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [error, setError] = useState<string>("");

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
    if (
      !form.username.trim() ||
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.password.trim()
    ) {
      setError("Please fill out all fields.");
      return;
    }
    setError("");

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(form.password, salt);

    const newUser: User = {
      id: Date.now(),
      username: form.username,
      firstName: form.firstName,
      lastName: form.lastName,
      passwordHash: hash,
      createdAt: new Date().toLocaleString(),
    };

    setUsers([...users, newUser]);
    setForm({ username: "", firstName: "", lastName: "", password: "" });
  }

  return (
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
      {/* Form to Add User */}
      <Box sx={{ mb: 4 }}> {/* Added margin bottom */}
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#C38EB4" }}> {/* Light pinkish purple title */}
          Add New User
        </Typography>

        {error && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "#fbc02d", // Orange background for error
              color: "#222", // Dark text on orange
              borderRadius: 1,
              p: 1,
              mb: 2,
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
              width: "max-content",
            }}
          >
            <ErrorOutlineIcon sx={{ color: "#222", mr: 1 }} /> {/* Dark icon */}
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {error}
            </Typography>
          </Box>
        )}

        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            error={!!error && !form.username.trim()}
            helperText={!!error && !form.username.trim() ? "Required" : ""}
            InputLabelProps={{ style: { color: '#86A8CF' } }} // Light blue label
            InputProps={{ style: { color: '#E1CBD7' } }} // Very light pinkish purple input text
            sx={{
                '& .MuiOutlinedInput-root': { // Style the input border
                    '& fieldset': { borderColor: '#5A5A78' }, // Default border
                    '&:hover fieldset': { borderColor: '#86A8CF' }, // Hover border
                    '&.Mui-focused fieldset': { borderColor: '#C38EB4' }, // Focused border
                },
                 '& .MuiInputBase-root': { // Background for input
                     bgcolor: '#3a3a5a', // Darker background for input
                 }
            }}
          />
          <TextField
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            error={!!error && !form.firstName.trim()}
            helperText={!!error && !form.firstName.trim() ? "Required" : ""}
             InputLabelProps={{ style: { color: '#86A8CF' } }}
            InputProps={{ style: { color: '#E1CBD7' } }}
             sx={{
                '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#5A5A78' },
                    '&:hover fieldset': { borderColor: '#86A8CF' },
                    '&.Mui-focused fieldset': { borderColor: '#C38EB4' },
                },
                 '& .MuiInputBase-root': {
                     bgcolor: '#3a3a5a',
                 }
            }}
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            error={!!error && !form.lastName.trim()}
            helperText={!!error && !form.lastName.trim() ? "Required" : ""}
             InputLabelProps={{ style: { color: '#86A8CF' } }}
            InputProps={{ style: { color: '#E1CBD7' } }}
             sx={{
                '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#5A5A78' },
                    '&:hover fieldset': { borderColor: '#86A8CF' },
                    '&.Mui-focused fieldset': { borderColor: '#C38EB4' },
                },
                 '& .MuiInputBase-root': {
                     bgcolor: '#3a3a5a',
                 }
            }}
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            error={!!error && !form.password.trim()}
            helperText={!!error && !form.password.trim() ? "Required" : ""}
             InputLabelProps={{ style: { color: '#86A8CF' } }}
            InputProps={{ style: { color: '#E1CBD7' } }}
             sx={{
                '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#5A5A78' },
                    '&:hover fieldset': { borderColor: '#86A8CF' },
                    '&.Mui-focused fieldset': { borderColor: '#C38EB4' },
                },
                 '& .MuiInputBase-root': {
                     bgcolor: '#3a3a5a',
                 }
            }}
          />
          <Button variant="contained" onClick={handleAddUser} sx={{ bgcolor: '#C38EB4', '&:hover': { bgcolor: '#86A8CF' }, color: '#222' }}> {/* Button colors */}
            Add User
          </Button>
        </Box>
      </Box>

      {/* Users Table */}
      <Box>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#C38EB4" }}> {/* Light pinkish purple title */}
          Users Table
        </Typography>
        <Paper sx={{ width: "100%", overflow: "hidden", background: "#3a3a5a", color: '#E1CBD7', borderRadius: 2, boxShadow: 3 }}> {/* Darker table background, light text, rounded corners, subtle shadow */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#86A8CF', fontWeight: 'bold', borderBottomColor: '#5A5A78' }}>ID</TableCell> {/* Light blue header text, darker border */}
                <TableCell sx={{ color: '#86A8CF', fontWeight: 'bold', borderBottomColor: '#5A5A78' }}>Username</TableCell>
                <TableCell sx={{ color: '#86A8CF', fontWeight: 'bold', borderBottomColor: '#5A5A78' }}>First Name</TableCell>
                <TableCell sx={{ color: '#86A8CF', fontWeight: 'bold', borderBottomColor: '#5A5A78' }}>Last Name</TableCell>
                <TableCell sx={{ color: '#86A8CF', fontWeight: 'bold', borderBottomColor: '#5A5A78' }}>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:nth-of-type(odd)': { bgcolor: 'rgba(134, 168, 207, 0.05)' } }}> {/* Subtle stripe effect */}
                  <TableCell component="th" scope="row" sx={{ color: '#E1CBD7', borderBottomColor: '#5A5A78' }}>{user.id}</TableCell> {/* Light text color for cells */}
                  <TableCell sx={{ color: '#E1CBD7', borderBottomColor: '#5A5A78' }}>{user.username}</TableCell>
                  <TableCell sx={{ color: '#E1CBD7', borderBottomColor: '#5A5A78' }}>{user.firstName}</TableCell>
                  <TableCell sx={{ color: '#E1CBD7', borderBottomColor: '#5A5A78' }}>{user.lastName}</TableCell>
                  <TableCell sx={{ color: '#E1CBD7', borderBottomColor: '#5A5A78' }}>{user.createdAt}</TableCell>
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
