import React from 'react';
import { Box, Paper, Typography, Button, CircularProgress } from '@mui/material';

const NewsletterPreview = ({ subject, html, loading, onSendTest, sendingTest }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">Newsletter Preview</Typography>
        <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
          Subject: {subject || '(No Subject)'}
        </Typography>
      </Box>
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 0, 
          mb: 2, 
          overflow: 'hidden',
          minHeight: '400px',
          backgroundColor: '#fff'
        }}
      >
        <iframe
          srcDoc={html}
          title="Newsletter Preview"
          width="100%"
          height="600px"
          style={{ border: 'none' }}
        />
      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={onSendTest}
          disabled={sendingTest}
        >
          {sendingTest ? <CircularProgress size={24} color="inherit" /> : 'Send Test Mail to Admin'}
        </Button>
      </Box>
    </Box>
  );
};

export default NewsletterPreview;
