import React, { useState } from 'react';
import { 
  Button, 
  Container, 
  Typography, 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions,
  Alert
} from '@mui/material';
import axios from 'axios';
import PageHeader from '../components/common/PageHeader';
import { useFeedback } from '../contexts/FeedbackContext';

const DebugPage = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showFeedback } = useFeedback();

  const handleWipe = async () => {
    setLoading(true);
    try {
      await axios.post('/api/debug/wipe');
      showFeedback('Database wiped successfully', 'success');
      setOpen(false);
    } catch (error) {
      console.error('Wipe failed:', error);
      showFeedback('Failed to wipe database', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <PageHeader title="Debug Tools" />
      
      <Box sx={{ mt: 4, p: 3, border: '1px solid #ff1744', borderRadius: 2, bgcolor: '#fff5f5' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Danger Zone
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          The following actions are destructive and cannot be undone. Use with extreme caution.
        </Typography>
        
        <Button 
          variant="contained" 
          color="error" 
          onClick={() => setOpen(true)}
          disabled={loading}
        >
          Clear Content (Keep Sources/Subscribers)
        </Button>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm Data Wipe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure? This will delete all collected trends and newsletters. 
            <strong>Sources and Subscribers will be preserved.</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleWipe} color="error" variant="contained" disabled={loading}>
            {loading ? 'Wiping...' : 'Yes, Delete Everything'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DebugPage;
