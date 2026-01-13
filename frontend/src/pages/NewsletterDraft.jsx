import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { 
  Container, 
  Box, 
  CircularProgress, 
  Typography,
  Button
} from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import DraggableItem from '../components/features/DraggableItem';
import { useFeedback } from '../contexts/FeedbackContext';

const API_URL = '/api';

const NewsletterDraft = () => {
  const { id } = useParams();
  const [newsletter, setNewsletter] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { showFeedback } = useFeedback();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchNewsletter();
  }, [id]);

  const fetchNewsletter = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/newsletters/${id}`);
      setNewsletter(response);
      setItems(response.data.items);
    } catch (error) {
      console.error('Error fetching newsletter:', error);
      showFeedback('Failed to load newsletter draft.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendTest = async () => {
    setSending(true);
    try {
      await axios.post(`${API_URL}/newsletters/${id}/send-test`);
      showFeedback('Test email sent to administrator.', 'info');
    } catch (error) {
      console.error('Error sending test email:', error);
      showFeedback('Failed to send test email.', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      // Persist to backend
      try {
        const itemOrders = newItems.map((item, index) => ({
          trend_item_id: item.id,
          display_order: index
        }));
        await axios.put(`${API_URL}/newsletters/${id}/reorder`, { item_orders: itemOrders });
        showFeedback('Order updated successfully', 'success');
      } catch (error) {
        console.error('Error updating order:', error);
        showFeedback('Failed to save new order.', 'error');
        // Rollback on failure? For now, just show error
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!newsletter) {
    return <Typography variant="h6">Newsletter not found.</Typography>;
  }

  return (
    <Container maxWidth="md">
      <PageHeader 
        title={`Organize Newsletter #${id}`} 
        action={
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSendTest}
            disabled={sending}
          >
            {sending ? <CircularProgress size={24} color="inherit" /> : 'Send Test Mail'}
          </Button>
        }
      />
      
      <Box sx={{ mt: 4 }}>
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={items.map(i => i.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <DraggableItem 
                key={item.id} 
                id={item.id} 
                title={item.title} 
                source={item.source_name} 
                date={new Date(item.published_at).toLocaleDateString()} 
              />
            ))}
          </SortableContext>
        </DndContext>
      </Box>
    </Container>
  );
};

export default NewsletterDraft;