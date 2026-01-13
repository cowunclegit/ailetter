import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useFeedback } from '../../contexts/FeedbackContext';

const FeedbackSnackbar = () => {
  const { snackbar, closeFeedback } = useFeedback();

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={closeFeedback}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Alert onClose={closeFeedback} severity={snackbar.severity} sx={{ width: '100%' }}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

export default FeedbackSnackbar;
