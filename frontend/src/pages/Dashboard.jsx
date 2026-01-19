import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CollectButton from '../components/CollectButton';
import PageHeader from '../components/common/PageHeader';
import DailyGroup from '../components/features/DailyGroup';
import TagFilter from '../components/features/TagFilter';
import { groupTrendsByDate } from '../utils/dateUtils';
import { trendsApi } from '../api/trendsApi';
import { categoriesApi } from '../api/categoriesApi';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { 
  Button, 
  CircularProgress, 
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { useFeedback } from '../contexts/FeedbackContext';

const API_URL = '/api'; 

const Dashboard = () => {
  const [trends, setTrends] = useState([]);
  const [selectedTrends, setSelectedTrends] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeDraftId, setActiveDraftId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const { showFeedback } = useFeedback();
  const navigate = useNavigate();

  const fetchTrends = useCallback(async (isReset = false, categoryIds = selectedCategoryIds) => {
    try {
      setLoading(true);
      const currentOffset = isReset ? 0 : offset;
      const limit = 20;
      
      const params = { 
        limit, 
        offset: currentOffset,
        startDate: '2000-01-01',
        categoryIds
      };

      const data = await trendsApi.getTrends(params);
      const items = Array.isArray(data) ? data : [];
      
      if (isReset) {
        setTrends(items);
        setOffset(items.length);
      } else {
        setTrends(prev => [...prev, ...items]);
        setOffset(prev => prev + items.length);
      }
      
      if (items.length < limit) setHasMore(false);
      else setHasMore(true);

    } catch (error) {
      console.error('Error fetching trends:', error);
      showFeedback('Failed to load trends.', 'error');
    } finally {
      setLoading(false);
    }
  }, [offset, showFeedback, selectedCategoryIds]);

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Initial load
  useEffect(() => {
    const initializeDashboard = async () => {
      await Promise.all([
        fetchTrends(true), 
        detectActiveDraft(),
        loadCategories()
      ]);
    };
    initializeDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lastTrendElementRef = useInfiniteScroll(() => {
    fetchTrends(false);
  }, hasMore, loading);

  const detectActiveDraft = async () => {
    try {
      const response = await axios.get(`${API_URL}/newsletters/active-draft`);
      if (response.data && response.data.items) {
        setActiveDraftId(response.data.id);
        setSelectedTrends(response.data.items.map(item => item.id));
      } else {
        setActiveDraftId(response.data?.id || null);
        setSelectedTrends([]);
      }
    } catch (error) {
      console.error('Error detecting active draft:', error);
    }
  };

  const groupedTrends = useMemo(() => {
    return groupTrendsByDate(trends);
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

  const handleReset = async () => {
    setShowResetDialog(false);
    try {
      await axios.post(`${API_URL}/newsletters/active-draft/clear`);
      showFeedback('Selection cleared', 'success');
      setSelectedTrends([]);
    } catch (error) {
      console.error('Error clearing draft:', error);
      showFeedback('Failed to clear selection.', 'error');
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

  const handleCategoryChange = (ids) => {
    setSelectedCategoryIds(ids);
    fetchTrends(true, ids);
  };

  return (
    <div>
      <PageHeader 
        title="Curator Dashboard" 
        action={
          <div style={{ display: 'flex', gap: '10px' }}>
             <Button
              variant="outlined"
              color="warning"
              onClick={() => setShowResetDialog(true)}
              disabled={selectedTrends.length === 0}
            >
              Reset Selection
            </Button>
            <CollectButton 
              variant="outlined" 
              color="secondary" 
              onComplete={() => {
                fetchTrends(true);
                showFeedback('Collection complete. Trends updated.', 'success');
              }}
            />
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

      <Box sx={{ mb: 3 }}>
        <TagFilter 
          categories={categories} 
          selectedIds={selectedCategoryIds} 
          onChange={handleCategoryChange} 
        />
      </Box>
      
      {groupedTrends.map((group, index) => {
          const isLastGroup = index === groupedTrends.length - 1;
          return (
            <div key={group.date} ref={isLastGroup ? lastTrendElementRef : null}>
              <DailyGroup 
                date={group.date} 
                items={group.items} 
                selectedTrends={selectedTrends}
                onToggleTrend={handleToggleTrend}
              />
            </div>
          );
      })}
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {!hasMore && !loading && trends.length > 0 && (
         <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <DialogContentText>No more trends to load.</DialogContentText>
         </Box>
      )}
      
      {!loading && trends.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
           <DialogContentText>No trends found. Try collecting new data or changing filters.</DialogContentText>
        </Box>
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
      
       <Dialog
        open={showResetDialog}
        onClose={() => setShowResetDialog(false)}
      >
        <DialogTitle>Reset Selection?</DialogTitle>
        <DialogContent>
          <DialogContentText>
             Are you sure you want to clear the current draft selection? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResetDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleReset} color="warning" variant="contained" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;