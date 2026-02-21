import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Box, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventIcon from '@mui/icons-material/Event';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './views/Login';
import CalendarView from './views/CalendarView';
import FullCalendarView from './views/FullCalendarView';
import ChildrenManagement from './views/ChildrenManagement';

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(0);

  // Update selected tab based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/calendar' || path === '/') {
      setSelectedTab(0);
    } else if (path === '/fullcalendar') {
      setSelectedTab(1);
    } else if (path === '/children') {
      setSelectedTab(2);
    }
  }, [location.pathname]);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Box sx={{ pb: 7 }}>
      <Routes>
        <Route path="/" element={<Navigate to="/calendar" replace />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/fullcalendar" element={<FullCalendarView />} />
        <Route path="/children" element={<ChildrenManagement />} />
      </Routes>

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
            onClick={() => navigate('/calendar')}
          />
          <BottomNavigationAction
            label="Calendrier"
            icon={<EventIcon />}
            onClick={() => navigate('/fullcalendar')}
          />
          <BottomNavigationAction
            label="Enfants"
            icon={<ChildCareIcon />}
            onClick={() => navigate('/children')}
          />
          <BottomNavigationAction
            label="Déconnexion"
            icon={<LogoutIcon />}
            onClick={logout}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
