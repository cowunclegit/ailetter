import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Switch
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import SyncIcon from '@mui/icons-material/Sync';
import { getSubscribers, updateSubscriber, syncSubscribers } from '../api/subscribers';
import SubscriberForm from './SubscriberForm';

const SubscriberList = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const data = await getSubscribers();
      setSubscribers(data);
    } catch (error) {
      console.error('Failed to fetch subscribers', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleAdd = () => {
    setSelectedSubscriber(null);
    setIsFormOpen(true);
  };

  const handleEdit = (subscriber) => {
    setSelectedSubscriber(subscriber);
    setIsFormOpen(true);
  };

  const handleToggleStatus = async (subscriber) => {
    try {
      await updateSubscriber(subscriber.id, {
        is_subscribed: !subscriber.is_subscribed
      });
      fetchSubscribers();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleSync = async () => {
    try {
      setLoading(true);
      await syncSubscribers();
      await fetchSubscribers();
    } catch (error) {
      console.error('Failed to sync', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormClose = (needsRefresh) => {
    setIsFormOpen(false);
    if (needsRefresh) {
      fetchSubscribers();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Subscribers</Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<SyncIcon />} 
            onClick={handleSync} 
            sx={{ mr: 1 }}
          >
            Sync
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAdd}
          >
            Add Subscriber
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Categories</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subscribers.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell>{sub.name || '-'}</TableCell>
                <TableCell>{sub.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={sub.is_subscribed ? "Subscribed" : "Unsubscribed"} 
                    color={sub.is_subscribed ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {sub.categories?.map(cat => (
                    <Chip key={cat.id} label={cat.name} size="small" sx={{ mr: 0.5 }} />
                  ))}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={!!sub.is_subscribed}
                    onChange={() => handleToggleStatus(sub)}
                    size="small"
                  />
                  <IconButton onClick={() => handleEdit(sub)} size="small">
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {subscribers.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No subscribers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <SubscriberForm 
        key={isFormOpen ? (selectedSubscriber?.id || 'new') : 'closed'}
        open={isFormOpen} 
        onClose={handleFormClose} 
        subscriber={selectedSubscriber} 
      />
    </Box>
  );
};

export default SubscriberList;
