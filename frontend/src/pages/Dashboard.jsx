import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TrendCard from '../components/features/TrendCard';
import PageHeader from '../components/common/PageHeader';
import { get28DayRange, getISOWeek } from '../utils/dateUtils';
import { 
  Button, 
  CircularProgress, 
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Typography,
  Divider
} from '@mui/material';
import { useFeedback } from '../contexts/FeedbackContext';

const API_URL = '/api'; 

const Dashboard = () => {
  const [trends, setTrends] = useState([]);
  const [selectedTrends, setSelectedTrends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collecting, setCollecting] = useState(false);
  const [activeDraftId, setActiveDraftId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { showFeedback } = useFeedback();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeDashboard = async () => {
      setLoading(true);
      await Promise.all([fetchTrends(), detectActiveDraft()]);
      setLoading(false);
    };
    initializeDashboard();
  }, []);

  const fetchTrends = async () => {
    try {
      const { start, end } = get28DayRange();
      const response = await axios.get(`${API_URL}/trends`, { 
        params: { startDate: start, endDate: end } 
      });
      setTrends(response.data);
    } catch (error) {
      console.error('Error fetching trends:', error);
      showFeedback('Failed to load trends.', 'error');
    }
  };

  const detectActiveDraft = async () => {
    try {
      const response = await axios.get(`${API_URL}/newsletters/active-draft`);
      if (response.data) {
        setActiveDraftId(response.data.id);
        setSelectedTrends(response.data.items.map(item => item.id));
      } else {
        setActiveDraftId(null);
        setSelectedTrends([]);
      }
    } catch (error) {
      console.error('Error detecting active draft:', error);
    }
  };

  const groupedTrends = useMemo(() => {
    const groups = [];
    let currentWeek = null;

    trends.forEach(trend => {
      const week = getISOWeek(trend.published_at);
      if (week !== currentWeek) {
        currentWeek = week;
        // Determine label (simplified logic for "This Week", "Last Week")
        const nowWeek = getISOWeek(new Date().toISOString());
        let label = `Week ${week}`;
        if (week === nowWeek) label = 'This Week';
        else if (week === nowWeek - 1) label = 'Last Week';
        
        groups.push({ type: 'header', label, week });
      }
      groups.push({ type: 'item', data: trend });
    });
    return groups;
  }, [trends]);

  const handleToggleTrend = async (id) => {
    const trend = trends.find(t => t.id === id);
    const isSelected = selectedTrends.includes(id);

    if (!isSelected && trend?.status === 'sent') {
      if (!window.confirm('이 아이템은 이미 발송된 뉴스레터에 포함되어 있습니다. 다시 선택하시겠습니까?')) {
        return;
      }
    }

    // Optimistic UI Update
    setSelectedTrends(prev => 
      isSelected ? prev.filter(tid => tid !== id) : [...prev, id]
    );

    // If an active draft exists, sync with backend
    if (activeDraftId) {
      try {
        await axios.post(`${API_URL}/newsletters/active-draft/toggle-item`, { item_id: id });
      } catch (error) {
        console.error('Error syncing toggle:', error);
        showFeedback('Failed to sync changes with draft.', 'error');
        // Rollback on error
        setSelectedTrends(prev => 
          isSelected ? [...prev, id] : prev.filter(tid => tid !== id)
        );
      }
    }
  };

  const handleCreateDraftClick = () => {
    const duplicates = trends.filter(t => selectedTrends.includes(t.id) && t.status === 'sent');
    if (duplicates.length > 0) {
      setShowConfirmDialog(true);
    } else {
      executeCreateDraft();
    }
  };

  const executeCreateDraft = async () => {
    setLoading(true);
    setShowConfirmDialog(false);
    try {
      const response = await axios.post(`${API_URL}/newsletters`, { item_ids: selectedTrends });
      showFeedback('Newsletter draft created successfully!', 'success');
      setSelectedTrends([]);
      navigate(`/newsletters/${response.data.id}/draft`);
    } catch (error) {
      console.error('Error creating draft:', error);
      showFeedback('Failed to create draft.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCollect = async () => {
    setCollecting(true);
    try {
      await axios.post(`${API_URL}/trends/collect`);
      showFeedback('Data collection started...', 'info');
    } catch (error) {
      console.error('Error starting collection:', error);
      if (error.response?.status === 409) {
        showFeedback('Collection already in progress.', 'warning');
      } else {
        showFeedback('Failed to start collection.', 'error');
      }
    } finally {
      setCollecting(false);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Curator Dashboard" 
        action={
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCollect}
              disabled={collecting}
            >
              {collecting ? <CircularProgress size={24} /> : 'Collect Now'}
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleCreateDraftClick} 
              disabled={selectedTrends.length === 0 || loading}
            >
              {loading ? <CircularProgress size={24} /> : `Create Draft (${selectedTrends.length})`}
            </Button>
          </div>
        }
      />
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {groupedTrends.map((node, index) => {
            if (node.type === 'header') {
              return (
                <Grid size={{ xs: 12 }} key={`header-${node.week}-${index}`} sx={{ mt: 2 }}>
                  <Typography variant="h5" color="primary" gutterBottom>
                    {node.label}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
              );
            }
            const trend = node.data;
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={trend.id}>
                <TrendCard
                  title={trend.title}
                  summary={trend.summary || 'No summary available.'}
                  source={trend.source_name || 'Unknown Source'}
                  date={new Date(trend.published_at).toLocaleDateString()}
                  isSelected={selectedTrends.includes(trend.id)}
                  onToggle={() => handleToggleTrend(trend.id)}
                  status={trend.status}
                />
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
      >
        <DialogTitle>Duplicate Items Selected</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have selected one or more items that were previously sent in other newsletters. 
            Do you want to include them anyway?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={executeCreateDraft} color="primary" variant="contained" autoFocus>
            Yes, Include Them
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;
