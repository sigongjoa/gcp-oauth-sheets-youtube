import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DrivePage from './pages/DrivePage';
import SheetsPage from './pages/SheetsPage';
import DocsPage from './pages/DocsPage';
import YouTubePage from './pages/YouTubePage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';

function App() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar isAuthenticated={isAuthenticated} logout={logout} />
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/drive" element={<DrivePage />} />
          <Route path="/sheets" element={<SheetsPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/youtube" element={<YouTubePage />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </div>
  );
}

export default App;