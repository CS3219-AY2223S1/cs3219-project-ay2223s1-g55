import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import SignupPage from './components/SignupPage';
import NotFoundPage from './components/NotFoundPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import ChangePasswordPage from './components/ChangePasswordPage';

function App() {
  return (
    <div className="App">
      <Box display="flex" flexDirection="column" padding="4rem">
        <Router>
          <Routes>
            <Route exact path="/" element={<Navigate replace to="/login" />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </Box>
    </div>
  );
}

export default App;
