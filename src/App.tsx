import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventIcon from '@mui/icons-material/Event';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './views/Login';
import CalendarView from './views/CalendarView';
import FullCalendarView from './views/FullCalendarView';
import ChildrenManagement from './views/ChildrenManagement';

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Router>
      <Box sx={{ pb: 7 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/calendar" replace />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/fullcalendar" element={<FullCalendarView />} />
          <Route path="/children" element={<ChildrenManagement />} />
        </Routes>
      </Box>

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1100 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={selectedTab}
          onChange={(_, newValue) => {
            setSelectedTab(newValue);
          }}
        >
          <BottomNavigationAction
            label="Cartes"
            icon={<CalendarMonthIcon />}
            onClick={() => window.location.href = '/calendar'}
          />
          <BottomNavigationAction
            label="Calendrier"
            icon={<EventIcon />}
            onClick={() => window.location.href = '/fullcalendar'}
          />
          <BottomNavigationAction
            label="Enfants"
            icon={<ChildCareIcon />}
            onClick={() => window.location.href = '/children'}
          />
          <BottomNavigationAction
            label="Déconnexion"
            icon={<LogoutIcon />}
            onClick={logout}
          />
        </BottomNavigation>
      </Paper>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
