import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Fab,
  FormControlLabel,
  Checkbox,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import { Child } from '../types';
import { StorageService } from '../services/storage';
import { exportChildrenList } from '../utils/export';

const ChildrenManagement: React.FC = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    defaultArrivalTime: '08:00',
    defaultLeavingTime: '17:00',
    hasMeal: true,
    hasSnack: true,
  });

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    const data = await StorageService.getChildren();
    setChildren(data);
  };

  const handleOpenDialog = (child?: Child) => {
    if (child) {
      setEditingChild(child);
      setFormData({
        name: child.name,
        defaultArrivalTime: child.defaultArrivalTime,
        defaultLeavingTime: child.defaultLeavingTime,
        hasMeal: child.hasMeal ?? true,
        hasSnack: child.hasSnack ?? true,
      });
    } else {
      setEditingChild(null);
      setFormData({
        name: '',
        defaultArrivalTime: '08:00',
        defaultLeavingTime: '17:00',
        hasMeal: true,
        hasSnack: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingChild(null);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;

    if (editingChild) {
      await StorageService.updateChild({
        ...editingChild,
        ...formData,
      });
    } else {
      const newChild: Child = {
        id: Date.now().toString(),
        ...formData,
      };
      await StorageService.addChild(newChild);
    }

    await loadChildren();
    handleCloseDialog();
  };

  const handleDelete = async (childId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet enfant ?')) {
      await StorageService.deleteChild(childId);
      await loadChildren();
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 10 }}>
      <Box 
        sx={{ 
          mb: 3, 
          p: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 700 }}>
            👶 Gestion des Enfants
          </Typography>
          {children.length > 0 && (
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => exportChildrenList(children)}
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
          )}
        </Box>
      </Box>

      {children.length === 0 ? (
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
          <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
            👶 Aucun enfant enregistré
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Cliquez sur le bouton + pour ajouter un enfant.
          </Typography>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <List>
            {children.map((child, index) => (
              <ListItem 
                key={child.id} 
                divider
                sx={{
                  py: 2,
                  background: index % 2 === 0 ? 'linear-gradient(90deg, #f3e5f5 0%, #fff 100%)' : 'white',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #e1bee7 0%, #f3e5f5 100%)',
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      👶 {child.name}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={`⏰ Arrivée: ${child.defaultArrivalTime}`} 
                        size="small" 
                        sx={{ 
                          bgcolor: 'primary.light',
                          color: 'white',
                          fontWeight: 500,
                        }}
                      />
                      <Chip 
                        label={`🏠 Départ: ${child.defaultLeavingTime}`} 
                        size="small" 
                        sx={{ 
                          bgcolor: 'secondary.light',
                          color: 'white',
                          fontWeight: 500,
                        }}
                      />
                      {child.hasMeal && (
                        <Chip 
                          label="🍽️ Repas" 
                          size="small" 
                          sx={{ 
                            bgcolor: 'success.light',
                            color: 'white',
                            fontWeight: 500,
                          }}
                        />
                      )}
                      {child.hasSnack && (
                        <Chip 
                          label="🍪 Goûter" 
                          size="small" 
                          sx={{ 
                            bgcolor: 'warning.light',
                            color: 'white',
                            fontWeight: 500,
                          }}
                        />
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    onClick={() => handleOpenDialog(child)} 
                    sx={{ 
                      mr: 1,
                      bgcolor: 'secondary.light',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'secondary.main',
                      },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    edge="end" 
                    onClick={() => handleDelete(child.id)}
                    sx={{
                      bgcolor: 'error.light',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'error.main',
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      <Fab
        aria-label="add"
        sx={{ 
          position: 'fixed', 
          bottom: 80, 
          right: 16,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          width: 64,
          height: 64,
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.5)',
          '&:hover': {
            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            transform: 'scale(1.1) rotate(90deg)',
            boxShadow: '0 12px 48px rgba(102, 126, 234, 0.6)',
          },
          transition: 'all 0.3s ease',
        }}
        onClick={() => handleOpenDialog()}
      >
        <AddIcon />
      </Fab>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingChild ? 'Modifier l\'enfant' : 'Ajouter un enfant'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              autoFocus
              fullWidth
              label="Nom"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Heure d'arrivée par défaut"
              type="time"
              value={formData.defaultArrivalTime}
              onChange={(e) => setFormData({ ...formData, defaultArrivalTime: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Heure de départ par défaut"
              type="time"
              value={formData.defaultLeavingTime}
              onChange={(e) => setFormData({ ...formData, defaultLeavingTime: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.hasMeal}
                  onChange={(e) => setFormData({ ...formData, hasMeal: e.target.checked })}
                />
              }
              label="Prend le repas par défaut"
              sx={{ mt: 2 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.hasSnack}
                  onChange={(e) => setFormData({ ...formData, hasSnack: e.target.checked })}
                />
              }
              label="Prend le goûter par défaut"
              sx={{ mt: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingChild ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ChildrenManagement;
