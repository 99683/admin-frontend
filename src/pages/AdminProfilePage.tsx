// src/pages/AdminProfilePage.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Avatar,
  Button,
  Stack,
  Chip,
  Grid,
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Input,
  Table,
  Alert,
  LinearProgress,
  IconButton,
} from "@mui/joy";
import {
  Edit,
  Camera,
  Shield,
  AccessTime,
  Email,
  Key,
  CheckCircle,
  Warning,
  Info,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { api } from "../lib/api";

interface ActivityLog {
  id: number;
  action: string;
  details: string;
  timestamp: string;
  ip_address?: string;
  status: "success" | "warning" | "error";
}

const AdminProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [passwordModal, setPasswordModal] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    email: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userData = await api("/auth/me");
      setUser(userData);
      setProfileForm({
        full_name: userData.full_name,
        email: userData.email,
      });

      // Mock activity logs
      const mockLogs: ActivityLog[] = [
        {
          id: 1,
          action: "Login",
          details: "Successful login from Chrome on Windows",
          timestamp: new Date().toISOString(),
          ip_address: "192.168.1.100",
          status: "success",
        },
        {
          id: 2,
          action: "User Deleted",
          details: "Deleted user: test@example.com",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: "warning",
        },
        {
          id: 3,
          action: "Role Updated",
          details: "Updated role permissions for 'moderator'",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          status: "success",
        },
        {
          id: 4,
          action: "Failed Login Attempt",
          details: "Invalid password attempt",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          ip_address: "192.168.1.105",
          status: "error",
        },
        {
          id: 5,
          action: "Channel Created",
          details: "Created new channel: #announcements",
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          status: "success",
        },
      ];
      setLogs(mockLogs);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setError(null);
    setSuccess(null);

    if (passwordForm.new !== passwordForm.confirm) {
      setError("New passwords do not match");
      return;
    }

    if (passwordForm.new.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      // API call to change password
      await api("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          current_password: passwordForm.current,
          new_password: passwordForm.new,
        }),
      });

      setSuccess("Password changed successfully");
      setPasswordModal(false);
      setPasswordForm({ current: "", new: "", confirm: "" });
    } catch (error) {
      setError("Failed to change password. Please check your current password.");
    }
  };

  const handleProfileUpdate = async () => {
    setError(null);
    setSuccess(null);

    try {
      // API call to update profile
      await api("/auth/update-profile", {
        method: "PUT",
        body: JSON.stringify(profileForm),
      });

      setUser({ ...user, ...profileForm });
      setSuccess("Profile updated successfully");
      setProfileModal(false);
    } catch (error) {
      setError("Failed to update profile");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle sx={{ fontSize: 16 }} />;
      case "warning":
        return <Warning sx={{ fontSize: 16 }} />;
      case "error":
        return <Info sx={{ fontSize: 16 }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "success";
      case "warning":
        return "warning";
      case "error":
        return "danger";
      default:
        return "neutral";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ p: 2 }}>
        {/* Header */}
        <Typography level="h3" sx={{ fontWeight: "bold", color: "#222", mb: 3 }}>
          Admin Profile
        </Typography>

        {error && (
          <Alert color="danger" variant="soft" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert color="success" variant="soft" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Profile Card */}
          <Grid xs={12} md={4}>
            <Card sx={{ p: 3, textAlign: "center" }}>
              <Box sx={{ position: "relative", display: "inline-block", mb: 3 }}>
                <Avatar sx={{ width: 120, height: 120, fontSize: 48 }}>
                  {user?.full_name?.[0] || "A"}
                </Avatar>
                <IconButton
                  size="sm"
                  variant="solid"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    borderRadius: "50%",
                  }}
                >
                  <Camera />
                </IconButton>
              </Box>

              <Typography level="h4" sx={{ fontWeight: "bold" }}>
                {user?.full_name || "Admin User"}
              </Typography>
              
              <Stack direction="row" justifyContent="center" alignItems="center" gap={1} sx={{ mt: 1 }}>
                <Email sx={{ fontSize: 18, color: "text.secondary" }} />
                <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                  {user?.email || "admin@example.com"}
                </Typography>
              </Stack>

              <Chip
                variant="soft"
                color="primary"
                startDecorator={<Shield />}
                sx={{ mt: 2 }}
              >
                {user?.role || "Administrator"}
              </Chip>

              <Stack spacing={2} sx={{ mt: 3 }}>
                <Button
                  variant="solid"
                  startDecorator={<Edit />}
                  onClick={() => setProfileModal(true)}
                  fullWidth
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outlined"
                  startDecorator={<Key />}
                  onClick={() => setPasswordModal(true)}
                  fullWidth
                >
                  Change Password
                </Button>
              </Stack>

              <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid", borderColor: "divider" }}>
                <Typography level="body-xs" sx={{ color: "text.secondary" }}>
                  Account Status
                </Typography>
                <Chip color="success" variant="soft" sx={{ mt: 1 }}>
                  Active
                </Chip>
              </Box>
            </Card>
          </Grid>

          {/* Activity Logs */}
          <Grid xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Typography level="title-lg" sx={{ mb: 2 }}>
                Recent Activity
              </Typography>
              
              <Box sx={{ overflow: "auto" }}>
                <Table hoverRow>
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}>Status</th>
                      <th>Action</th>
                      <th>Details</th>
                      <th style={{ width: 150 }}>Timestamp</th>
                      <th style={{ width: 120 }}>IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id}>
                        <td>
                          <Chip
                            size="sm"
                            variant="soft"
                            color={getStatusColor(log.status)}
                            startDecorator={getStatusIcon(log.status)}
                          />
                        </td>
                        <td>
                          <Typography level="body-sm" fontWeight="lg">
                            {log.action}
                          </Typography>
                        </td>
                        <td>
                          <Typography level="body-sm">
                            {log.details}
                          </Typography>
                        </td>
                        <td>
                          <Stack>
                            <Typography level="body-xs">
                              {formatDate(log.timestamp)}
                            </Typography>
                          </Stack>
                        </td>
                        <td>
                          <Typography level="body-xs" sx={{ fontFamily: "monospace" }}>
                            {log.ip_address || "-"}
                          </Typography>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Box>
            </Card>

            {/* Security Stats */}
            <Card sx={{ p: 3, mt: 3 }}>
              <Typography level="title-lg" sx={{ mb: 2 }}>
                Security Overview
              </Typography>
              
              <Grid container spacing={2}>
                <Grid xs={6} md={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography level="h2" color="success">
                      23
                    </Typography>
                    <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                      Successful Logins
                    </Typography>
                  </Box>
                </Grid>
                <Grid xs={6} md={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography level="h2" color="danger">
                      2
                    </Typography>
                    <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                      Failed Attempts
                    </Typography>
                  </Box>
                </Grid>
                <Grid xs={6} md={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography level="h2" color="warning">
                      5
                    </Typography>
                    <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                      Admin Actions
                    </Typography>
                  </Box>
                </Grid>
                <Grid xs={6} md={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography level="h2" color="primary">
                      12d
                    </Typography>
                    <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                      Days Since Last Issue
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Change Password Modal */}
      <Modal open={passwordModal} onClose={() => setPasswordModal(false)}>
        <ModalDialog sx={{ minWidth: 400 }}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <Input
                type={showPasswords.current ? "text" : "password"}
                placeholder="Current Password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                startDecorator={<Key />}
                endDecorator={
                  <IconButton
                    variant="plain"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  >
                    {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                }
              />
              <Input
                type={showPasswords.new ? "text" : "password"}
                placeholder="New Password"
                value={passwordForm.new}
                onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                startDecorator={<Key />}
                endDecorator={
                  <IconButton
                    variant="plain"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  >
                    {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                }
              />
              <Input
                type={showPasswords.confirm ? "text" : "password"}
                placeholder="Confirm New Password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                startDecorator={<Key />}
                endDecorator={
                  <IconButton
                    variant="plain"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  >
                    {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                }
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button variant="plain" onClick={() => setPasswordModal(false)}>
              Cancel
            </Button>
            <Button
              variant="solid"
              onClick={handlePasswordChange}
              disabled={!passwordForm.current || !passwordForm.new || !passwordForm.confirm}
            >
              Change Password
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal open={profileModal} onClose={() => setProfileModal(false)}>
        <ModalDialog sx={{ minWidth: 400 }}>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <Input
                placeholder="Full Name"
                value={profileForm.full_name}
                onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
              />
              <Input
                type="email"
                placeholder="Email Address"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                startDecorator={<Email />}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button variant="plain" onClick={() => setProfileModal(false)}>
              Cancel
            </Button>
            <Button
              variant="solid"
              onClick={handleProfileUpdate}
              disabled={!profileForm.full_name || !profileForm.email}
            >
              Save Changes
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default AdminProfilePage;