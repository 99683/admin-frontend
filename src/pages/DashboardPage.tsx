import React from "react";
import { Box, Typography } from "@mui/material";

const DashboardPage: React.FC = () => (
  <Box
    sx={{
      mx: 2, // Match header's horizontal margin
      mt: 2, // Match header's top margin
      background: "#ecebeb",
      borderRadius: 2,
      boxShadow: 8,
      p: 3,
      minHeight: "74vh",
      width: "auto",
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#222" }}>
      DASHBOARD
    </Typography>
    {/* Add dashboard widgets or content here */}
  </Box>
);

export default DashboardPage;