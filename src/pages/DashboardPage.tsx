// src/pages/DashboardPage.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Button,
  LinearProgress,
  Divider,
  Stack,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/joy";
import {
  People,
  Message,
  WifiChannel,
  TrendingUp,
  Shield,
  Refresh,
  Warning,
  CheckCircle,
  AccessTime,
  Psychology,
} from "@mui/icons-material";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { api } from "../lib/api";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalChannels: number;
  activeChannels: number;
  totalMessages: number;
  todayMessages: number;
  aiUsage: {
    chatRequests: number;
    summaryRequests: number;
    smartReplies: number;
  };
  usersByRole: { name: string; count: number }[];
  messagesByHour: { hour: string; count: number }[];
  channelActivity: { name: string; messages: number }[];
  recentActivity: {
    type: string;
    description: string;
    timestamp: string;
    user?: string;
  }[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchDashboardStats = async () => {
    try {
      setRefreshing(true);
      
      // Fetch all necessary data
      const [usersRes, channelsRes, rolesRes] = await Promise.all([
        api("/users/", {}, { includeStatus: true }),
        api("/channels", {}, { includeStatus: false }),
        api("/roles/", {}, { includeStatus: true }),
      ]);

      // Get messages for all channels
      let allMessages: any[] = [];
      if (channelsRes && Array.isArray(channelsRes)) {
        const messagePromises = channelsRes.map(channel => 
          api(`/messages?channel_id=${channel.id}&limit=50`).catch(() => [])
        );
        const messagesPerChannel = await Promise.all(messagePromises);
        allMessages = messagesPerChannel.flat();
      }

      // Calculate real statistics
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayMessages = allMessages.filter(msg => 
        new Date(msg.sent_at || 0) >= todayStart
      );

      // Calculate messages by hour for today
      const hourlyMessages = Array.from({ length: 24 }, (_, hour) => {
        const hourStart = new Date(todayStart);
        hourStart.setHours(hour);
        const hourEnd = new Date(todayStart);
        hourEnd.setHours(hour + 1);
        
        const count = todayMessages.filter(msg => {
          const msgTime = new Date(msg.sent_at || 0);
          return msgTime >= hourStart && msgTime < hourEnd;
        }).length;

        return {
          hour: `${hour}:00`,
          count,
        };
      });

      // Calculate users by role
      const usersByRole = rolesRes.status === 200 ? rolesRes.data.map((role: any) => ({
        name: role.name,
        count: usersRes.status === 200 ? 
          usersRes.data.filter((u: any) => u.role === role.name).length : 0,
      })) : [];

      // Calculate channel activity (messages per channel)
      const channelActivity = channelsRes.slice(0, 5).map((ch: any) => {
        const channelMessages = allMessages.filter(msg => 
          msg.channel_id === ch.id
        );
        return {
          name: ch.name,
          messages: channelMessages.length,
        };
      }).sort((a, b) => b.messages - a.messages);

      // Create activity log from recent actions
      const recentActivity = [];
      
      // Add recent messages as activity
      const recentMessages = [...allMessages]
        .sort((a, b) => new Date(b.sent_at || 0).getTime() - new Date(a.sent_at || 0).getTime())
        .slice(0, 3);
      
      recentMessages.forEach(msg => {
        const channel = channelsRes.find((ch: any) => ch.id === msg.channel_id);
        recentActivity.push({
          type: "message",
          description: `New message in ${channel?.name || 'Unknown'}`,
          timestamp: getRelativeTime(new Date(msg.sent_at)),
          user: msg.author?.full_name || "Unknown",
        });
      });

      // Calculate active users (those who sent messages in last 24h)
      const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const activeUserIds = new Set(
        allMessages
          .filter(msg => new Date(msg.sent_at || 0) > last24h)
          .map(msg => msg.author_id)
      );

      const mockStats: DashboardStats = {
        totalUsers: usersRes.status === 200 ? usersRes.data.length : 0,
        activeUsers: activeUserIds.size,
        totalChannels: channelsRes.length || 0,
        activeChannels: channelActivity.filter(ch => ch.messages > 0).length,
        totalMessages: allMessages.length,
        todayMessages: todayMessages.length,
        aiUsage: {
          chatRequests: Math.floor(allMessages.length * 0.1), // Estimate based on messages
          summaryRequests: Math.floor(allMessages.length * 0.05),
          smartReplies: Math.floor(allMessages.length * 0.08),
        },
        usersByRole,
        messagesByHour: hourlyMessages,
        channelActivity,
        recentActivity: recentActivity.length > 0 ? recentActivity : [
          { type: "info", description: "No recent activity", timestamp: "Just now" },
        ],
      };

      setStats(mockStats);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError("Failed to fetch dashboard statistics");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Helper function for relative time
  const getRelativeTime = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  useEffect(() => {
    fetchDashboardStats();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_joined": return <People />;
      case "message": return <Message />;
      case "channel": return <WifiChannel />;
      case "ai": return <Psychology />;
      case "warning": return <Warning />;
      default: return <CheckCircle />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "warning": return "danger";
      case "ai": return "primary";
      case "user_joined": return "success";
      default: return "neutral";
    }
  };

  if (loading && !refreshing) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size="lg" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ m: 2 }}>
        <Alert color="danger" variant="outlined">
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography level="h3" sx={{ fontWeight: "bold", color: "#222" }}>
            Dashboard
          </Typography>
          <Typography level="body-sm" sx={{ color: "text.secondary" }}>
            Last updated: {lastUpdate.toLocaleTimeString()}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startDecorator={<Refresh />}
            onClick={fetchDashboardStats}
            loading={refreshing}
          >
            Refresh
          </Button>
        </Stack>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography level="body-sm">Total Users</Typography>
                <Typography level="h2">{stats?.totalUsers || 0}</Typography>
                <Typography level="body-xs" sx={{ color: "success.500" }}>
                  {stats?.activeUsers || 0} active
                </Typography>
              </Box>
              <People sx={{ fontSize: 40, color: "primary.500" }} />
            </Box>
            <LinearProgress
              determinate
              value={(stats?.activeUsers || 0) / (stats?.totalUsers || 1) * 100}
              sx={{ mt: 1 }}
            />
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography level="body-sm">Total Channels</Typography>
                <Typography level="h2">{stats?.totalChannels || 0}</Typography>
                <Typography level="body-xs" sx={{ color: "success.500" }}>
                  {stats?.activeChannels || 0} active
                </Typography>
              </Box>
              <WifiChannel sx={{ fontSize: 40, color: "success.500" }} />
            </Box>
            <LinearProgress
              determinate
              value={(stats?.activeChannels || 0) / (stats?.totalChannels || 1) * 100}
              sx={{ mt: 1 }}
              color="success"
            />
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography level="body-sm">Messages Today</Typography>
                <Typography level="h2">{stats?.todayMessages || 0}</Typography>
                <Typography level="body-xs" sx={{ color: "text.secondary" }}>
                  {stats?.totalMessages || 0} total
                </Typography>
              </Box>
              <Message sx={{ fontSize: 40, color: "warning.500" }} />
            </Box>
            <Box sx={{ mt: 1, display: "flex", gap: 0.5 }}>
              <Chip size="sm" color="warning" variant="soft">
                <TrendingUp sx={{ fontSize: 14 }} /> +15%
              </Chip>
            </Box>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography level="body-sm">AI Requests</Typography>
                <Typography level="h2">{(stats?.aiUsage.chatRequests || 0) + (stats?.aiUsage.summaryRequests || 0) + (stats?.aiUsage.smartReplies || 0)}</Typography>
                <Typography level="body-xs" sx={{ color: "text.secondary" }}>
                  Today
                </Typography>
              </Box>
              <Psychology sx={{ fontSize: 40, color: "primary.500" }} />
            </Box>
            <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
              <Chip size="sm" variant="soft">Chat: {stats?.aiUsage.chatRequests}</Chip>
              <Chip size="sm" variant="soft">Summary: {stats?.aiUsage.summaryRequests}</Chip>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid xs={12} md={8}>
          <Card sx={{ p: 2, height: 350 }}>
            <Typography level="title-md" sx={{ mb: 2 }}>Message Activity (24h)</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={stats?.messagesByHour || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <RechartsTooltip />
                <Area type="monotone" dataKey="count" stroke="#0088FE" fill="#0088FE" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        <Grid xs={12} md={4}>
          <Card sx={{ p: 2, height: 350 }}>
            <Typography level="title-md" sx={{ mb: 2 }}>Users by Role</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={stats?.usersByRole || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats?.usersByRole.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Channel Activity and Recent Activity */}
      <Grid container spacing={2}>
        <Grid xs={12} md={6}>
          <Card sx={{ p: 2, height: 400 }}>
            <Typography level="title-md" sx={{ mb: 2 }}>Top Active Channels</Typography>
            <ResponsiveContainer width="100%" height={330}>
              <BarChart data={stats?.channelActivity || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <RechartsTooltip />
                <Bar dataKey="messages" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card sx={{ p: 2, height: 400, overflow: "hidden" }}>
            <Typography level="title-md" sx={{ mb: 2 }}>Recent Activity</Typography>
            <Box sx={{ height: 330, overflow: "auto" }}>
              <Stack spacing={1}>
                {stats?.recentActivity.map((activity, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 1.5,
                      borderRadius: "md",
                      bgcolor: "background.level1",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <IconButton
                      size="sm"
                      variant="soft"
                      color={getActivityColor(activity.type)}
                    >
                      {getActivityIcon(activity.type)}
                    </IconButton>
                    <Box sx={{ flex: 1 }}>
                      <Typography level="body-sm" sx={{ fontWeight: "bold" }}>
                        {activity.description}
                      </Typography>
                      {activity.user && (
                        <Typography level="body-xs" sx={{ color: "text.secondary" }}>
                          {activity.user}
                        </Typography>
                      )}
                    </Box>
                    <Typography level="body-xs" sx={{ color: "text.secondary" }}>
                      <AccessTime sx={{ fontSize: 12, mr: 0.5 }} />
                      {activity.timestamp}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;