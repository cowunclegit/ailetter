import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { FeedbackProvider } from './contexts/FeedbackContext';
import { SocketProvider } from './contexts/SocketContext';
import FeedbackSnackbar from './components/common/FeedbackSnackbar';
import Layout from './components/layout/Layout';

// Import pages (assuming they exist based on main.jsx content)
import Dashboard from './pages/Dashboard';
import Sources from './pages/Sources';
import CategoryManagement from './pages/CategoryManagement';
import Public from './pages/Public';
import NewsletterHistory from './pages/NewsletterHistory';
import NewsletterDraft from './pages/NewsletterDraft';
import NewsletterDetails from './pages/NewsletterDetails';
import Settings from './pages/Settings';
import DebugPage from './pages/Debug';
import SubscribersPage from './pages/SubscribersPage';
import UnsubscribePage from './pages/UnsubscribePage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FeedbackProvider>
        <SocketProvider>
          <Router>
            <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/newsletters/:id" element={<NewsletterDetails />} />
              <Route path="/newsletters/:id/draft" element={<NewsletterDraft />} />
              <Route path="/sources" element={<Sources />} />
              <Route path="/categories" element={<CategoryManagement />} />
              <Route path="/subscribers" element={<SubscribersPage />} />
              <Route path="/history" element={<NewsletterHistory />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/subscribe" element={<Public />} />
              <Route path="/unsubscribe/:uuid" element={<UnsubscribePage />} />
              <Route path="/unsubscribe" element={<Public />} />
              <Route path="/confirmation-success" element={<Public type="success" />} />
              <Route path="/confirmation-failed" element={<Public type="failed" />} />
              <Route path="/debug" element={<DebugPage />} />
            </Routes>
                      </Layout>
                      <FeedbackSnackbar />
                    </Router>
                  </SocketProvider>
                </FeedbackProvider>
              </ThemeProvider>
          
  );
}

export default App;
