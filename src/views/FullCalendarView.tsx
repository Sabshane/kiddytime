import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Chip, useTheme, useMediaQuery } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';
import { Child, TimeEntry } from '../types';
import { StorageService } from '../services/storage';
import { EventInput } from '@fullcalendar/core';

const FullCalendarView: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [children, setChildren] = useState<Child[]>([]);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [events, setEvents] = useState<EventInput[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (children.length > 0 && entries.length > 0) {
      generateEvents();
    }
  }, [children, entries]);

  const loadData = async (start?: Date, end?: Date) => {
    const childrenData = await StorageService.getChildren();
    setChildren(childrenData);
    
    // Load entries for the current month and adjacent months
    const now = new Date();
    const startDate = start || new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endDate = end || new Date(now.getFullYear(), now.getMonth() + 2, 0);
    const entriesData = await StorageService.getEntriesForDateRange(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );
    setEntries(entriesData);
  };

  const handleDatesSet = (dateInfo: any) => {
    // When user navigates in calendar, load data for visible range
    const start = new Date(dateInfo.start);
    const end = new Date(dateInfo.end);
    loadData(start, end);
  };

  const generateEvents = () => {
    const generatedEvents: EventInput[] = [];

    // Generate color palette for children
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
      theme.palette.info.main,
    ];

    entries.forEach((entry) => {
      const child = children.find((c) => c.id === entry.childId);
      if (!child) return;

      const childIndex = children.findIndex((c) => c.id === child.id);
      const color = colors[childIndex % colors.length];

      if (entry.isAbsent) {
        // Create an all-day event for absence
        generatedEvents.push({
          id: entry.id,
          title: `${child.name} - Absent`,
          start: entry.date,
          allDay: true,
          backgroundColor: theme.palette.error.light,
          borderColor: theme.palette.error.main,
          textColor: theme.palette.error.contrastText,
          extendedProps: {
            childName: child.name,
            absent: true,
            absenceReason: entry.absenceReason,
          },
        });
      } else {
        // Create events for each time segment
        entry.segments.forEach((segment, index) => {
          if (segment.arrivalTime && segment.leavingTime) {
            const startDateTime = `${entry.date}T${segment.arrivalTime}:00`;
            const endDateTime = `${entry.date}T${segment.leavingTime}:00`;

            generatedEvents.push({
              id: `${entry.id}-segment-${index}`,
              title: child.name,
              start: startDateTime,
              end: endDateTime,
              backgroundColor: color,
              borderColor: color,
              textColor: '#fff',
              extendedProps: {
                childName: child.name,
                segment: index + 1,
                totalSegments: entry.segments.length,
                hasMeal: entry.hasMeal ?? child.hasMeal,
                hasSnack: entry.hasSnack ?? child.hasSnack,
                notes: entry.notes,
              },
            });
          }
        });
      }
    });

    setEvents(generatedEvents);
  };

  const handleEventClick = (info: any) => {
    const { extendedProps } = info.event;
    let message = `${extendedProps.childName}\n`;
    
    if (extendedProps.absent) {
      message += `Absent`;
      if (extendedProps.absenceReason) {
        message += ` - ${extendedProps.absenceReason}`;
      }
    } else {
      message += `Segment ${extendedProps.segment}/${extendedProps.totalSegments}\n`;
      message += `${info.event.start?.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${info.event.end?.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}\n`;
      if (extendedProps.hasMeal) message += `🍽️ Repas\n`;
      if (extendedProps.hasSnack) message += `🍪 Goûter\n`;
      if (extendedProps.notes) message += `Note: ${extendedProps.notes}`;
    }
    
    alert(message);
  };

  return (
    <Box sx={{ p: { xs: 1.5, md: 3 }, pb: 10 }}>
      {/* Header */}
      <Box
        sx={{
          mb: { xs: 2, md: 3 },
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 2,
          p: { xs: 2, md: 3 },
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            color: 'white',
            fontWeight: 700,
            mb: 1,
            fontSize: { xs: '1.3rem', md: '2rem' },
          }}
        >
          📅 Vue Calendrier
        </Typography>
        <Box sx={{ display: 'flex', gap: { xs: 0.5, md: 1 }, flexWrap: 'wrap' }}>
          {children.map((child, index) => {
            const colors = [
              theme.palette.primary.main,
              theme.palette.secondary.main,
              theme.palette.success.main,
              theme.palette.warning.main,
              theme.palette.error.main,
              theme.palette.info.main,
            ];
            const color = colors[index % colors.length];
            return (
              <Chip
                key={child.id}
                label={`👶 ${child.name}`}
                size="small"
                sx={{
                  bgcolor: color,
                  color: 'white',
                  fontWeight: 500,
                  fontSize: { xs: '0.7rem', md: '0.8125rem' },
                  height: { xs: '22px', md: '24px' },
                }}
              />
            );
          })}
        </Box>
      </Box>

      {/* FullCalendar */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 1, md: 2 },
          borderRadius: 2,
          '& .fc': {
            fontFamily: theme.typography.fontFamily,
          },
          '& .fc-button': {
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
            padding: { xs: '4px 8px', sm: '6px 12px', md: '8px 16px' },
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
            '&:disabled': {
              opacity: 0.5,
            },
          },
          '& .fc-button-active': {
            backgroundColor: theme.palette.secondary.main,
            borderColor: theme.palette.secondary.main,
          },
          '& .fc-today-button': {
            backgroundColor: theme.palette.secondary.light,
          },
          '& .fc-toolbar': {
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 1, md: 0 },
            marginBottom: { xs: '1rem', md: '1.5rem' },
          },
          '& .fc-toolbar-chunk': {
            display: 'flex',
            justifyContent: { xs: 'center', md: 'flex-start' },
            marginBottom: { xs: '0.5rem', md: 0 },
          },
          '& .fc-toolbar-title': {
            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
            fontWeight: 600,
          },
          '& .fc-daygrid-day.fc-day-today': {
            backgroundColor: 'rgba(244, 143, 177, 0.1)',
          },
          '& .fc-col-header-cell': {
            backgroundColor: theme.palette.grey[100],
            fontWeight: 600,
            fontSize: { xs: '0.75rem', md: '0.875rem' },
            padding: { xs: '4px', md: '8px' },
          },
          '& .fc-daygrid-day-number': {
            fontSize: { xs: '0.8rem', md: '0.875rem' },
            padding: { xs: '2px', md: '4px' },
          },
          '& .fc-event': {
            cursor: 'pointer',
            fontSize: { xs: '0.7rem', md: '0.8125rem' },
            '&:hover': {
              opacity: 0.8,
            },
          },
          '& .fc-daygrid-event': {
            marginTop: { xs: '1px', md: '2px' },
          },
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          headerToolbar={isMobile ? {
            left: 'prev,next',
            center: 'title',
            right: 'today',
          } : {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
          }}
          footerToolbar={isMobile ? {
            center: 'dayGridMonth,listWeek',
          } : undefined}
          locale={frLocale}
          events={events}
          eventClick={handleEventClick}
          datesSet={handleDatesSet}
          height="auto"
          slotMinTime="06:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={true}
          weekends={false}
          editable={false}
          selectable={false}
          firstDay={1} // Monday
          buttonText={isMobile ? {
            today: "Auj.",
            month: 'Mois',
            week: 'Sem.',
            day: 'Jour',
            list: 'Liste',
          } : {
            today: "Aujourd'hui",
            month: 'Mois',
            week: 'Semaine',
            day: 'Jour',
            list: 'Liste',
          }}
        />
      </Paper>
    </Box>
  );
};

export default FullCalendarView;
