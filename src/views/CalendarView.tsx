import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Button,
  Grid,
  Chip,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DownloadIcon from '@mui/icons-material/Download';
import TodayIcon from '@mui/icons-material/Today';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, subDays, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ViewMode, Child, TimeEntry } from '../types';
import { StorageService } from '../services/storage';
import { exportTimeEntries } from '../utils/export';
import DayEntryCard from '../components/DayEntryCard';

const CalendarView: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [children, setChildren] = useState<Child[]>([]);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [showAllChildren, setShowAllChildren] = useState<{[key: string]: boolean}>({});
  const [hiddenChildren, setHiddenChildren] = useState<{[key: string]: string[]}>({}) // {dateStr: [childId, ...]}

  // Helper: Get expected children for a specific date
  const getExpectedChildrenForDate = (date: Date): Child[] => {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    return children.filter(child => child.expectedDays.includes(dayOfWeek));
  };

  // Helper: Get unexpected children for a specific date (those with entries but not expected)
  const getUnexpectedChildrenForDate = (date: Date): Child[] => {
    const dayOfWeek = date.getDay();
    const dateStr = format(date, 'yyyy-MM-dd');
    const expectedIds = children
      .filter(child => child.expectedDays.includes(dayOfWeek))
      .map(c => c.id);
    
    // Find children with entries for this date but not expected
    return children.filter(child => {
      if (expectedIds.includes(child.id)) return false;
      const entry = getEntry(child.id, dateStr);
      return entry && (entry.segments.some(seg => seg.arrivalTime || seg.leavingTime) || entry.isAbsent);
    });
  };

  // Helper: Check if a child is hidden for a specific date
  const isChildHidden = (childId: string, dateStr: string): boolean => {
    return hiddenChildren[dateStr]?.includes(childId) || false;
  };

  // Helper: Hide a child for a specific date
  const hideChild = (childId: string, dateStr: string) => {
    setHiddenChildren(prev => ({
      ...prev,
      [dateStr]: [...(prev[dateStr] || []), childId]
    }));
  };

  // Helper: Show a hidden child for a specific date
  const showChild = (childId: string, dateStr: string) => {
    setHiddenChildren(prev => ({
      ...prev,
      [dateStr]: (prev[dateStr] || []).filter(id => id !== childId)
    }));
  };

  // Helper: Get all children to display for a date (expected + unexpected if toggled, minus hidden)
  const getChildrenForDate = (date: Date): Child[] => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const expected = getExpectedChildrenForDate(date);
    const unexpected = getUnexpectedChildrenForDate(date);
    
    let childrenToShow: Child[];
    
    if (showAllChildren[dateStr]) {
      childrenToShow = children;
    } else {
      childrenToShow = [...expected, ...unexpected];
    }
    
    // Filter out hidden children
    return childrenToShow.filter(child => !isChildHidden(child.id, dateStr));
  };

  // Helper: Get hidden children for a specific date
  const getHiddenChildrenForDate = (dateStr: string): Child[] => {
    const hiddenIds = hiddenChildren[dateStr] || [];
    return children.filter(child => hiddenIds.includes(child.id));
  };

  // Toggle showing all children for a specific date
  const toggleShowAllChildren = (dateStr: string) => {
    setShowAllChildren(prev => ({
      ...prev,
      [dateStr]: !prev[dateStr]
    }));
  };

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
    // Legacy function - kept for compatibility but will be replaced by handleEntryUpdate
    let entry = await StorageService.getTimeEntry(childId, date);
    
    if (!entry) {
      entry = {
        id: `${childId}-${date}`,
        childId,
        date,
        segments: [{ id: '1', arrivalTime: null, leavingTime: null }],
        isAbsent: false,
        hasMeal: null,
        notes: '',
      };
    }

    // Convert old format to new if needed
    await StorageService.saveTimeEntry(entry);
    await loadEntries();
  };

  const handleEntryUpdate = async (entry: TimeEntry) => {
    // Save to backend
    await StorageService.saveTimeEntry(entry);
    
    // Update local state without full reload to prevent flickering
    setEntries(prevEntries => {
      const index = prevEntries.findIndex(e => e.id === entry.id);
      if (index >= 0) {
        // Update existing entry
        const newEntries = [...prevEntries];
        newEntries[index] = entry;
        return newEntries;
      } else {
        // Add new entry
        return [...prevEntries, entry];
      }
    });
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

  const handleExport = () => {
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

    exportTimeEntries(children, entries, start, end);
  };

  const getDisplayDates = (): Date[] => {
    if (viewMode === 'day') {
      return [currentDate];
    } else if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      const allDays = eachDayOfInterval({ start, end });
      // Filter out weekends (Saturday=6, Sunday=0)
      return allDays.filter(date => {
        const day = date.getDay();
        return day !== 0 && day !== 6;
      });
    } else {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      const allDays = eachDayOfInterval({ start, end });
      // Filter out weekends
      return allDays.filter(date => {
        const day = date.getDay();
        return day !== 0 && day !== 6;
      });
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
        <Paper 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f3e5f5 0%, #fff 100%)',
            border: '2px dashed',
            borderColor: 'primary.light',
          }}
        >
          <Typography variant="h6" color="primary" gutterBottom>
            👶 Aucun enfant enregistré
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Veuillez d'abord ajouter des enfants dans la section "Enfants".
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, mb: 10, px: { xs: 1, sm: 2, md: 3 } }}>
      <Box 
        sx={{ 
          mb: { xs: 2, md: 3 }, 
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: { xs: 1, md: 2 } }}>
          <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 700, fontSize: { xs: '1.5rem', md: '2rem' } }}>
            📅 Calendrier
          </Typography>
          <Box sx={{ display: 'flex', gap: { xs: 1, md: 2 }, alignItems: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<TodayIcon />}
              onClick={() => setCurrentDate(new Date())}
              size="small"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              Aujourd'hui
            </Button>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, newMode) => newMode && setViewMode(newMode)}
              size="small"
              sx={{
                bgcolor: 'white',
                '& .MuiToggleButton-root': {
                  color: 'primary.main',
                  fontWeight: 600,
                  '&.Mui-selected': {
                    bgcolor: 'secondary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'secondary.dark',
                    },
                  },
                },
              }}
            >
              <ToggleButton value="day">📆 Jour</ToggleButton>
              <ToggleButton value="week">📅 Semaine</ToggleButton>
              <ToggleButton value="month">🗓️ Mois</ToggleButton>
            </ToggleButtonGroup>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              size="small"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              Exporter
            </Button>
          </Box>
        </Box>
      </Box>

      <Box 
        sx={{ 
          mb: 3, 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: 2,
        }}
      >
        <IconButton 
          onClick={navigatePrev}
          sx={{
            bgcolor: 'primary.light',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.main',
            },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
        <Typography 
          variant="h6" 
          sx={{ 
            textTransform: 'capitalize',
            fontWeight: 600,
            color: 'primary.main',
          }}
        >
          {getHeaderText()}
        </Typography>
        <IconButton 
          onClick={navigateNext}
          sx={{
            bgcolor: 'primary.light',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.main',
            },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {/* Day and Week View - One date at a time with all children */}
      {(viewMode === 'day' || viewMode === 'week') && (
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {displayDates.map((date) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            
            return (
              <Grid item xs={12} sm={viewMode === 'week' ? 6 : 12} md={viewMode === 'day' ? 12 : 6} lg={viewMode === 'day' ? 12 : 4} key={dateStr}>
                <Paper 
                  elevation={isToday ? 8 : 2}
                  sx={{ 
                    p: { xs: 2, md: 3 }, 
                    borderRadius: { xs: 2, md: 3 },
                    background: isToday 
                      ? 'linear-gradient(135deg, #f8bbd0 0%, #f48fb1 50%, #f06292 100%)'
                      : 'white',
                    border: isToday ? '3px solid' : '1px solid',
                    borderColor: isToday ? 'secondary.main' : 'divider',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 8,
                    },
                  }}
                >
                  <Box sx={{ mb: { xs: 1.5, md: 2 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        textTransform: 'capitalize',
                        fontWeight: 700,
                        color: isToday ? 'white' : 'primary.main',
                        fontSize: { xs: '1rem', md: '1.25rem' },
                      }}
                    >
                      {format(date, 'EEEE d MMMM', { locale: fr })}
                    </Typography>
                    {isToday && (
                      <Chip 
                        label="✨ Aujourd'hui" 
                        size="small" 
                        sx={{
                          bgcolor: 'white',
                          color: 'secondary.main',
                          fontWeight: 700,
                          fontSize: { xs: '0.7rem', md: '0.8125rem' },
                        }}
                      />
                    )}
                  </Box>
                  {getChildrenForDate(date).map((child) => (
                    <DayEntryCard
                      key={child.id}
                      child={child}
                      entry={getEntry(child.id, dateStr)}
                      date={dateStr}
                      onUpdate={handleEntryUpdate}
                      onHide={() => hideChild(child.id, dateStr)}
                    />
                  ))}
                  
                  {/* Show hidden children */}
                  {getHiddenChildrenForDate(dateStr).length > 0 && (
                    <Box sx={{ mt: { xs: 1.5, md: 2 }, p: { xs: 1.5, md: 2 }, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block', fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                        Enfants masqués ({getHiddenChildrenForDate(dateStr).length})
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {getHiddenChildrenForDate(dateStr).map((child) => (
                          <Chip
                            key={child.id}
                            label={child.name}
                            size="small"
                            onDelete={() => showChild(child.id, dateStr)}
                            sx={{
                              bgcolor: 'white',
                              '&:hover': {
                                bgcolor: 'primary.light',
                                color: 'white',
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  {/* Button to show/hide all children */}
                  {!showAllChildren[dateStr] && getChildrenForDate(date).length < children.length && (
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      onClick={() => toggleShowAllChildren(dateStr)}
                      sx={{ 
                        mt: { xs: 1.5, md: 2 },
                        py: { xs: 0.75, md: 1 },
                        fontSize: { xs: '0.8rem', md: '0.875rem' },
                        borderStyle: 'dashed',
                        color: 'primary.main',
                        '&:hover': {
                          borderStyle: 'dashed',
                          bgcolor: 'primary.light',
                          color: 'white',
                        },
                      }}
                    >
                      + Ajouter un enfant non prévu ({children.length - getChildrenForDate(date).length})
                    </Button>
                  )}
                  {showAllChildren[dateStr] && (
                    <Button
                      fullWidth
                      variant="text"
                      size="small"
                      onClick={() => toggleShowAllChildren(dateStr)}
                      sx={{ 
                        mt: { xs: 1.5, md: 2 },
                        py: { xs: 0.75, md: 1 },
                        fontSize: { xs: '0.8rem', md: '0.875rem' },
                        color: 'text.secondary',
                      }}
                    >
                      Masquer les enfants non prévus
                    </Button>
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Month View - All days in a grid */}
      {viewMode === 'month' && (
        <Box>
          {children.map((child) => (
            <Paper key={child.id} sx={{ p: { xs: 1.5, md: 2 }, mb: { xs: 1.5, md: 2 }, borderRadius: { xs: 2, md: 3 } }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                {child.name}
              </Typography>
              <Grid container spacing={{ xs: 0.5, md: 1 }}>
                {displayDates.map((date) => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  const entry = getEntry(child.id, dateStr);
                  const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                  const hasData = entry && (
                    entry.segments.some(seg => seg.arrivalTime || seg.leavingTime) || 
                    entry.isAbsent
                  );

                  return (
                    <Grid item xs={6} sm={4} md={4} lg={3} key={dateStr}>
                      <Box
                        sx={{
                          p: { xs: 0.75, md: 1 },
                          border: '1px solid',
                          borderColor: isToday ? 'primary.main' : hasData ? 'success.light' : 'divider',
                          borderRadius: 1,
                          bgcolor: entry?.isAbsent ? '#ffebee' : isToday ? 'primary.50' : 'background.paper',
                          cursor: 'pointer',
                          minHeight: { xs: '60px', md: '80px' },
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: isToday ? 'bold' : 'normal', fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                          {format(date, 'd MMM', { locale: fr })}
                        </Typography>
                        <DayEntryCard
                          child={child}
                          entry={entry}
                          date={dateStr}
                          onUpdate={handleEntryUpdate}
                        />
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default CalendarView;
