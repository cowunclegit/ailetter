import React, { useState } from 'react';
import axios from 'axios';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Card, 
  CardContent,
  CircularProgress
} from '@mui/material';
import { useFeedback } from '../contexts/FeedbackContext';

const API_URL = '/api'; // Or process.env...

const Public = ({ type }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showFeedback } = useFeedback();

  if (type === 'success') {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Card sx={{ width: '100%', p: 2, textAlign: 'center' }}>
            <CardContent>
              <Typography variant="h4" color="success.main" gutterBottom>
                Confirmed!
              </Typography>
              <Typography variant="body1">
                The newsletter is being sent to all active subscribers.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  }

  if (type === 'failed') {
    const params = new URLSearchParams(window.location.search);
    const reason = params.get('reason');
    let message = 'The confirmation link is invalid or has expired.';
    if (reason === 'processed') message = 'This newsletter has already been processed.';
    if (reason === 'expired') message = 'This confirmation link has expired (24h limit).';

    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Card sx={{ width: '100%', p: 2, textAlign: 'center' }}>
            <CardContent>
              <Typography variant="h4" color="error.main" gutterBottom>
                Confirmation Failed
              </Typography>
              <Typography variant="body1">
                {message}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  }

  const handleSubscribe = async () => {
    if (!email) {
       showFeedback('Please enter an email address', 'error');
       return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/subscribers`, { email });
      showFeedback('Subscribed successfully!', 'success');
      setEmail('');
    } catch (error) {
      showFeedback(error.response?.data?.message || 'Subscription failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Card sx={{ width: '100%', p: 2 }}>
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Subscribe to our Newsletter
            </Typography>
            <Typography variant="body1" color="textSecondary" align="center" paragraph>
              Get the latest AI trends delivered to your inbox weekly.
            </Typography>
            <Box component="form" noValidate autoComplete="off">
              <TextField
                label="Email Address"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                disabled={loading}
              />
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSubscribe} 
                fullWidth 
                size="large"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Subscribe'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Public;