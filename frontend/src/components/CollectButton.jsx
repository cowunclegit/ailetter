import React, { useState, useEffect } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { trendsApi } from '../api/trendsApi';
import { useFeedback } from '../contexts/FeedbackContext';

const CollectButton = ({ variant = "contained", color = "primary", onComplete, ...props }) => {
  const [loading, setLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const { showFeedback } = useFeedback();

  useEffect(() => {
    let intervalId;
    let polls = 0;
    const maxPolls = 150; // 5 minutes (150 * 2s)

    if (isPolling) {
      intervalId = setInterval(async () => {
        polls++;
        if (polls > maxPolls) {
           clearInterval(intervalId);
           setIsPolling(false);
           setLoading(false);
           showFeedback('Collection timed out (5m). Please check logs.', 'error');
           return;
        }

        try {
          const status = await trendsApi.getCollectionStatus();
          if (!status.isCollecting) {
            setIsPolling(false);
            setLoading(false);
            if (onComplete) onComplete();
          }
        } catch (error) {
          console.error('Polling error:', error);
          setIsPolling(false);
          setLoading(false);
          showFeedback('Error checking collection status.', 'error');
        }
      }, 2000);
    }
    return () => clearInterval(intervalId);
  }, [isPolling, onComplete, showFeedback]);

  const handleClick = async () => {
    setLoading(true);
    try {
      await trendsApi.triggerCollection();
      setIsPolling(true);
      showFeedback('Collection started...', 'info');
    } catch (error) {
      console.error(error);
      const msg = error.response?.status === 409 
        ? 'Collection already in progress.' 
        : 'Failed to start collection';
      showFeedback(msg, error.response?.status === 409 ? 'warning' : 'error');
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      color={color}
      onClick={handleClick}
      disabled={loading}
      {...props}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : 'Collect Now'}
    </Button>
  );
};

export default CollectButton;
