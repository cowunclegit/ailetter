import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { FeedbackProvider } from './contexts/FeedbackContext';
import FeedbackSnackbar from './components/common/FeedbackSnackbar';
import Layout from './components/layout/Layout';

// Import pages (assuming they exist based on main.jsx content)
import Dashboard from './pages/Dashboard';
import Sources from './pages/Sources';
import Public from './pages/Public';
import NewsletterHistory from './pages/NewsletterHistory';
import NewsletterDraft from './pages/NewsletterDraft';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FeedbackProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/newsletters/:id/draft" element={<NewsletterDraft />} />
              <Route path="/sources" element={<Sources />} />
              <Route path="/history" element={<NewsletterHistory />} />
              <Route path="/subscribe" element={<Public />} />
              <Route path="/unsubscribe" element={<Public />} />
              <Route path="/confirmation-success" element={<Public type="success" />} />
              <Route path="/confirmation-failed" element={<Public type="failed" />} />
            </Routes>
          </Layout>
          <FeedbackSnackbar />
        </Router>
      </FeedbackProvider>
    </ThemeProvider>
  );
}

export default App;
