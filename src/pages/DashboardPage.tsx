import React from "react";
import { Box, Typography, Paper } from "@mui/material";

// Define keyframes for subtle background movement in your global CSS or here if preferred
// (Adding to a global CSS file like src/index.css is better practice)
/* Add this CSS to src/index.css or a dedicated styles file:
@keyframes float {
  0% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0); }
}
*/

const DashboardPage: React.FC = () => (
  <Box
    sx={{
      mx: 2,
      mt: 2,
      background: 'linear-gradient(45deg, #1E1E2F 30%, #26425A 90%)', // Dark gradient background
      borderRadius: 2,
      boxShadow: 8,
      p: 3,
      minHeight: "74vh",
      width: "auto",
      position: 'relative',
      overflow: 'hidden',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    }}
  >
     {/* No separate overlay needed with gradient background */}

    {/* Content Container - ZIndex 3 */}
    <Box sx={{ zIndex: 3, position: 'relative', width: '100%' }}>
        {/* Title */}
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4, color: "#E1CBD7", textShadow: '2px 2px 6px rgba(0,0,0,0.7)' }}> {/* Very light pinkish purple title */}
            ADMIN DASHBOARD
        </Typography>

        {/* Floating Content Box */}
        <Paper
            sx={{
                p: 3,
                bgcolor: 'rgba(134, 168, 207, 0.1)', // Semi-transparent Light blue
                boxShadow: 3,
                borderRadius: 2,
                maxWidth: 600,
                mx: 'auto',
                color: '#E1CBD7', // Very light pinkish purple text for content
                textAlign: 'left',
                animation: 'float 3s ease-in-out infinite',
                backdropFilter: 'blur(5px)', // Add a subtle blur effect behind the paper
              }}
        >
            <Typography variant="h6" gutterBottom sx={{ color: '#C38EB4' }}> {/* Light pinkish purple title */}
                Welcome, Admin!
            </Typography>
            <Typography variant="body1" sx={{ color: '#E1CBD7' }}> {/* Very light text */}
                Explore the features from the sidebar to manage users, view logs, and configure settings.
            </Typography>
        </Paper>
    </Box>
  </Box>
);

export default DashboardPage;