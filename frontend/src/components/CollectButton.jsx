import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Box, Typography, LinearProgress, Tooltip } from '@mui/material';
import { trendsApi } from '../api/trendsApi';
import { useFeedback } from '../contexts/FeedbackContext';
import { useSocket } from '../contexts/SocketContext';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';

const CollectButton = ({ variant = "contained", color = "primary", onComplete, ...props }) => {
  const [loading, setLoading] = useState(false);
  const [proxyConnected, setProxyConnected] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, message: '' });
  const { showFeedback } = useFeedback();
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleProgress = (data) => {
      const { status, message, current, total } = data;
      
      if (status === 'in_progress') {
        setLoading(true);
        setProgress({ current: current || 0, total: total || 0, message: message || '' });
      } else if (status === 'complete') {
        setLoading(false);
        setProgress({ current: 0, total: 0, message: '' });
        showFeedback('Collection complete. Trends updated.', 'success');
        if (onComplete) onComplete();
      } else if (status === 'error') {
        setLoading(false);
        showFeedback(`Collection error: ${message}`, 'error');
      }
    };

    const handleProxyStatus = (data) => {
      setProxyConnected(data.connected);
    };

    socket.on('collection_progress', handleProgress);
    socket.on('proxy_status', handleProxyStatus);

    // Request initial status
    socket.emit('get_proxy_status');

    return () => {
      socket.off('collection_progress', handleProgress);
      socket.off('proxy_status', handleProxyStatus);
    };
  }, [socket, showFeedback, onComplete]);

  // Initial status check
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await trendsApi.getCollectionStatus();
        if (status.isCollecting) {
          setLoading(true);
        }
      } catch (error) {
        console.error('Error checking status:', error);
      }
    };
    checkStatus();
  }, []);

  const handleClick = async () => {
    if (!proxyConnected) {
      showFeedback('Collect Proxy is not connected. Please check service status.', 'error');
      return;
    }

    setLoading(true);
    try {
      await trendsApi.triggerCollection();
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

  const progressPercent = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 200 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          variant={variant}
          color={color}
          onClick={handleClick}
          disabled={loading || !proxyConnected}
          sx={{ flexGrow: 1 }}
          {...props}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Collect Now'}
        </Button>
        <Tooltip title={proxyConnected ? "Proxy Connected" : "Proxy Disconnected"}>
          {proxyConnected ? (
            <WifiIcon color="success" />
          ) : (
            <WifiOffIcon color="error" />
          )}
        </Tooltip>
      </Box>
      
      {loading && progress.total > 0 && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress variant="determinate" value={progressPercent} />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {progress.message} ({progress.current}/{progress.total})
          </Typography>
        </Box>
      )}
      {loading && progress.total === 0 && (
         <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', textAlign: 'center' }}>
            Initializing collection...
         </Typography>
      )}
      {!proxyConnected && !loading && (
        <Typography variant="caption" color="error" sx={{ textAlign: 'center' }}>
          Proxy disconnected - check service
        </Typography>
      )}
    </Box>
  );
};

export default CollectButton;
