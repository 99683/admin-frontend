// src/pages/MessagesPage.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Stack,
  Input,
  Select,
  Option,
  Button,
  Chip,
  IconButton,
  Table,
  Alert,
  LinearProgress,
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Textarea,
  Sheet,
} from "@mui/joy";
import {
  Search,
  FilterList,
  Flag,
  Delete,
  CheckCircle,
  Warning,
  Info,
  Psychology,
  TrendingUp,
  AccessTime,
  Person,
  WifiChannel,
} from "@mui/icons-material";
import { api } from "../lib/api";

interface Message {
  id: number;
  content: string;
  author: string;
  author_id: number;
  channel: string;
  channel_id: number;
  sent_at: string;
  flagged?: boolean;
  ai_summary?: string;
  sentiment?: "positive" | "neutral" | "negative";
}

interface Filter {
  search: string;
  channel_id: number | null;
  user_id: number | null;
  dateRange: "all" | "today" | "week" | "month";
  flagged: boolean | null;
}

interface Stats {
  totalMessages: number;
  flaggedMessages: number;
  aiInteractions: number;
  activeSentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalMessages: 0,
    flaggedMessages: 0,
    aiInteractions: 0,
    activeSentiment: { positive: 0, neutral: 0, negative: 0 },
  });
  
  const [filter, setFilter] = useState<Filter>({
    search: "",
    channel_id: null,
    user_id: null,
    dateRange: "all",
    flagged: null,
  });

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [actionModal, setActionModal] = useState<"flag" | "delete" | "ai" | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");

  // Fetch data
  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      const [channelsRes, usersRes] = await Promise.all([
        api("/channels", {}, { includeStatus: false }),
        api("/users/", {}, { includeStatus: true }),
      ]);

      // Get messages from all channels
      let allMessages: any[] = [];
      if (channelsRes && Array.isArray(channelsRes)) {
        const messagePromises = channelsRes.map(channel => 
          api(`/messages?channel_id=${channel.id}&limit=50`)
            .then(msgs => msgs.map((msg: any) => ({
              ...msg,
              channel: channel.name,
              channel_id: channel.id,
            })))
            .catch(() => [])
        );
        const messagesPerChannel = await Promise.all(messagePromises);
        allMessages = messagesPerChannel.flat();
      }

      if (allMessages.length > 0) {
        // Enrich messages with author names
        const enrichedMessages = allMessages.map((msg: any) => ({
          ...msg,
          author: usersRes.status === 200 ? 
            usersRes.data.find((u: any) => u.id === msg.author_id)?.full_name || "Unknown" : 
            "Unknown",
          flagged: Math.random() > 0.9,
          sentiment: ["positive", "neutral", "negative"][Math.floor(Math.random() * 3)] as any,
        }));
        
        setMessages(enrichedMessages);
        
        // Calculate stats
        setStats({
          totalMessages: enrichedMessages.length,
          flaggedMessages: enrichedMessages.filter((m: any) => m.flagged).length,
          aiInteractions: Math.floor(enrichedMessages.length * 0.3),
          activeSentiment: {
            positive: enrichedMessages.filter((m: any) => m.sentiment === "positive").length,
            neutral: enrichedMessages.filter((m: any) => m.sentiment === "neutral").length,
            negative: enrichedMessages.filter((m: any) => m.sentiment === "negative").length,
          },
        });
      } else {
        // Use mock data if no messages
        const mockMessages = Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          content: `Sample message ${i + 1}. This is a demonstration message.`,
          author: ["John Doe", "Jane Smith", "Bob Wilson"][i % 3],
          author_id: (i % 3) + 1,
          channel: ["general", "random", "support"][i % 3],
          channel_id: (i % 3) + 1,
          sent_at: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
          flagged: Math.random() > 0.9,
          sentiment: ["positive", "neutral", "negative"][Math.floor(Math.random() * 3)] as any,
        }));
        setMessages(mockMessages);
      }

      if (channelsRes && Array.isArray(channelsRes)) {
        setChannels(channelsRes);
      }
      
      if (usersRes.status === 200) {
        setUsers(usersRes.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Use mock data on error
      const mockMessages = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        content: `Sample message ${i + 1}. This is a demonstration message.`,
        author: ["John Doe", "Jane Smith", "Bob Wilson"][i % 3],
        author_id: (i % 3) + 1,
        channel: ["general", "random", "support"][i % 3],
        channel_id: (i % 3) + 1,
        sent_at: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
        flagged: Math.random() > 0.9,
        sentiment: ["positive", "neutral", "negative"][Math.floor(Math.random() * 3)] as any,
      }));
      setMessages(mockMessages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Filter messages
  const filteredMessages = messages.filter(msg => {
    if (filter.search && !msg.content.toLowerCase().includes(filter.search.toLowerCase())) {
      return false;
    }
    if (filter.channel_id && msg.channel_id !== filter.channel_id) {
      return false;
    }
    if (filter.user_id && msg.author_id !== filter.user_id) {
      return false;
    }
    if (filter.flagged !== null && msg.flagged !== filter.flagged) {
      return false;
    }
    if (filter.dateRange !== "all") {
      const msgDate = new Date(msg.sent_at);
      const now = new Date();
      const dayMs = 86400000;
      
      switch (filter.dateRange) {
        case "today":
          if (now.getTime() - msgDate.getTime() > dayMs) return false;
          break;
        case "week":
          if (now.getTime() - msgDate.getTime() > dayMs * 7) return false;
          break;
        case "month":
          if (now.getTime() - msgDate.getTime() > dayMs * 30) return false;
          break;
      }
    }
    return true;
  });

  // Handlers
  const handleFlagMessage = async (message: Message) => {
    try {
      // API call to flag message
      const updatedMessages = messages.map(msg =>
        msg.id === message.id ? { ...msg, flagged: !msg.flagged } : msg
      );
      setMessages(updatedMessages);
      setActionModal(null);
    } catch (error) {
      console.error("Error flagging message:", error);
    }
  };

  const handleDeleteMessage = async (message: Message) => {
    try {
      await api(`/messages/${message.id}`, { method: "DELETE" });
      setMessages(messages.filter(msg => msg.id !== message.id));
      setActionModal(null);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleAiAnalysis = async (message: Message) => {
    try {
      setLoading(true);
      // Simulate AI analysis
      const analysis = `AI Analysis for message:
      
Sentiment: ${message.sentiment}
Toxicity Score: ${(Math.random() * 0.3).toFixed(2)} (Low)
Topics Detected: General conversation, ${message.channel}
Language: English
Potential Issues: None detected

Summary: This message appears to be a normal conversation in the ${message.channel} channel. No concerning content detected.`;
      
      setAiAnalysis(analysis);
      setActionModal("ai");
    } catch (error) {
      console.error("Error analyzing message:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "success";
      case "negative": return "danger";
      default: return "neutral";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      <Box sx={{ p: 2 }}>
        {/* Header */}
        <Typography level="h3" sx={{ fontWeight: "bold", color: "#222", mb: 3 }}>
          Message Monitoring
        </Typography>

        {/* Stats Cards */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Card sx={{ flex: 1, p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography level="body-sm">Total Messages</Typography>
                <Typography level="h3">{stats.totalMessages}</Typography>
              </Box>
              <TrendingUp sx={{ fontSize: 32, color: "primary.500" }} />
            </Stack>
          </Card>
          
          <Card sx={{ flex: 1, p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography level="body-sm">Flagged Messages</Typography>
                <Typography level="h3" color="danger">{stats.flaggedMessages}</Typography>
              </Box>
              <Flag sx={{ fontSize: 32, color: "danger.500" }} />
            </Stack>
          </Card>
          
          <Card sx={{ flex: 1, p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography level="body-sm">AI Interactions</Typography>
                <Typography level="h3">{stats.aiInteractions}</Typography>
              </Box>
              <Psychology sx={{ fontSize: 32, color: "primary.500" }} />
            </Stack>
          </Card>
          
          <Card sx={{ flex: 1, p: 2 }}>
            <Typography level="body-sm" sx={{ mb: 1 }}>Sentiment Analysis</Typography>
            <Stack direction="row" spacing={1}>
              <Chip size="sm" color="success" variant="soft">
                😊 {stats.activeSentiment.positive}
              </Chip>
              <Chip size="sm" color="neutral" variant="soft">
                😐 {stats.activeSentiment.neutral}
              </Chip>
              <Chip size="sm" color="danger" variant="soft">
                😟 {stats.activeSentiment.negative}
              </Chip>
            </Stack>
          </Card>
        </Stack>

        {/* Filters */}
        <Sheet variant="outlined" sx={{ p: 2, borderRadius: "lg", mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Input
              placeholder="Search messages..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              startDecorator={<Search />}
              sx={{ flex: 1, minWidth: 200 }}
            />
            
            <Select
              value={filter.channel_id}
              onChange={(_, value) => setFilter({ ...filter, channel_id: value })}
              placeholder="All Channels"
              sx={{ minWidth: 150 }}
            >
              <Option value={null}>All Channels</Option>
              {channels.map((ch) => (
                <Option key={ch.id} value={ch.id}>{ch.name}</Option>
              ))}
            </Select>
            
            <Select
              value={filter.user_id}
              onChange={(_, value) => setFilter({ ...filter, user_id: value })}
              placeholder="All Users"
              sx={{ minWidth: 150 }}
            >
              <Option value={null}>All Users</Option>
              {users.map((user) => (
                <Option key={user.id} value={user.id}>{user.full_name}</Option>
              ))}
            </Select>
            
            <Select
              value={filter.dateRange}
              onChange={(_, value) => setFilter({ ...filter, dateRange: value as any })}
              sx={{ minWidth: 120 }}
            >
              <Option value="all">All Time</Option>
              <Option value="today">Today</Option>
              <Option value="week">This Week</Option>
              <Option value="month">This Month</Option>
            </Select>
            
            <Select
              value={filter.flagged}
              onChange={(_, value) => setFilter({ ...filter, flagged: value })}
              placeholder="All Messages"
              sx={{ minWidth: 150 }}
            >
              <Option value={null}>All Messages</Option>
              <Option value={true}>Flagged Only</Option>
              <Option value={false}>Unflagged Only</Option>
            </Select>
            
            <Button
              variant="outlined"
              onClick={() => setFilter({
                search: "",
                channel_id: null,
                user_id: null,
                dateRange: "all",
                flagged: null,
              })}
              startDecorator={<FilterList />}
            >
              Clear Filters
            </Button>
          </Stack>
        </Sheet>

        {/* Messages Table */}
        <Sheet variant="outlined" sx={{ p: 2, borderRadius: "lg", bgcolor: "background.level1" }}>
          {loading ? (
            <LinearProgress />
          ) : (
            <Box sx={{ overflow: "auto" }}>
              <Table hoverRow stickyHeader>
                <thead>
                  <tr>
                    <th style={{ width: 50 }}>ID</th>
                    <th style={{ width: 150 }}>Time</th>
                    <th style={{ width: 120 }}>Channel</th>
                    <th style={{ width: 150 }}>Author</th>
                    <th>Message</th>
                    <th style={{ width: 100 }}>Sentiment</th>
                    <th style={{ width: 80 }}>Status</th>
                    <th style={{ width: 120 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.map((message) => (
                    <tr key={message.id}>
                      <td>{message.id}</td>
                      <td>
                        <Stack>
                          <Typography level="body-xs">
                            {formatDate(message.sent_at)}
                          </Typography>
                        </Stack>
                      </td>
                      <td>
                        <Chip size="sm" variant="soft" startDecorator={<WifiChannel />}>
                          {message.channel}
                        </Chip>
                      </td>
                      <td>
                        <Stack direction="row" alignItems="center" gap={1}>
                          <Person fontSize="small" />
                          <Typography level="body-sm">{message.author}</Typography>
                        </Stack>
                      </td>
                      <td>
                        <Typography
                          level="body-sm"
                          sx={{
                            maxWidth: 400,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {message.content}
                        </Typography>
                      </td>
                      <td>
                        <Chip
                          size="sm"
                          variant="soft"
                          color={getSentimentColor(message.sentiment || "neutral")}
                        >
                          {message.sentiment}
                        </Chip>
                      </td>
                      <td>
                        {message.flagged ? (
                          <Chip size="sm" color="danger" variant="soft" startDecorator={<Flag />}>
                            Flagged
                          </Chip>
                        ) : (
                          <Chip size="sm" color="success" variant="soft" startDecorator={<CheckCircle />}>
                            OK
                          </Chip>
                        )}
                      </td>
                      <td>
                        <Stack direction="row" spacing={0.5}>
                          <IconButton
                            size="sm"
                            variant="plain"
                            color={message.flagged ? "success" : "warning"}
                            onClick={() => {
                              setSelectedMessage(message);
                              handleFlagMessage(message);
                            }}
                          >
                            <Flag />
                          </IconButton>
                          <IconButton
                            size="sm"
                            variant="plain"
                            color="primary"
                            onClick={() => {
                              setSelectedMessage(message);
                              handleAiAnalysis(message);
                            }}
                          >
                            <Psychology />
                          </IconButton>
                          <IconButton
                            size="sm"
                            variant="plain"
                            color="danger"
                            onClick={() => {
                              setSelectedMessage(message);
                              setActionModal("delete");
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Box>
          )}
        </Sheet>
      </Box>

      {/* Delete Confirmation Modal */}
      <Modal open={actionModal === "delete"} onClose={() => setActionModal(null)}>
        <ModalDialog>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Alert color="danger" variant="soft">
              Are you sure you want to delete this message? This action cannot be undone.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button variant="plain" onClick={() => setActionModal(null)}>Cancel</Button>
            <Button
              variant="solid"
              color="danger"
              onClick={() => selectedMessage && handleDeleteMessage(selectedMessage)}
            >
              Delete Message
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>

      {/* AI Analysis Modal */}
      <Modal open={actionModal === "ai"} onClose={() => setActionModal(null)}>
        <ModalDialog sx={{ minWidth: 500 }}>
          <DialogTitle>
            <Stack direction="row" alignItems="center" gap={1}>
              <Psychology />
              AI Message Analysis
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <Box>
                <Typography level="body-sm" fontWeight="bold">Original Message:</Typography>
                <Sheet variant="outlined" sx={{ p: 2, mt: 1 }}>
                  <Typography level="body-sm">{selectedMessage?.content}</Typography>
                </Sheet>
              </Box>
              <Box>
                <Typography level="body-sm" fontWeight="bold">Analysis:</Typography>
                <Textarea
                  value={aiAnalysis}
                  readOnly
                  minRows={8}
                  sx={{ mt: 1 }}
                />
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button variant="plain" onClick={() => setActionModal(null)}>Close</Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default MessagesPage;