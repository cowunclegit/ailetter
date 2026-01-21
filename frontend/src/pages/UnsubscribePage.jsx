import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Box, Card, CardContent, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { unsubscribeSubscriber } from '../api/subscribers';

const UnsubscribePage = () => {
  const { uuid } = useParams();
  const [status, setStatus] = useState('confirm'); // confirm, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  const handleUnsubscribe = async () => {
    setStatus('loading');
    try {
      await unsubscribeSubscriber(uuid);
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
      setErrorMsg(error.response?.data?.error || 'Failed to unsubscribe. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Card sx={{ width: '100%', p: 2, textAlign: 'center' }}>
          <CardContent>
            {status === 'confirm' && (
              <>
                <Typography variant="h5" gutterBottom>
                  Unsubscribe from AILetter
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph>
                  Are you sure you want to stop receiving these emails?
                </Typography>
                <Button 
                  variant="contained" 
                  color="error" 
                  size="large" 
                  onClick={handleUnsubscribe}
                >
                  Unsubscribe
                </Button>
              </>
            )}

            {status === 'loading' && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress />
              </Box>
            )}

            {status === 'success' && (
              <>
                <Typography variant="h5" color="success.main" gutterBottom>
                  Unsubscribed
                </Typography>
                <Typography variant="body1" paragraph>
                  You have been successfully removed from the mailing list.
                </Typography>
                <Button component={Link} to="/" variant="outlined">
                  Return Home
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errorMsg}
                </Alert>
                <Button variant="contained" onClick={handleUnsubscribe}>
                  Try Again
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default UnsubscribePage;
