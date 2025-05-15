import React, { useState } from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import type { EventPropGetter, DayPropGetter, View, ToolbarProps } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Configure date-fns localizer
const locales = {
  'en-US': enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Interface for your events (good practice for type safety)
interface MyEvent {
  title: string;
  start: Date;
  end: Date;
  // Add other event properties here if needed
}

// Example events (you'll replace this with your data)
const myEventsList: MyEvent[] = [
  {
    title: 'Meeting',
    start: new Date(2024, 5, 15, 10, 0), // Year, Month (0-indexed), Day, Hour, Minute
    end: new Date(2024, 5, 15, 10, 30),
  },
  {
    title: 'Ban Expires - User X',
    start: new Date(2024, 5, 20, 14, 0),
    end: new Date(2024, 5, 20, 14, 0),
  },
];

// Custom Toolbar Component
const CustomCalendarToolbar = ({ label, onNavigate, onView, view }: ToolbarProps<MyEvent, object>) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        color: '#C38EB4', // Title color
        fontSize: '1.2em',
      }}
    >
      {/* Left: Navigation Buttons */}
      <Box>
        <Button
          onClick={() => onNavigate('TODAY')}
          sx={{
            color: '#86A8CF', // Light blue text
            borderColor: '#5A5A78', // Darker border
            '&:hover': {
              backgroundColor: 'rgba(134, 168, 207, 0.2)', // Subtle highlight
              color: '#86A8CF',
            },
             borderRadius: '4px',
             padding: '5px 10px',
             marginRight: '10px',
          }}
          disableRipple
        >
          Today
        </Button>
        <IconButton onClick={() => onNavigate('PREV')} sx={{ color: '#C38EB4' }} disableRipple> {/* Light pinkish purple icon */}
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <IconButton onClick={() => onNavigate('NEXT')} sx={{ color: '#C38EB4' }} disableRipple> {/* Light pinkish purple icon */}
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Center: Calendar Label (Month/Year) */}
      <Typography variant="h6" sx={{ fontWeight: "bold", color: '#E1CBD7' }}> {/* Very light pinkish purple text */}
        {label}
      </Typography>

      {/* Right: View Buttons */}
      <Box>
        {['month', 'week', 'day', 'agenda'].map((v) => (
          <Button
            key={v}
            onClick={() => onView(v as View)}
            sx={{
              color: view === v ? '#222' : '#E1CBD7', // Dark text for active, light for others
              backgroundColor: view === v ? '#C38EB4' : 'transparent', // Active background color
              '&:hover': {
                backgroundColor: view === v ? '#C38EB4' : 'rgba(195, 142, 180, 0.2)', // Hover effect
                color: view === v ? '#222' : '#E1CBD7',
                borderColor: 'transparent', // Remove border on hover
              },
               borderRadius: '4px',
               padding: '5px 10px',
                marginLeft: '5px',
                border: '1px solid #5A5A78', // Border for view buttons
                borderColor: view === v ? '#C38EB4' : 'transparent', // Border color changes with active state, transparent on hover
            }}
            disableRipple
          >
            {v.charAt(0).toUpperCase() + v.slice(1)} {/* Capitalize first letter */}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

const CalendarPage: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<View>('month'); // Default view

  // Custom styling for the calendar components
  const eventPropGetter: EventPropGetter<MyEvent> = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: '#C38EB4', // Light pinkish purple for events
      borderRadius: '4px', // Slightly rounded corners for events
      opacity: 0.9, // Slightly more opaque
      color: 'white',
      border: 'none', // No border
      display: 'block',
      padding: '2px 5px', // Add padding to event text
    };
    return {
      style: style
    };
  };

  const customDayPropGetter: DayPropGetter = (date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize today to start of day

      const selectedDate = new Date(2025, 4, 15); // Example: May 15, 2025 (adjust as needed)
      selectedDate.setHours(0, 0, 0, 0); // Normalize selected date

      if (date.getTime() === selectedDate.getTime()) {
          return {
              style: {
                  backgroundColor: 'rgba(134, 168, 207, 0.3)', // Subtle light blue highlight
              },
          };
      }
       if (date.getTime() === today.getTime()) {
          return {
              style: {
                  backgroundColor: 'rgba(195, 142, 180, 0.2)', // Subtle pinkish highlight for today
              },
          };
      }
      return {};
  };


  const customStyles = {
    // Style the main container box like other pages
     p: 3,
      background: "#2c2c44", // Dark background
      borderRadius: 2,
      boxShadow: 6,
      color: '#E1CBD7', // Default text color
      minHeight: 'calc(100vh - 100px)',
      mx: 2,
      mt: 2,
      width: 'auto',
    // Override react-big-calendar default styles for smoother lines
    '& .rbc-calendar': {
      backgroundColor: '#3a3a5a', // Darker table background
      border: '1px solid #5A5A78', // Consistent border around the whole calendar
      borderRadius: '8px', // Rounded corners for the calendar
      color: '#E1CBD7', // Light text color
      padding: '15px', // Inner padding
      boxShadow: '0 0 10px rgba(0,0,0,0.3)', // Subtle shadow
      display: 'flex', // Ensure flex layout for internal structure
      flexDirection: 'column',
    },
    '& .rbc-header': { // Day names (Sunday, Monday, etc.)
      color: '#86A8CF', // Light blue color
      fontWeight: 'bold',
      borderBottom: '1px solid #5A5A78', // Darker border bottom
      padding: '10px 0',
      '& + &': { // Remove border between headers (they are in a flex row)
          borderLeft: 'none',
      }
    },
     '& .rbc-month-view, & .rbc-time-view, & .rbc-agenda-view': { // Apply border to main views
         border: 'none', // Remove default view border if any
     },
      '& .rbc-month-view': {
           borderLeft: '1px solid #5A5A78', // Add left border for the month grid
           borderRight: '1px solid #5A5A78', // Add right border for the month grid
           borderBottom: '1px solid #5A5A78', // Add bottom border for the month grid
      },
     '& .rbc-day-bg': { // Background of each day cell
         borderRight: '1px solid #5A5A78', // Darker right border
         borderBottom: '1px solid #5A5A78', // Darker bottom border
         '&:last-child': { // Remove right border on the last day
             borderRight: 'none',
         }
     },
     '& .rbc-row-segment': { // Container for events in month view
          padding: '0 5px', // Add horizontal padding
     },
     '& .rbc-off-range-bg': { // Background of days outside the current month
         backgroundColor: '#333355', // Slightly different dark shade
     },
     '& .rbc-date-cell': { // Day number cells
         padding: '8px',
         color: '#E1CBD7', // Light text color for day numbers
         borderLeft: 'none', // Add left border to date cells
         '&:first-child': { // Remove left border on the first date cell in a row
              borderLeft: 'none',
         }
     },
      '& .rbc-toolbar': { // Top toolbar (navigation buttons)
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          color: '#C38EB4', // Light pinkish purple color for text like "May 2025"
          fontSize: '1.2em',
          button: { // Style for the buttons
              color: '#E1CBD7', // Light text color
              borderColor: '#5A5A78', // Darker border
              '&:hover': {
                  backgroundColor: '#5a5a78', // Darker hover background
                  color: '#fff', // White text on hover
              },
              '&.rbc-active': { // Active button (e.g., Month)
                  backgroundColor: '#C38EB4', // Light pinkish purple active background
                   color: '#222', // Dark text
                   fontWeight: 'bold',
              },
          },
      },
       '& .rbc-today': { // The "Today" button in the toolbar
            backgroundColor: 'rgba(134, 168, 207, 0.2)', // Subtle light blue background
            borderRadius: '4px',
             padding: '5px 10px',
              color: '#86A8CF', // Light blue text color
              '&:hover': {
                 backgroundColor: 'rgba(134, 168, 207, 0.4)',
              }
       },
       '& .rbc-direction-button': { // Arrow buttons
            color: '#C38EB4', // Light pinkish purple icon color
       },
        '& .rbc-event': { // Individual event styling
            color: '#fff', // White text on event
             // Inherit background from eventPropGetter
       },
         '& .rbc-event-label': { // Event time label
             color: 'rgba(255,255,255,0.9)', // Slightly transparent white
              fontSize: '0.8em', // Smaller font size for label
         },
          '& .rbc-event-content': { // Event title
              fontWeight: 'bold',
               fontSize: '0.9em', // Smaller font size for title
           },
            // Additional styles for smoothness and even lines
             '& .rbc-row': { // Each row in month view
                 display: 'flex',
                 flexDirection: 'row', // Ensure horizontal alignment of cells
             },
              '& .rbc-row-content': { // Content within each row
                  flex: 1, // Allow content to fill space
              },
               '& .rbc-time-content': { // Day view time grid
                   borderLeft: '1px solid #5A5A78',
                    borderRight: '1px solid #5A5A78',
               },
                '& .rbc-time-header.rbc-overflowing': { // Fix overflow header border
                    borderRight: 'none',
                },
    // --- Refine Today Styling ---
    '& .rbc-day-bg.rbc-now': { // Target the background of today's cell
        backgroundColor: 'rgba(195, 142, 180, 0.2) !important', // Apply the highlight
        padding: '0 !important',
        margin: '0 !important',
        border: 'none !important', // Ensure no extra border interferes
    },
    '& .rbc-date-cell.rbc-now': { // Target the date number cell for today
        fontWeight: 'bold', // Make the date bold
        color: '#C38EB4 !important', // Give today's date a distinct color
        padding: '8px !important',
    },
     // Remove default focus outline from buttons
      '& button:focus': { outline: 'none !important' },
      '& button:focus-visible': { outline: 'none !important' },
       '& button': {
           // Add subtle active state feedback if needed, though MUI's default should handle it
            '&:active': {
                opacity: 0.8, // Slightly dim on click
            }
       }
  };


  return (
    <Box sx={customStyles}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#C38EB4" }}> {/* Title */}
        Calendar
      </Typography>
      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }} // Fixed height for the calendar grid
        date={date}
        onNavigate={(newDate) => setDate(newDate)}
        view={view}
        onView={(newView) => setView(newView)}
        views={['month', 'week', 'day', 'agenda']}
        dayPropGetter={customDayPropGetter}
        eventPropGetter={eventPropGetter}
        components={{
          toolbar: CustomCalendarToolbar
        }}
      />
    </Box>
  );
};

export default CalendarPage;