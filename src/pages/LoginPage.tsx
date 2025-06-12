// src/pages/LoginPage.tsx
import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Input,
  Button,
  Alert,
  Stack,
  LinearProgress,
  IconButton,
} from "@mui/joy";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
  Security,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { AuthContext } from "../App";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, checkAuth } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in as admin
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // First login
      const response = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }, { parseJson: false });

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || "Invalid credentials");
        setLoading(false);
        return;
      }

      // Update auth state
      await checkAuth();
      
      // The useEffect above will handle the redirect
    } catch (err) {
      setError("Failed to connect to server");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: "100%",
          p: 4,
          boxShadow: "xl",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <AdminPanelSettings sx={{ fontSize: 48, color: "primary.500", mb: 2 }} />
          <Typography level="h3" sx={{ fontWeight: "bold" }}>
            Admin Panel
          </Typography>
          <Typography level="body-sm" sx={{ color: "text.secondary", mt: 1 }}>
            SecureChat Administration
          </Typography>
        </Box>

        {error && (
          <Alert color="danger" variant="soft" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <Stack spacing={3}>
            <Input
              type="email"
              placeholder="Email address"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              startDecorator={<Email />}
              required
              disabled={loading}
              size="lg"
            />

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              startDecorator={<Lock />}
              endDecorator={
                <IconButton
                  variant="plain"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              }
              required
              disabled={loading}
              size="lg"
            />

            <Button
              type="submit"
              variant="solid"
              loading={loading}
              size="lg"
              fullWidth
              startDecorator={<Security />}
            >
              Sign In as Admin
            </Button>
          </Stack>
        </form>

        {loading && <LinearProgress sx={{ mt: 2 }} />}

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography level="body-xs" sx={{ color: "text.secondary" }}>
            This area is restricted to administrators only.
            <br />
            Regular users should use the main chat application.
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default LoginPage;