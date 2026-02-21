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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Child } from '../types';
import { StorageService } from '../services/storage';

const ChildrenManagement: React.FC = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    defaultArrivalTime: '08:00',
    defaultLeavingTime: '17:00',
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
      });
    } else {
      setEditingChild(null);
      setFormData({
        name: '',
        defaultArrivalTime: '08:00',
        defaultLeavingTime: '17:00',
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
      <Typography variant="h4" component="h1" gutterBottom>
        Gestion des enfants
      </Typography>

      {children.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Aucun enfant enregistré. Cliquez sur le bouton + pour ajouter un enfant.
          </Typography>
        </Paper>
      ) : (
        <Paper>
          <List>
            {children.map((child) => (
              <ListItem key={child.id} divider>
                <ListItemText
                  primary={child.name}
                  secondary={`Arrivée: ${child.defaultArrivalTime} • Départ: ${child.defaultLeavingTime}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleOpenDialog(child)} sx={{ mr: 1 }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDelete(child.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 80, right: 16 }}
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
