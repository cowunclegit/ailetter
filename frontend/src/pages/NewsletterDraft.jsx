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
  Button,
  TextField,
  Paper
} from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import DraggableItem from '../components/features/DraggableItem';
import NewsletterPreview from '../components/features/NewsletterPreview';
import RichTextEditor from '../components/features/RichTextEditor';
import { useFeedback } from '../contexts/FeedbackContext';

const API_URL = '/api';

const NewsletterDraft = () => {
  const { id } = useParams();
  const [newsletter, setNewsletter] = useState(null);
  const [items, setItems] = useState([]);
  const [subject, setSubject] = useState('');
  const [introductionHtml, setIntroductionHtml] = useState('');
  const [conclusionHtml, setConclusionHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const { showFeedback } = useFeedback();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchNewsletter();
    fetchPreview();
  }, [id]);

  const fetchNewsletter = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/newsletters/${id}`);
      setNewsletter(response.data);
      setItems(response.data.items);
      setSubject(response.data.subject || '');
      setIntroductionHtml(response.data.introduction_html || '');
      setConclusionHtml(response.data.conclusion_html || '');
    } catch (error) {
      console.error('Error fetching newsletter:', error);
      showFeedback('Failed to load newsletter draft.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleAIRecommend = async () => {
    try {
      const response = await axios.post(`${API_URL}/newsletters/${id}/ai-recommend-subject`, {
        current_subject: subject
      });
      const newSubject = response.data.suggested_subject;
      setSubject(newSubject);
      
      // Persist immediately
      await axios.put(`${API_URL}/newsletters/${id}`, { 
        subject: newSubject
      });
      
      showFeedback('AI suggested a new subject', 'info');
      fetchPreview();
    } catch (error) {
      console.error('Error getting AI recommendation:', error);
      showFeedback('Failed to get AI recommendation.', 'error');
    }
  };

  const saveDraftContent = async () => {
    try {
      await axios.put(`${API_URL}/newsletters/${id}`, { 
        subject,
        introduction_html: introductionHtml,
        conclusion_html: conclusionHtml
      });
      showFeedback('Draft updated successfully', 'success');
      fetchPreview();
    } catch (error) {
      console.error('Error saving draft content:', error);
      showFeedback('Failed to save draft changes.', 'error');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this item?')) return;

    try {
      await axios.delete(`${API_URL}/newsletters/${id}/items/${itemId}`);
      setItems(items.filter(item => item.id !== itemId));
      showFeedback('Item removed successfully', 'success');
      fetchPreview();
    } catch (error) {
      console.error('Error deleting item:', error);
      showFeedback('Failed to remove item.', 'error');
    }
  };

  const fetchPreview = async () => {
    setPreviewLoading(true);
    try {
      const response = await axios.get(`${API_URL}/newsletters/${id}/preview`);
      setPreviewHtml(response.data);
    } catch (error) {
      console.error('Error fetching preview:', error);
    } finally {
      setPreviewLoading(false);
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
        fetchPreview(); // Refresh preview after reordering
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
      />
      
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              label="Subject"
              variant="outlined"
              fullWidth
              value={subject}
              onChange={handleSubjectChange}
              onBlur={saveDraftContent}
              placeholder="Newsletter Subject"
            />
            <Button 
              variant="outlined" 
              onClick={handleAIRecommend}
              sx={{ whiteSpace: 'nowrap', height: '56px' }}
            >
              AI Recommend
            </Button>
          </Box>
        </Paper>
      </Box>

      <Box sx={{ mt: 4, mb: 4 }}>
        <RichTextEditor 
          label="Introduction" 
          value={introductionHtml} 
          onChange={setIntroductionHtml} 
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="contained" onClick={saveDraftContent} size="small">
            Save Introduction
          </Button>
        </Box>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Drag to Reorder Items</Typography>
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
                originalUrl={item.original_url}
                onDelete={handleDeleteItem}
              />
            ))}
          </SortableContext>
        </DndContext>
      </Box>

      <Box sx={{ mt: 4, mb: 4 }}>
        <RichTextEditor 
          label="Conclusion" 
          value={conclusionHtml} 
          onChange={setConclusionHtml} 
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="contained" onClick={saveDraftContent} size="small">
            Save Conclusion
          </Button>
        </Box>
      </Box>

      <NewsletterPreview 
        subject={subject}
        html={previewHtml} 
        loading={previewLoading} 
        onSendTest={handleSendTest}
        sendingTest={sending}
      />
    </Container>
  );
};

export default NewsletterDraft;