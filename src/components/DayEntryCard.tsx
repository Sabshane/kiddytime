import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  IconButton,
  Chip,
  FormControlLabel,
  Checkbox,
  Button,
  Collapse,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CloseIcon from '@mui/icons-material/Close';
import { Child, TimeEntry, TimeSegment } from '../types';
import { shouldHaveMeal, shouldHaveSnack } from '../utils/timeUtils';

// Predefined absence reasons
const ABSENCE_REASONS = ['Malade', 'Vacances', 'Autre'];

interface DayEntryCardProps {
  child: Child;
  entry: TimeEntry | undefined;
  date: string;
  onUpdate: (entry: TimeEntry) => void;
  onHide?: () => void; // Callback to hide this child for this date
}

const DayEntryCard: React.FC<DayEntryCardProps> = ({ child, entry, date, onUpdate, onHide }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Work directly with props, no local state
  const currentEntry: TimeEntry = entry || {
    id: `${child.id}-${date}`,
    childId: child.id,
    date,
    segments: [{ id: '1', arrivalTime: null, leavingTime: null }],
    isAbsent: false,
    hasMeal: null,
    hasSnack: null,
    notes: '',
  };
  
  // Determine if custom reason is being used
  const isCustomReason = currentEntry.absenceReason && 
    !ABSENCE_REASONS.slice(0, -1).includes(currentEntry.absenceReason);
  
  const [selectedReason, setSelectedReason] = useState<string>(() => {
    if (!currentEntry.absenceReason) return '';
    if (ABSENCE_REASONS.slice(0, -1).includes(currentEntry.absenceReason)) {
      return currentEntry.absenceReason;
    }
    return 'Autre';
  });
  
  const [customReason, setCustomReason] = useState<string>(
    isCustomReason ? currentEntry.absenceReason || '' : ''
  );
  
  // Sync local state when entry changes
  useEffect(() => {
    if (currentEntry.absenceReason) {
      if (ABSENCE_REASONS.slice(0, -1).includes(currentEntry.absenceReason)) {
        setSelectedReason(currentEntry.absenceReason);
        setCustomReason('');
      } else {
        setSelectedReason('Autre');
        setCustomReason(currentEntry.absenceReason);
      }
    } else {
      setSelectedReason('');
      setCustomReason('');
    }
  }, [currentEntry.absenceReason]);
  
  const handleReasonChange = (reason: string) => {
    setSelectedReason(reason);
    if (reason === 'Autre') {
      onUpdate({ ...currentEntry, absenceReason: customReason });
    } else {
      setCustomReason('');
      onUpdate({ ...currentEntry, absenceReason: reason });
    }
  };
  
  const handleCustomReasonChange = (value: string) => {
    setCustomReason(value);
    onUpdate({ ...currentEntry, absenceReason: value });
  };

  const handleSegmentChange = (segmentId: string, field: 'arrivalTime' | 'leavingTime', value: string) => {
    const updatedSegments = currentEntry.segments.map(seg =>
      seg.id === segmentId ? { ...seg, [field]: value || null } : seg
    );
    onUpdate({ ...currentEntry, segments: updatedSegments });
  };

  const handleAddSegment = () => {
    const newSegment: TimeSegment = {
      id: Date.now().toString(),
      arrivalTime: null,
      leavingTime: null,
    };
    onUpdate({ ...currentEntry, segments: [...currentEntry.segments, newSegment] });
  };

  const handleRemoveSegment = (segmentId: string) => {
    if (currentEntry.segments.length > 1) {
      const updatedSegments = currentEntry.segments.filter(seg => seg.id !== segmentId);
      onUpdate({ ...currentEntry, segments: updatedSegments });
    }
  };

  const handleAbsenceChange = (isAbsent: boolean) => {
    onUpdate({ ...currentEntry, isAbsent, absenceReason: isAbsent ? currentEntry.absenceReason : '' });
  };

  const handleMealChange = (hasMeal: boolean) => {
    onUpdate({ ...currentEntry, hasMeal });
  };

  const handleSnackChange = (hasSnack: boolean) => {
    onUpdate({ ...currentEntry, hasSnack });
  };

  const calculateTotalDuration = () => {
    let totalMinutes = 0;
    currentEntry.segments.forEach(segment => {
      if (segment.arrivalTime && segment.leavingTime) {
        const [arrH, arrM] = segment.arrivalTime.split(':').map(Number);
        const [leaveH, leaveM] = segment.leavingTime.split(':').map(Number);
        const duration = (leaveH * 60 + leaveM) - (arrH * 60 + arrM);
        if (duration > 0) totalMinutes += duration;
      }
    });
    if (totalMinutes === 0) return null;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes.toString().padStart(2, '0')}`;
  };

  const hasData = currentEntry.segments.some(seg => seg.arrivalTime || seg.leavingTime) || 
                  currentEntry.isAbsent;

  // Déterminer si l'enfant prend le repas/goûter en fonction des horaires
  const autoMeal = shouldHaveMeal(currentEntry.segments);
  const autoSnack = shouldHaveSnack(currentEntry.segments);
  
  // Utiliser la valeur explicite, sinon la valeur auto calculée, sinon le défaut de l'enfant
  const mealStatus = currentEntry.hasMeal !== null 
    ? currentEntry.hasMeal 
    : (autoMeal ? true : child.hasMeal);
  
  const snackStatus = currentEntry.hasSnack !== null 
    ? currentEntry.hasSnack 
    : (autoSnack ? true : child.hasSnack);
  
  const duration = calculateTotalDuration();

  return (
    <Card 
      sx={{ 
        mb: 2,
        borderRadius: 2,
        border: currentEntry.isAbsent 
          ? '2px solid' 
          : hasData 
          ? '2px solid' 
          : '1px solid #e0e0e0',
        borderColor: currentEntry.isAbsent 
          ? 'error.main' 
          : hasData 
          ? 'primary.light'
          : '#e0e0e0',
        background: currentEntry.isAbsent 
          ? 'linear-gradient(135deg, #fff5f5 0%, #ffebee 100%)'
          : hasData
          ? 'linear-gradient(135deg, #f3e5f5 0%, #fff 100%)'
          : 'white',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {child.name}
            </Typography>
            {mealStatus && !currentEntry.isAbsent && (
              <Chip 
                icon={<RestaurantIcon />} 
                label="Repas" 
                size="small" 
                sx={{
                  background: 'linear-gradient(135deg, #f48fb1 0%, #f06292 100%)',
                  color: 'white',
                  fontWeight: 500,
                }}
              />
            )}
            {snackStatus && !currentEntry.isAbsent && (
              <Chip 
                label="🍪 Goûter" 
                size="small" 
                sx={{
                  background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                  color: 'white',
                  fontWeight: 500,
                }}
              />
            )}
            {duration && (
              <Chip 
                label={duration} 
                size="small" 
                sx={{
                  background: 'linear-gradient(135deg, #7e57c2 0%, #5e35b1 100%)',
                  color: 'white',
                  fontWeight: 600,
                }}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {/* Hide button - only show if no data and onHide provided */}
            {onHide && !hasData && (
              <IconButton 
                size="small" 
                onClick={onHide}
                sx={{
                  bgcolor: 'grey.100',
                  '&:hover': {
                    bgcolor: 'error.light',
                    color: 'error.main',
                  },
                }}
                title="Masquer cet enfant pour ce jour"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton 
              size="small" 
              onClick={() => setExpanded(!expanded)}
              sx={{
                bgcolor: expanded ? 'primary.light' : 'grey.100',
                '&:hover': {
                  bgcolor: expanded ? 'primary.main' : 'primary.light',
                  color: 'white',
                },
              }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* Quick Status */}
        {!expanded && !currentEntry.isAbsent && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {currentEntry.segments.map((segment, idx) => (
              <Chip
                key={segment.id}
                label={
                  segment.arrivalTime && segment.leavingTime
                    ? `⏰ ${segment.arrivalTime} - ${segment.leavingTime}`
                    : segment.arrivalTime
                    ? `🟢 Arrivé à ${segment.arrivalTime}`
                    : '⚪ Non renseigné'
                }
                size="small"
                sx={{
                  background: segment.arrivalTime 
                    ? 'linear-gradient(135deg, #ba68c8 0%, #9c27b0 100%)'
                    : 'transparent',
                  color: segment.arrivalTime ? 'white' : 'text.secondary',
                  border: segment.arrivalTime ? 'none' : '1px solid #e0e0e0',
                  fontWeight: 500,
                }}
              />
            ))}
          </Box>
        )}

        {currentEntry.isAbsent && !expanded && (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              p: 1.5,
              borderRadius: 2,
              bgcolor: 'error.light',
              border: '2px solid',
              borderColor: 'error.main',
            }}
          >
            <EventBusyIcon sx={{ color: 'error.dark' }} />
            <Typography variant="body2" sx={{ color: 'error.dark', fontWeight: 600 }}>
              Absent {currentEntry.absenceReason && `• ${currentEntry.absenceReason}`}
            </Typography>
          </Box>
        )}

        {/* Detailed View */}
        <Collapse in={expanded}>
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={currentEntry.isAbsent}
                  onChange={(e) => handleAbsenceChange(e.target.checked)}
                  color="error"
                />
              }
              label="Absent"
            />

            {currentEntry.isAbsent ? (
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Raison de l'absence</InputLabel>
                  <Select
                    value={selectedReason}
                    label="Raison de l'absence"
                    onChange={(e) => handleReasonChange(e.target.value)}
                  >
                    {ABSENCE_REASONS.map((reason) => (
                      <MenuItem key={reason} value={reason}>
                        {reason}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {selectedReason === 'Autre' && (
                  <TextField
                    fullWidth
                    label="Précisez la raison"
                    value={customReason}
                    onChange={(e) => handleCustomReasonChange(e.target.value)}
                    size="small"
                    sx={{ mt: 2 }}
                    placeholder="Ex: Rendez-vous médical"
                  />
                )}
              </Box>
            ) : (
              <>
                {/* Time Segments */}
                <Box sx={{ mt: 2 }}>
                  {currentEntry.segments.map((segment, idx) => (
                    <Box key={segment.id} sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ minWidth: 60 }}>
                        Bloc {idx + 1}
                      </Typography>
                      <TextField
                        label="Arrivée"
                        type="time"
                        size="small"
                        value={segment.arrivalTime || ''}
                        onChange={(e) => handleSegmentChange(segment.id, 'arrivalTime', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ flex: 1 }}
                      />
                      <TextField
                        label="Départ"
                        type="time"
                        size="small"
                        value={segment.leavingTime || ''}
                        onChange={(e) => handleSegmentChange(segment.id, 'leavingTime', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ flex: 1 }}
                      />
                      {currentEntry.segments.length > 1 && (
                        <IconButton 
                          size="small" 
                          onClick={() => handleRemoveSegment(segment.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleAddSegment}
                    variant="outlined"
                  >
                    Ajouter un bloc horaire
                  </Button>
                </Box>

                {/* Meal Checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={mealStatus}
                      onChange={(e) => handleMealChange(e.target.checked)}
                    />
                  }
                  label="Prend le repas"
                  sx={{ mt: 2 }}
                />

                {/* Snack Checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={snackStatus}
                      onChange={(e) => handleSnackChange(e.target.checked)}
                    />
                  }
                  label="Prend le goûter"
                  sx={{ mt: 1 }}
                />

                {/* Notes */}
                <TextField
                  fullWidth
                  label="Notes"
                  value={currentEntry.notes || ''}
                  onChange={(e) => onUpdate({ ...currentEntry, notes: e.target.value })}
                  size="small"
                  multiline
                  rows={2}
                  sx={{ mt: 2 }}
                />
              </>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default DayEntryCard;
