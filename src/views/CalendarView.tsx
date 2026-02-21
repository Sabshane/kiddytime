import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Card,
  CardContent,
  TextField,
  Grid,
  Chip,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, subDays, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ViewMode, Child, TimeEntry } from '../types';
import { StorageService } from '../services/storage';

const CalendarView: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [children, setChildren] = useState<Child[]>([]);
  const [entries, setEntries] = useState<TimeEntry[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const childrenData = await StorageService.getChildren();
      setChildren(childrenData);
      await loadEntries();
    };
    loadData();
  }, [currentDate, viewMode]);

  const loadEntries = async () => {
    let start: Date;
    let end: Date;

    if (viewMode === 'day') {
      start = currentDate;
      end = currentDate;
    } else if (viewMode === 'week') {
      start = startOfWeek(currentDate, { weekStartsOn: 1 });
      end = endOfWeek(currentDate, { weekStartsOn: 1 });
    } else {
      start = startOfMonth(currentDate);
      end = endOfMonth(currentDate);
    }

    const startStr = format(start, 'yyyy-MM-dd');
    const endStr = format(end, 'yyyy-MM-dd');
    const entriesData = await StorageService.getEntriesForDateRange(startStr, endStr);
    setEntries(entriesData);
  };

  const handleTimeChange = async (childId: string, date: string, field: 'arrivalTime' | 'leavingTime', value: string) => {
    let entry = await StorageService.getTimeEntry(childId, date);
    
    if (!entry) {
      entry = {
        id: `${childId}-${date}`,
        childId,
        date,
        arrivalTime: null,
        leavingTime: null,
      };
    }

    entry[field] = value || null;
    await StorageService.saveTimeEntry(entry);
    await loadEntries();
  };

  const getEntry = (childId: string, date: string): TimeEntry | undefined => {
    return entries.find(e => e.childId === childId && e.date === date);
  };

  const navigatePrev = () => {
    if (viewMode === 'day') {
      setCurrentDate(subDays(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(subDays(currentDate, 7));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const navigateNext = () => {
    if (viewMode === 'day') {
      setCurrentDate(addDays(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const getDisplayDates = (): Date[] => {
    if (viewMode === 'day') {
      return [currentDate];
    } else if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end });
    } else {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      return eachDayOfInterval({ start, end });
    }
  };

  const getHeaderText = (): string => {
    if (viewMode === 'day') {
      return format(currentDate, 'EEEE d MMMM yyyy', { locale: fr });
    } else if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return `${format(start, 'd MMM', { locale: fr })} - ${format(end, 'd MMM yyyy', { locale: fr })}`;
    } else {
      return format(currentDate, 'MMMM yyyy', { locale: fr });
    }
  };

  const displayDates = getDisplayDates();

  if (children.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Aucun enfant enregistré. Veuillez d'abord ajouter des enfants dans la section "Enfants".
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 10 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1">
          Calendrier
        </Typography>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newMode) => newMode && setViewMode(newMode)}
          size="small"
        >
          <ToggleButton value="day">Jour</ToggleButton>
          <ToggleButton value="week">Semaine</ToggleButton>
          <ToggleButton value="month">Mois</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <IconButton onClick={navigatePrev}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
          {getHeaderText()}
        </Typography>
        <IconButton onClick={navigateNext}>
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <Grid container spacing={2}>
        {children.map((child) => (
          <Grid item xs={12} key={child.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {child.name}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {displayDates.map((date) => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const entry = getEntry(child.id, dateStr);
                    const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                    const isPast = date < new Date() && !isToday;

                    return (
                      <Box
                        key={dateStr}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 1,
                          bgcolor: isToday ? 'primary.light' : isPast ? 'grey.100' : 'background.paper',
                          borderRadius: 1,
                          opacity: isPast ? 0.7 : 1,
                        }}
                      >
                        <Box sx={{ minWidth: 120 }}>
                          <Typography variant="body2" sx={{ fontWeight: isToday ? 'bold' : 'normal' }}>
                            {format(date, 'EEE d MMM', { locale: fr })}
                          </Typography>
                          {isToday && <Chip label="Aujourd'hui" size="small" color="primary" />}
                        </Box>
                        <TextField
                          type="time"
                          label="Arrivée"
                          size="small"
                          value={entry?.arrivalTime || ''}
                          onChange={(e) => handleTimeChange(child.id, dateStr, 'arrivalTime', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          sx={{ flex: 1 }}
                        />
                        <TextField
                          type="time"
                          label="Départ"
                          size="small"
                          value={entry?.leavingTime || ''}
                          onChange={(e) => handleTimeChange(child.id, dateStr, 'leavingTime', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          sx={{ flex: 1 }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CalendarView;
